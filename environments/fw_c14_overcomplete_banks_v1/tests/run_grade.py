from pathlib import Path
import json, grader
candidate=Path('/home/node/workspace/output/feature_alpha.v')
if not candidate.is_file():
    result={'pass_':False,'error':'missing artifact'}
else:
    result=grader.evaluate_submission(Path('/tests/public'),candidate.parent)
logs=Path('/logs/verifier');logs.mkdir(parents=True,exist_ok=True)
(logs/'native-report.json').write_text(json.dumps(result,indent=2))
if result.get('pass_') is None:
    raise RuntimeError('Verifier could not make a valid scientific determination')
(logs/'reward.txt').write_text('1' if result['pass_'] else '0')
print(json.dumps(result,indent=2))
