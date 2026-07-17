import json,sys,time,requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public'/'transcripts'; URL='https://translate.googleapis.com/translate_a/single'
def call(lines):
    text='\n'.join(x.replace('\n',' ') for x in lines)
    for attempt in range(5):
        try:
            r=requests.get(URL,params={'client':'gtx','sl':'en','tl':'zh-CN','dt':'t','q':text},timeout=45);r.raise_for_status();out=''.join(x[0] for x in r.json()[0]).splitlines()
            if len(out)==len(lines):return out
        except Exception:
            time.sleep(1.5*(attempt+1))
    if len(lines)>1:return sum((call([x]) for x in lines),[])
    return ['[翻译暂时失败]']
def batches(rows):
    cur=[];chars=0
    for i,s in enumerate(rows):
        n=len(s['en'])+1
        if cur and (len(cur)>=18 or chars+n>2800):yield cur;cur=[];chars=0
        cur.append((i,s['en']));chars+=n
    if cur:yield cur
for vid in (sys.argv[1:] or ['Mxs4erDxOEE','jX-Uq8JJ_j8','8L5cwyaB_eg']):
    f=OUT/f'{vid}.json';d=json.loads(f.read_text(encoding='utf-8'));jobs=list(batches([s for s in d['segments'] if not s.get('zh')]))
    # Rebuild indices directly because current files begin untranslated.
    jobs=[];cur=[];chars=0
    for i,s in enumerate(d['segments']):
        if s.get('zh'):continue
        n=len(s['en'])+1
        if cur and (len(cur)>=18 or chars+n>2800):jobs.append(cur);cur=[];chars=0
        cur.append((i,s['en']));chars+=n
    if cur:jobs.append(cur)
    print(f'START {vid} batches={len(jobs)}',flush=True);done=0
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs={ex.submit(call,[x[1] for x in job]):job for job in jobs}
        for fut in as_completed(futs):
            job=futs[fut];out=fut.result()
            for (idx,_),zh in zip(job,out):d['segments'][idx]['zh']=zh
            done+=1
            if done%10==0:
                f.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8');print(f'PROGRESS {vid} {done}/{len(jobs)}',flush=True)
    d['translation']='Google machine translation (batch generated, 2026-07-15)';f.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8');print(f'DONE {vid}',flush=True)
