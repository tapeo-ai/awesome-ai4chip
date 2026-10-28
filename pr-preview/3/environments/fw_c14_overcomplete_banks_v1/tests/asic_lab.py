"""Native generic-RTL checking, exact Boolean polynomial proof, SKY130 mapping and STA.

The area/timing objective is explicitly pre-layout; it is not tapeout signoff.
"""
from pathlib import Path
import json,os,re,subprocess,tempfile

class ProofResourceLimit(RuntimeError):pass

def poly_mul(a,b):
    if not a or not b:return set()
    if a=={0}:return b.copy()
    if b=={0}:return a.copy()
    if a==b:return a.copy()  # f^2=f in the Boolean ring, not in a general polynomial ring.
    if len(a)*len(b)>2000000:raise ProofResourceLimit('ANF product exceeds verifier working bound; independently audit this attempt')
    out=set()
    for u in a:
        for v in b:
            key=u|v
            if key in out:out.remove(key)
            else:out.add(key)
    if len(out)>200000:raise ProofResourceLimit('ANF working set exceeds verifier bound')
    return out

def gate(kind,a,b=None,s=None):
    if kind=='$_NOT_':return a^{0}
    if kind=='$_BUF_':return a.copy()
    if kind=='$_XOR_':return a^b
    if kind=='$_XNOR_':return a^b^{0}
    if kind=='$_AND_':return poly_mul(a,b)
    if kind=='$_NAND_':return poly_mul(a,b)^{0}
    if kind=='$_OR_':return a^b^poly_mul(a,b)
    if kind=='$_NOR_':return a^b^poly_mul(a,b)^{0}
    if kind=='$_ANDNOT_':return poly_mul(a,b^{0})
    if kind=='$_ORNOT_':return a^(b^{0})^poly_mul(a,b^{0})
    if kind=='$_MUX_':return a^poly_mul(s,a^b)
    raise ValueError('Not a supported combinational gate: '+kind)

def indexed_bits(port):
    if port.get('offset',0)!=0:raise ValueError('port indices must start at zero')
    bits=port['bits'];return list(reversed(bits)) if port.get('upto',0) else bits

def prove_function(netlist,spec):
    module=netlist['modules'][spec['module']];ports=module['ports']
    if set(ports)!={'x','y'} or ports['x']['direction']!='input' or ports['y']['direction']!='output':raise ValueError('wrong module ports')
    inputs=indexed_bits(ports['x']);outputs=indexed_bits(ports['y'])
    if len(inputs)!=spec['input_bits'] or len(outputs)!=len(spec['polynomials']):raise ValueError('wrong port width')
    values={'0':set(),'1':{0}};values.update({bit:{1<<i} for i,bit in enumerate(inputs)})
    pending=[c for c in module.get('cells',{}).values() if c['type']!='$scopeinfo']
    processed=0
    while pending:
        rest=[];progress=False
        for cell in pending:
            con=cell['connections'];kind=cell['type']
            if any(len(v)!=1 for v in con.values()):raise ValueError('frontend did not lower a cell to bit gates')
            needed=[k for k in con if cell['port_directions'][k]=='input']
            if not all(con[k][0] in values for k in needed):rest.append(cell);continue
            if 'Y' not in con or len(con['Y'])!=1:raise ValueError('sequential/unsupported logic in combinational design')
            a=values[con['A'][0]] if 'A' in con else None;b=values[con['B'][0]] if 'B' in con else None;s=values[con['S'][0]] if 'S' in con else None
            values[con['Y'][0]]=gate(kind,a,b,s);processed+=1;progress=True
        if not progress:raise ValueError('cycle, undriven signal, or sequential logic')
        pending=rest
    for i,bit in enumerate(outputs):
        expected={int(x,16) for x in spec['polynomials'][i]}
        if bit not in values or values[bit]!=expected:
            return {'pass_':False,'reason':'exact Boolean function mismatch','output_bit':i,
                    'differing_monomials':len(values.get(bit,set())^expected),'proof_gate_count':processed}
    return {'pass_':True,'proof_gate_count':processed,'method':'exact algebraic normal form over GF(2), with x_i^2=x_i; all inputs proved'}

def native_config(public):
    p=Path(public)/'runtime.json';c=json.loads(p.read_text())
    for key in ['liberty','tech_lef','cell_lef']:
        if not Path(c[key]).is_absolute():c[key]=str((Path(public)/c[key]).resolve())
    # Author and sandbox deployments provide the same tools through different absolute roots.
    override=os.environ.get('FRONTIER_ASIC_RUNTIME')
    if override:c.update(json.loads(Path(override).read_text()))
    return c

def synthesize_and_assess(source,spec,config,work):
    source=Path(source).resolve();work=Path(work).resolve();work.mkdir(parents=True,exist_ok=True)
    for name in ['expanded.v','logic.json','mapped.v','metrics.json','yosys.log','openroad.log','sta.tcl']:
        (work/name).unlink(missing_ok=True)
    expanded=work/'expanded.v'
    ic=config['iverilog'];cc=ic if isinstance(ic,list) else [ic]
    pre=subprocess.run(cc+['-g2012','-DSYNTHESIS','-E','-o',str(expanded),str(source)],cwd=source.parent,capture_output=True,text=True,timeout=60)
    if pre.returncode:return {'pass_':False,'reason':'Verilog preprocessing','detail':pre.stderr[-1500:]}
    content=re.sub(r'//[^\n]*|/\*.*?\*/|"(?:\\.|[^"\\])*"',' ',expanded.read_text(),flags=re.S)
    forbidden=set(re.findall(r'\$[A-Za-z_][A-Za-z_0-9]*',content))-{'$clog2','$bits','$signed','$unsigned'}
    if forbidden:return {'pass_':False,'reason':'simulation side effects are not generic combinational RTL','system_tasks':sorted(forbidden)}
    prefix=f'read_verilog -sv expanded.v; hierarchy -check -top {spec["module"]}; synth -top {spec["module"]} -flatten -noabc; check -assert; '
    script=prefix+'write_json logic.json; '+f'abc -liberty "{config["liberty"]}"; clean; write_verilog -noattr mapped.v; stat -liberty "{config["liberty"]}"'
    p=subprocess.run([config['yosys'],'-Q','-T','-p',script],cwd=work,capture_output=True,text=True,timeout=300)
    (work/'yosys.log').write_text(p.stdout+'\n'+p.stderr)
    if p.returncode or not (work/'logic.json').is_file() or not (work/'mapped.v').is_file():
        return {'pass_':False,'reason':'native synthesis failed','detail':(p.stdout+'\n'+p.stderr)[-1800:]}
    proof=prove_function(json.loads((work/'logic.json').read_text()),spec)
    if not proof['pass_']:return proof
    metric=work/'metrics.json';period=spec['max_delay_ns']
    tcl=f'''read_lef {{{config['tech_lef']}}}
read_lef {{{config['cell_lef']}}}
read_liberty {{{config['liberty']}}}
read_verilog {{{work/'mapped.v'}}}
link_design {spec['module']}
create_clock -name virtual_clock -period {period}
set_input_delay 0 -clock virtual_clock [all_inputs]
set_output_delay 0 -clock virtual_clock [all_outputs]
set_input_transition {spec['input_slew_ns']} [all_inputs]
set_load {spec['output_load_pf']} [all_outputs]
set block [ord::get_db_block]
set dbu [$block getDbUnitsPerMicron]
set area 0.0
foreach inst [$block getInsts] {{
 set master [$inst getMaster]
 set area [expr {{$area + double([$master getWidth]) * [$master getHeight] / ($dbu * $dbu)}}]
}}
set slack [sta::worst_slack -max]
set f [open {{{metric}}} w]
puts $f [format {{"area_um2": %.15g, "worst_slack_ns": %.15g}} $area $slack]
close $f
report_checks -path_delay max -digits 6
report_design_area
exit
'''
    # Tcl's outer format braces are grouping syntax; explicitly add JSON braces.
    tcl=tcl.replace('puts $f [format {"area_um2":','puts $f [format {{"area_um2":').replace('%.15g} $area $slack]','%.15g}} $area $slack]')
    (work/'sta.tcl').write_text(tcl)
    env=os.environ.copy();env.update(config.get('openroad_env',{}))
    p=subprocess.run([config['openroad'],'-no_init','-exit',str(work/'sta.tcl')],cwd=work,env=env,capture_output=True,text=True,timeout=180)
    (work/'openroad.log').write_text(p.stdout+'\n'+p.stderr)
    # Some native startup failures exit zero. A newly generated metric artifact is mandatory.
    if p.returncode or not metric.is_file():raise RuntimeError('OpenROAD failed to produce metrics: '+(p.stdout+'\n'+p.stderr)[-1200:])
    result=json.loads(metric.read_text());result['max_delay_ns']=period-result['worst_slack_ns']
    result.update(proof=proof,pass_=bool(result['area_um2']<=spec['max_area_um2']+1e-5 and result['worst_slack_ns']>=-1e-7))
    return result

def evaluate_submission(public,output):
    public=Path(public);output=Path(output);spec=json.loads((public/'spec.json').read_text());config=native_config(public)
    if not (output/'design.v').is_file():return {'pass_':False,'reason':'missing design.v'}
    with tempfile.TemporaryDirectory(prefix='frontier-asic-') as td:
        try:return synthesize_and_assess(output/'design.v',spec,config,Path(td))
        except ProofResourceLimit as exc:return {'pass_':None,'verification_resource_error':str(exc)}
        except (ValueError,KeyError,TypeError) as exc:return {'pass_':False,'reason':str(exc)}
