"""Trusted all-input native verification for a batch of quadratic feature banks."""
from pathlib import Path
import json,tempfile
from asic_lab import native_config,synthesize_and_assess,ProofResourceLimit

def evaluate_submission(public,output):
    public=Path(public);output=Path(output);config=native_config(public);cases=json.loads((public/'cases.json').read_text());results={}
    for case in cases:
        try:
            source=output/case['output'];spec=json.loads((public/case['spec']).read_text())
            if not source.is_file():results[case['id']]={'pass_':False,'reason':'missing '+case['output']};continue
            with tempfile.TemporaryDirectory(prefix='feature-bank-') as td:results[case['id']]=synthesize_and_assess(source,spec,config,Path(td))
        except ProofResourceLimit as exc:return {'pass_':None,'verification_resource_error':str(exc),'cases':results}
        except (ValueError,KeyError,TypeError,OSError) as exc:results[case['id']]={'pass_':False,'reason':str(exc)}
    return {'pass_':all(x['pass_'] for x in results.values()),'cases':results}
