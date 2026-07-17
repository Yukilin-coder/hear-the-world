import json,sys,time
from pathlib import Path
from argostranslate import package, translate
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public'/'transcripts'
langs=translate.get_installed_languages(); src=next((x for x in langs if x.code=='en'),None); dst=next((x for x in langs if x.code in ('zh','zt')),None)
if not src or not dst:
    print('Downloading Argos en->zh model...',flush=True); package.update_package_index(); packs=package.get_available_packages(); p=next((x for x in packs if x.from_code=='en' and x.to_code in ('zh','zt')),None)
    if not p: raise RuntimeError('No en->zh Argos package found')
    package.install_from_path(p.download()); langs=translate.get_installed_languages(); src=next(x for x in langs if x.code=='en'); dst=next(x for x in langs if x.code in ('zh','zt'))
translator=src.get_translation(dst); print('Translator ready',flush=True)
ids=sys.argv[1:] or ['Mxs4erDxOEE','jX-Uq8JJ_j8','8L5cwyaB_eg']
for vid in ids:
    f=OUT/f'{vid}.json'; d=json.loads(f.read_text(encoding='utf-8')); started=time.time(); total=len(d['segments'])
    for i,s in enumerate(d['segments'],1):
        if not s.get('zh'): s['zh']=translator.translate(s['en'])
        if i%25==0:
            f.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8'); print(f'PROGRESS {vid} {i}/{total}',flush=True)
    d['translation']='Argos Translate en-zh (local machine translation)'; f.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8'); print(f'DONE {vid} {total} elapsed={(time.time()-started)/60:.1f}min',flush=True)
