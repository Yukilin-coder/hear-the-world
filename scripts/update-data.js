const fs=require('fs'),vm=require('vm'),path=require('path');
const file=path.join(__dirname,'..','public','data.js');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''),c);const es=c.window.EPISODES;
const meta={
'EIhilBpn8Ow':{views:25240,likes:965,followers:7580000,authority:'全球知名科学与健康播客，由神经科学家 Andrew Huberman 主持；长期邀请顶尖学者，把研究转化为可执行工具。',titleZh:'记忆力可以越老越好？UCLA 记忆专家的科学训练法'},
'_g4l7YkDQwA':{views:1696512,likes:45873,followers:18300000,authority:'全球头部商业访谈节目，由企业家 Steven Bartlett 主持；以深度、尖锐的长访谈著称。',titleZh:'AI 内部人士预警：真正危险的不是失业，而是人类还没准备好'},
'5MpXP954XNU':{views:39743,likes:800,followers:927000,authority:'热门创业与赚钱播客，由连续创业者 Shaan Puri 和 The Hustle 创始人 Sam Parr 主持，专门拆解可执行的商业点子。',titleZh:'30 岁、零资金重新开始：他们会做的第一门生意'},
'_cmpIveXnvE':{views:11346,likes:229,followers:613000,authority:'硅谷产品与增长必听播客，由前 Airbnb 产品负责人 Lenny Rachitsky 主持，经常邀请一线产品负责人和创业者。',titleZh:'AI 正在把科技职场分成两类人：你会留在哪一边？'},
'Mxs4erDxOEE':{views:9320,likes:null,followers:280000,authority:'硅谷顶级风投 Andreessen Horowitz 官方播客，直接讨论创业、技术与资本正在押注的下一轮趋势。',titleZh:'智能体时代，传统软件会消失吗？a16z 拆解下一代商业机会'},
'nulkcjbI-pI':{views:146976,likes:3353,followers:4330000,authority:'英国头部长对话播客 Modern Wisdom，由 Chris Williamson 主持，聚焦心理、财富、健康与自我提升。',titleZh:'收入越高反而越穷？财务教练拆解债务陷阱与翻身路径'},
'jX-Uq8JJ_j8':{views:9003,likes:148,followers:215000,authority:'知名风投科技播客 20VC，由投资人 Harry Stebbings 主持，采访全球 SaaS、AI 创始人与顶级投资人。',titleZh:'OpenAI 为什么未必赢得应用层？Glean 创始人的企业 AI 判断'},
'yQ_EWmtfWvQ':{views:18189,likes:319,followers:613000,authority:'硅谷产品与增长必听播客；本期嘉宾为 Instagram 负责人 Adam Mosseri，讨论 AI 时代真正稀缺的能力。',titleZh:'AI 人人都能创作后，最值钱的能力变成了“品味”'},
'8L5cwyaB_eg':{views:18474,likes:389,followers:927000,authority:'热门创业与赚钱播客 My First Million，以真实商业案例、赚钱点子和创业者思维著称。',titleZh:'拜访纽约顶级创业者一周后，我学到的 5 条赚钱与社交法则'},
'6xlmaorRY0w':{views:3318126,likes:89522,followers:18300000,authority:'全球头部商业访谈节目 The Diary Of A CEO；本期从线粒体角度讨论精力、衰老和健康争议。',titleZh:'为什么你总是疲惫？线粒体专家解释精力、衰老与疾病'}
};
for(const e of es){Object.assign(e,meta[e.id]);e.segments=e.segments.map((s,i)=>({start:i*35,end:(i+1)*35,en:s[0],zh:s[1]}));e.transcriptStatus=['Mxs4erDxOEE','jX-Uq8JJ_j8','8L5cwyaB_eg'].includes(e.id)?'processing':'guide';}
fs.writeFileSync(file,'window.EPISODES = '+JSON.stringify(es,null,2)+';\n','utf8');
