from pathlib import Path
import json, os, re, subprocess, tempfile

def indexed_bits(port):
    if port.get('offset', 0) != 0:
        raise ValueError('port indices must start at zero')
    bits = port['bits']
    return list(reversed(bits)) if port.get('upto', 0) else bits

def native_config(public):
    p = Path(public) / 'runtime.json'
    c = json.loads(p.read_text())
    for key in ['liberty', 'tech_lef', 'cell_lef']:
        if not Path(c[key]).is_absolute():
            c[key] = str((Path(public) / c[key]).resolve())
    override = os.environ.get('FRONTIER_ASIC_RUNTIME')
    if override:
        c.update(json.loads(Path(override).read_text()))
    return c

def synthesize_and_assess(source, spec, config, work):
    source = Path(source).resolve()
    work = Path(work).resolve()
    work.mkdir(parents=True, exist_ok=True)
    for name in ['expanded.v', 'logic.json', 'mapped.v', 'metrics.json', 'yosys.log', 'openroad.log', 'sta.tcl']:
        (work / name).unlink(missing_ok=True)
    expanded = work / 'expanded.v'
    ic = config['iverilog']
    cc = ic if isinstance(ic, list) else [ic]
    pre = subprocess.run(cc + ['-g2012', '-DSYNTHESIS', '-E', '-o', str(expanded), str(source)], cwd=source.parent, capture_output=True, text=True, timeout=60)
    if pre.returncode:
        return {'pass_': False, 'reason': 'Verilog preprocessing', 'detail': pre.stderr[-1500:]}
    content = re.sub('//[^\\n]*|/\\*.*?\\*/|"(?:\\\\.|[^"\\\\])*"', ' ', expanded.read_text(), flags=re.S)
    forbidden = set(re.findall('\\$[A-Za-z_][A-Za-z_0-9]*', content)) - {'$clog2', '$bits', '$signed', '$unsigned'}
    if forbidden:
        return {'pass_': False, 'reason': 'simulation side effects are not generic combinational RTL', 'system_tasks': sorted(forbidden)}
    prefix = f"read_verilog -sv expanded.v; hierarchy -check -top {spec['module']}; synth -top {spec['module']} -flatten -noabc; check -assert; "
    script = prefix + 'write_json logic.json; ' + f'''abc -liberty "{config['liberty']}"; clean; write_verilog -noattr mapped.v; stat -liberty "{config['liberty']}"'''
    p = subprocess.run([config['yosys'], '-Q', '-T', '-p', script], cwd=work, capture_output=True, text=True, timeout=300)
    (work / 'yosys.log').write_text(p.stdout + '\n' + p.stderr)
    if p.returncode or not (work / 'logic.json').is_file() or (not (work / 'mapped.v').is_file()):
        return {'pass_': False, 'reason': 'native synthesis failed', 'detail': (p.stdout + '\n' + p.stderr)[-1800:]}
    proof = prove_function(json.loads((work / 'logic.json').read_text()), spec)
    if not proof['pass_']:
        return proof
    metric = work / 'metrics.json'
    period = spec['max_delay_ns']
    tcl = f"""read_lef {{{config['tech_lef']}}}\nread_lef {{{config['cell_lef']}}}\nread_liberty {{{config['liberty']}}}\nread_verilog {{{work / 'mapped.v'}}}\nlink_design {spec['module']}\ncreate_clock -name virtual_clock -period {period}\nset_input_delay 0 -clock virtual_clock [all_inputs]\nset_output_delay 0 -clock virtual_clock [all_outputs]\nset_input_transition {spec['input_slew_ns']} [all_inputs]\nset_load {spec['output_load_pf']} [all_outputs]\nset block [ord::get_db_block]\nset dbu [$block getDbUnitsPerMicron]\nset area 0.0\nforeach inst [$block getInsts] {{\n set master [$inst getMaster]\n set area [expr {{$area + double([$master getWidth]) * [$master getHeight] / ($dbu * $dbu)}}]\n}}\nset slack [sta::worst_slack -max]\nset f [open {{{metric}}} w]\nputs $f [format {{"area_um2": %.15g, "worst_slack_ns": %.15g}} $area $slack]\nclose $f\nreport_checks -path_delay max -digits 6\nreport_design_area\nexit\n"""
    tcl = tcl.replace('puts $f [format {"area_um2":', 'puts $f [format {{"area_um2":').replace('%.15g} $area $slack]', '%.15g}} $area $slack]')
    (work / 'sta.tcl').write_text(tcl)
    env = os.environ.copy()
    env.update(config.get('openroad_env', {}))
    p = subprocess.run([config['openroad'], '-no_init', '-exit', str(work / 'sta.tcl')], cwd=work, env=env, capture_output=True, text=True, timeout=180)
    (work / 'openroad.log').write_text(p.stdout + '\n' + p.stderr)
    if p.returncode or not metric.is_file():
        raise RuntimeError('OpenROAD failed to produce metrics: ' + (p.stdout + '\n' + p.stderr)[-1200:])
    result = json.loads(metric.read_text())
    result['max_delay_ns'] = period - result['worst_slack_ns']
    result.update(proof=proof, pass_=bool(result['area_um2'] <= spec['max_area_um2'] + 1e-05 and result['worst_slack_ns'] >= -1e-07))
    return result
def prove_function(netlist,spec):
    module=netlist['modules'][spec['module']];ports=module['ports']
    if set(ports)!={'x','y'}:return {'pass_':False,'method':'bring-up only','reason':'ports'}
    inputs=indexed_bits(ports['x']);outputs=indexed_bits(ports['y'])
    words=[0]+[1<<i for i in range(spec['input_bits'])]
    for word in words:
        values={'0':0,'1':1};values.update({bit:(word>>i)&1 for i,bit in enumerate(inputs)})
        pending=[c for c in module.get('cells',{}).values() if c['type']!='$scopeinfo']
        while pending:
            rest=[];progress=False
            for cell in pending:
                c=cell['connections'];kind=cell['type'];needed=[key for key in c if cell['port_directions'][key]=='input']
                if any(len(v)!=1 for v in c.values()) or 'Y' not in c:raise ValueError('unsupported combinational cell')
                if not all(c[key][0] in values for key in needed):rest.append(cell);continue
                a=values[c['A'][0]] if 'A' in c else 0;b=values[c['B'][0]] if 'B' in c else 0;s=values[c['S'][0]] if 'S' in c else 0
                ops={'$_NOT_':a^1,'$_BUF_':a,'$_XOR_':a^b,'$_XNOR_':a^b^1,'$_AND_':a&b,'$_NAND_':(a&b)^1,'$_OR_':a|b,'$_NOR_':(a|b)^1,'$_ANDNOT_':a&(b^1),'$_ORNOT_':a|(b^1),'$_MUX_':b if s else a}
                if kind not in ops:raise ValueError('unsupported cell '+kind)
                values[c['Y'][0]]=ops[kind];progress=True
            if not progress:raise ValueError('cycle or undriven signal')
            pending=rest
        expected=[sum((word&int(term,16))==int(term,16) for term in p)%2 for p in spec['polynomials']]
        if [values[b] for b in outputs]!=expected:return {'pass_':False,'method':'zero/one-hot bring-up only','word':hex(word)}
    return {'pass_':True,'method':'ZERO AND ONE-HOT BRING-UP ONLY, NOT ALL-INPUT EQUIVALENCE','tested_words':len(words)}

if __name__=='__main__':
    import sys
    public=Path(__file__).parent
    cases=json.loads((public/'cases.json').read_text());case=next(x for x in cases if x['id']==sys.argv[1]);spec=json.loads((public/case['spec']).read_text())
    with tempfile.TemporaryDirectory(prefix='bringup-') as td:result=synthesize_and_assess(Path(sys.argv[2])/case['output'],spec,native_config(public),Path(td))
    result['bringup_pass']=result.pop('pass_');result['coverage_warning']='Only zero/one-hot words tested; independent full equivalence is required.'
    if 'proof' in result:result['smoke']=result.pop('proof')
    print(json.dumps(result,indent=2))
