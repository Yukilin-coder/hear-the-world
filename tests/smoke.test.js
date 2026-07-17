const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public');
['index.html','styles.css','app.js','data.js'].forEach(f=>assert(fs.existsSync(path.join(root,f)),`${f} missing`));
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
assert.strictEqual(context.window.EPISODES.length,10,'Expected 10 episodes');
for(const e of context.window.EPISODES){assert(e.id&&e.title&&e.titleZh&&e.audio&&e.thumbnail);assert(e.segments.length>=3)}
console.log('Smoke test passed: 10 complete episode records and all frontend assets present.');
