const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.m4a':'audio/mp4','.vtt':'text/vtt; charset=utf-8','.svg':'image/svg+xml'};
let localDictionary={};try{localDictionary=JSON.parse(fs.readFileSync(path.join(root,'dictionary.json'),'utf8'))}catch{}
const exampleIndex={};
try{for(const file of fs.readdirSync(path.join(root,'transcripts')).filter(x=>x.endsWith('.json'))){const data=JSON.parse(fs.readFileSync(path.join(root,'transcripts',file),'utf8'));for(const seg of data.segments||[]){const en=(seg.en||'').trim(),zh=(seg.zh||'').trim();if(!en||!zh)continue;const score=(en.length>=45&&en.length<=220?3:0)+(en.match(/[.!?]$/)?2:0);for(const word of new Set((en.match(/[A-Za-z][A-Za-z'-]*/g)||[]).map(x=>x.toLowerCase()))){if(!exampleIndex[word]||score>exampleIndex[word].score)exampleIndex[word]={en,zh,score}}}}}catch{}
Object.assign(exampleIndex,{
  incontrovertible:{en:'The evidence was incontrovertible, so the jury reached a clear verdict.',zh:'证据无可辩驳，因此陪审团作出了明确裁决。',score:99},
  reversible:{en:'Fortunately, the decision is reversible, so we can change it later.',zh:'幸运的是，这项决定是可撤销的，因此我们之后还可以更改。',score:99},
  allocation:{en:'A fair allocation of resources gives every team a chance to succeed.',zh:'公平的资源分配能让每个团队都有成功的机会。',score:99},
  spectrum:{en:'People hold a wide spectrum of opinions on this issue.',zh:'人们对这个问题持有各种各样的观点。',score:99},
  grain:{en:'A single grain of rice may look small, but every grain matters when food is scarce.',zh:'一粒米看似微小，但在食物匮乏时，每一粒都很重要。',score:99}
});
const wordCache=new Map();
async function defineWord(word){
  const key=word.toLowerCase();if(wordCache.has(key))return wordCache.get(key);
  const local=localDictionary[key];
  if(local){const clean=x=>(x||'').replace(/\?/g,'；').replace(/；+/g,'；');const result={word,phonetic:local.phonetic||'',definitionZh:clean(local.translation),definitionEn:clean(local.definition),pos:local.pos||[]};wordCache.set(key,result);return result;}
  let phonetic='',definitionEn='';
  try{const r=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);if(r.ok){const d=(await r.json())[0];phonetic=d.phonetic||d.phonetics?.find(x=>x.text)?.text||'';definitionEn=d.meanings?.[0]?.definitions?.[0]?.definition||''}}catch{}
  if(!definitionEn)definitionEn=`The contextual meaning of ${word}`;
  let definitionZh='';try{const u=new URL('https://translate.googleapis.com/translate_a/single');for(const [k,v] of Object.entries({client:'gtx',sl:'en',tl:'zh-CN',dt:'t',q:definitionEn}))u.searchParams.set(k,v);const r=await fetch(u);if(r.ok)definitionZh=(await r.json())[0].map(x=>x[0]).join('')}catch{}
  if(!definitionZh)definitionZh=`${word}：请结合当前句子理解该词的语境含义。`;
  const result={word,phonetic,definitionZh,definitionEn};wordCache.set(key,result);return result;
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(url.pathname);
  if(pathname==='/config.js'){
    const config={SUPABASE_URL:process.env.SUPABASE_URL||'',SUPABASE_ANON_KEY:process.env.SUPABASE_ANON_KEY||'',PUBLIC_MEDIA_MODE:process.env.PUBLIC_MEDIA_MODE||'local'};
    res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});return res.end(`window.APP_CONFIG=${JSON.stringify(config)};`);
  }  if(pathname==='/api/example'){
    const word=(url.searchParams.get('word')||'').trim().toLowerCase();const item=exampleIndex[word];res.writeHead(item?200:404,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=86400'});return res.end(JSON.stringify(item||{error:'not found'}));
  }  if(pathname==='/api/define'){
    const word=(url.searchParams.get('word')||'').trim();if(!/^[A-Za-z][A-Za-z'-]{0,60}$/.test(word)){res.writeHead(400,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'invalid word'}))}
    try{const result=await defineWord(word);res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=86400'});return res.end(JSON.stringify(result))}catch(e){res.writeHead(500,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:e.message}))}
  }
  const requested=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');const file=path.normalize(path.join(root,requested));
  if(!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden')}
  fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found')}const headers={'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream'};const range=req.headers.range;if(range&&path.extname(file)==='.m4a'){const [a,b]=range.replace(/bytes=/,'').split('-'),start=Number(a),end=b?Number(b):stat.size-1;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;headers['Accept-Ranges']='bytes';headers['Content-Length']=end-start+1;res.writeHead(206,headers);return fs.createReadStream(file,{start,end}).pipe(res)}headers['Content-Length']=stat.size;res.writeHead(200,headers);fs.createReadStream(file).pipe(res)})
});
const port=Number(process.env.PORT||4173);server.listen(port,'127.0.0.1',()=>console.log(`听见英语: http://127.0.0.1:${port}`));
