import json, sys, time
from pathlib import Path
from faster_whisper import WhisperModel

ROOT=Path(__file__).resolve().parents[1]
AUDIO=ROOT/'public'/'audio'
OUT=ROOT/'public'/'transcripts'
OUT.mkdir(parents=True,exist_ok=True)
ids=sys.argv[1:] or ['Mxs4erDxOEE','jX-Uq8JJ_j8','8L5cwyaB_eg']
print('Loading base.en on CPU...',flush=True)
model=WhisperModel('base.en',device='cpu',compute_type='int8',cpu_threads=8)
for video_id in ids:
    source=AUDIO/f'{video_id}.m4a'; target=OUT/f'{video_id}.json'; started=time.time()
    print(f'START {video_id} {source.stat().st_size/1024/1024:.1f}MB',flush=True)
    stream,info=model.transcribe(str(source),language='en',beam_size=1,best_of=1,vad_filter=True,vad_parameters=dict(min_silence_duration_ms=500),condition_on_previous_text=False,word_timestamps=False)
    rows=[]
    for i,s in enumerate(stream,1):
        text=s.text.strip()
        if not text: continue
        rows.append({'start':round(s.start,2),'end':round(s.end,2),'en':text,'zh':''})
        if i%10==0:
            target.write_text(json.dumps({'id':video_id,'model':'faster-whisper base.en (independent ASR)','language':info.language,'complete':False,'segments':rows},ensure_ascii=False,indent=2),encoding='utf-8')
            print(f'PROGRESS {video_id} segments={len(rows)} audio={s.end/60:.1f}min',flush=True)
    target.write_text(json.dumps({'id':video_id,'model':'faster-whisper base.en (independent ASR)','language':info.language,'complete':True,'segments':rows},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'DONE {video_id} segments={len(rows)} elapsed={(time.time()-started)/60:.1f}min',flush=True)
