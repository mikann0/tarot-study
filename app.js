(function(){
const BASE = window.CARDS, P_JA = window.POSITIONS, S_JA = window.SPREADS, EX_JA = window.EXAMPLES;
const baseById = Object.fromEntries(BASE.map(c=>[c.id,c]));
const POS_KEYS = ['past','present','future','obstacle','advice','outcome'];
const $ = s=>document.querySelector(s);
const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const nl = s=>esc(s).replace(/\n/g,'<br>');
const shuffle = a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ICON_STAR='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 6.6L21 9l-5.4 4 2 6.8L12 15.8 6.4 19.8l2-6.8L3 9l6.8-.4z"/></svg>';
const ICON_MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15.5 3.5a8.5 8.5 0 1 0 5 15.2A7 7 0 0 1 15.5 3.5z"/></svg>';
const CLAUDE_URL='https://claude.ai/new';

/* ---------- language ---------- */
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function detectLang(){const s=lsGet('tarot-lang'); if(s&&UI[s]) return s; return 'ja';}
const state = {
  lang:detectLang(), view:'learn',
  progress:{mastered:{"1":[],"2":[],"3":[],"4":[]}},
  entries:[],
  learn:{mode:'flash',level:1,useRev:false,deck:[],idx:0,shown:false,quiz:null,quizShown:false,quizCopy:null,quizErr:''},
  read:{spread:'one',oneQ:'advice',threeV:'time',useRev:true,q:'',cards:null,sel:null,hintStep:{},mine:'',ai:'',copy:null,saved:false,err:''},
  ref:{tab:'cards',filter:''},
  msg:''
};
const T = ()=>UI[state.lang];
const isJa = ()=>state.lang==='ja';
function card(id){const b=baseById[id]; return isJa()?b:Object.assign({},b,I18N[state.lang].cards[id]);}
const CARDS = ()=>BASE.map(c=>card(c.id));
function posInfo(k){return isJa()?P_JA[k]:I18N[state.lang].positions[k];}
function spread(id){const b=S_JA.find(s=>s.id===id); return isJa()?b:Object.assign({},b,I18N[state.lang].spreads[id]);}
const SPREADS = ()=>S_JA.map(s=>spread(s.id));
function examples(){return EX_JA.map((e,i)=>{const pos=e.cards.map(c=>c[2]); if(isJa()) return Object.assign({},e,{pos}); const t=I18N[state.lang].examples[i]; return Object.assign({},e,{q:t.q,reading:t.reading,pos:t.pos});});}
const splitTrio = s=>s.split(/\s*[・·]\s*/);
function fmtDate(ts){try{return new Date(ts).toLocaleDateString(state.lang,{year:'numeric',month:'short',day:'numeric'})}catch(e){return new Date(ts).toDateString()}}

/* ---------- storage (this browser) ---------- */
function load(){try{const d=JSON.parse(lsGet('tarot-study')||'null'); if(d){ if(d.progress&&d.progress.mastered) state.progress={mastered:Object.assign({"1":[],"2":[],"3":[],"4":[]},d.progress.mastered)}; if(Array.isArray(d.entries)) state.entries=d.entries; }}catch(e){}}
function persist(){lsSet('tarot-study',JSON.stringify({progress:state.progress,entries:state.entries}));}
function saveEntry(e){const i=state.entries.findIndex(x=>x._id===e._id); if(i<0) state.entries.unshift(e); else state.entries[i]=e; state.entries.sort((a,b)=>b.ts-a.ts); persist();}

/* ---------- helpers ---------- */
const mastered = lv=>new Set(state.progress.mastered[String(lv)]||[]);
function currentStep(){
  const n=lv=>mastered(lv).size, st=T().steps;
  if(n(1)<22) return st[0]; if(n(2)<22) return st[1]; if(n(3)<22) return st[2]; if(n(4)<22) return st[3]; return st[4];
}
function cardImg(c,rev,cls){return `<img src="${c.img}" alt="${esc(c.name)}${rev?' ('+esc(T().rev)+')':''}" class="${cls||''} ${rev?'rev':''}" loading="lazy">`}
function orient(rev){return rev?`<span class="tag rv">${esc(T().rev)}</span>`:`<span class="tag">${esc(T().up)}</span>`}
function copyBlock(text,which){
  return `<div class="copybox"><p class="small" id="copyMsg-${which}"></p>
    <textarea readonly id="copyText-${which}" aria-label="AI">${esc(text)}</textarea>
    <div class="row"><a class="btn small" href="${CLAUDE_URL}" target="_blank" rel="noopener">${esc(T().openClaude)} ↗</a></div></div>`;
}
async function doCopy(text,which){
  let ok=false;
  try{await navigator.clipboard.writeText(text); ok=true;}catch(e){ok=false;}
  const m=document.getElementById('copyMsg-'+which), ta=document.getElementById('copyText-'+which);
  if(m){m.textContent=ok?T().copied:T().copyFail; m.className=ok?'ok':'err';}
  if(!ok&&ta){ta.focus();ta.select();}
}

/* spread geometry: position number -> [col,row,span] */
const GEO = {
  one:{cols:1,map:{1:[1,1,1]}},
  three:{cols:3,map:{1:[1,1,1],2:[2,1,1],3:[3,1,1]}},
  two:{cols:3,map:{4:[1,1,1],5:[3,1,1],2:[1,2,1],3:[3,2,1],1:[2,3,1]}},
  hexa:{cols:3,half:true,map:{1:[2,1,2],6:[1,2,2],5:[3,2,2],7:[2,3,2],3:[1,4,2],2:[3,4,2],4:[2,5,2]}},
  celtic:{cols:4,map:{3:[2,1,1],1:[2,2,1],4:[2,3,1],5:[1,2,1],6:[3,2,1],10:[4,1,1],9:[4,2,1],8:[4,3,1],7:[4,4,1]}}
};
function posKeys(id){
  const r=state.read;
  if(id==='one') return [r.oneQ];
  if(id==='three') return r.threeV==='time'?['past','present','future']:['present','obstacle','advice'];
  if(id==='two') return ['present','future','future','outcome','outcome'];
  if(id==='hexa') return ['past','present','future','advice',null,null,'outcome'];
  if(id==='celtic') return ['present','obstacle',null,null,'past','future',null,null,null,'outcome'];
  return [];
}
function posNames(sp){
  const r=state.read;
  if(sp.id==='one') return [posInfo(r.oneQ).name];
  if(sp.id==='three') return splitTrio(r.threeV==='time'?T().timeV:T().advV);
  return sp.positions.map(p=>p[1]);
}
function spreadHTML(spId,cards,opts){
  opts=opts||{};
  const sp=spread(spId), g=GEO[spId], names=opts.names||posNames(sp), n=sp.count;
  const rows=g.half?'grid-auto-rows:calc(var(--cw)*.6)':'';
  const slot=i=>{
    const c=cards&&cards[i]?card(cards[i].id):null, rev=cards&&cards[i]&&cards[i].rev;
    const sel=opts.selectable&&state.read.sel===i;
    return `<button type="button" class="tcard ${c?'':'back-face'}" data-pick="${i}" aria-pressed="${sel}" aria-label="${i+1} ${esc(names[i])}${c?': '+esc(c.name):''}" ${opts.selectable&&c?'':'tabindex="-1"'}>${c?cardImg(c,rev):'✦'}<span class="pnum">${i+1}</span></button>`;
  };
  let cells='';
  for(let i=0;i<n;i++){
    const p=i+1;
    if(spId==='celtic'&&p===2) continue;
    const [cx,cy,span]=g.map[p];
    const style=`grid-column:${cx};grid-row:${cy}${span>1?' / span '+span:''}`;
    if(spId==='celtic'&&p===1) cells+=`<div class="slot" style="${style}"><div class="stack">${slot(0)}<div class="cross">${slot(1)}</div></div><span class="plabel">1 ${esc(names[0])} · 2 ${esc(names[1])}</span></div>`;
    else cells+=`<div class="slot" style="${style}">${slot(i)}<span class="plabel">${esc(names[i])}</span></div>`;
  }
  return `<div class="spread ${spId}" style="grid-template-columns:repeat(${g.cols},auto);${rows}">${cells}</div>`;
}
const pointsList = c=>`<ul class="plain">${c.l3.map(([a,b])=>`<li><b>${esc(a)}</b>: ${esc(b)}</li>`).join('')}</ul>`;

/* ---------- LEARN ---------- */
function buildDeck(){
  const L=state.learn, m=mastered(L.level), rest=BASE.filter(c=>!m.has(c.id));
  L.deck=shuffle(rest.length?rest:BASE).map(c=>({id:c.id,rev:L.useRev&&L.level<=2&&Math.random()<.4,pos:L.level===4?POS_KEYS[Math.floor(Math.random()*6)]:null}));
  L.idx=0;L.shown=false;
}
function newQuiz(){
  const c=BASE[Math.floor(Math.random()*BASE.length)];
  Object.assign(state.learn,{quiz:{id:c.id,pos:POS_KEYS[Math.floor(Math.random()*6)],answer:''},quizShown:false,quizCopy:null,quizErr:''});
}
function learnHTML(){
  const L=state.learn, t=T(), step=currentStep();
  const levels=[1,2,3,4].map(l=>{const n=mastered(l).size;return `<div class="lv"><b>${esc(t.level)}${l}</b><span>${esc(t.lvNames[l-1])}</span><div class="bar"><i style="width:${n/22*100}%"></i></div><span>${esc(t.cardsCount(n))}</span></div>`}).join('');
  let body='';
  if(L.mode==='flash'){
    if(!L.deck.length) buildDeck();
    const it=L.deck[L.idx];
    if(!it){
      body=`<div class="empty">${ICON_STAR}<b>${esc(t.deckDone(L.deck.length))}</b><span class="small">${esc(t.deckDoneSub)}</span><button class="btn primary" data-act="redeck" type="button">${esc(t.again1)}</button></div>`;
    } else {
      const c=card(it.id), m=mastered(L.level).has(c.id);
      const bold=on=>on?' style="font-weight:700"':'';
      let back='';
      if(L.shown){
        if(L.level===1) back=`<dl class="kv"><dt>${esc(t.up)}</dt><dd${bold(!it.rev)}>${esc(c.l1.up)}</dd><dt>${esc(t.rev)}</dt><dd${bold(it.rev)}>${esc(c.l1.rev)}</dd></dl>`;
        if(L.level===2) back=`<dl class="kv"><dt>${esc(t.up)}</dt><dd${bold(!it.rev)}>${c.l2.up.map(esc).join(' · ')}</dd><dt>${esc(t.rev)}</dt><dd${bold(it.rev)}>${c.l2.rev.map(esc).join(' · ')}</dd><dt>${esc(t.oneLine)}</dt><dd>${esc(c.l2.line)}</dd></dl>`;
        if(L.level===3) back=pointsList(c);
        if(L.level===4) back=`<p><b>${esc(t.inPos(posInfo(it.pos).name))}</b>${esc(c.l4[it.pos])}</p><p class="small muted">${esc(t.keywords)}: ${c.l2.up.map(esc).join(' · ')}</p>`;
      }
      const pr=t.prompts[L.level-1], prompt=typeof pr==='function'?pr(posInfo(it.pos).name):pr;
      body=`<div class="row" style="justify-content:space-between"><span class="small muted">${esc(t.counter(L.idx+1,L.deck.length))}${m?` <span class="tag">${esc(t.mastered)}</span>`:''}</span>${L.level<=2?`<label class="small row" style="gap:6px"><input type="checkbox" id="useRev" ${L.useRev?'checked':''}> ${esc(t.showRev)}</label>`:''}</div>
      <div class="flash">${cardImg(c,it.rev,'cardimg')}
        <div class="back"><h3>${esc(c.name)} <span class="muted small" style="font-family:var(--font-body)">${c.n}${isJa()?' · '+esc(c.en):''}</span></h3>${L.level<=2&&it.rev?orient(true):''}
        <p>${esc(prompt)}</p>
        ${L.shown?back+`<div class="row"><button class="btn primary" data-act="know" type="button">${esc(t.know)}</button><button class="btn" data-act="again" type="button">${esc(t.again)}</button></div>`:`<div class="row"><button class="btn primary" data-act="show" type="button">${esc(t.showAnswer)}</button><button class="btn small" data-act="dict" data-id="${c.id}" type="button">${esc(t.seeDict)}</button></div>`}
        </div></div>`;
    }
  } else {
    if(!L.quiz) newQuiz();
    const q=L.quiz, c=card(q.id), pi=posInfo(q.pos);
    body=`<div class="flash">${cardImg(c,false,'cardimg')}<div class="back">
      <h3>${esc(t.quizTitle(c.name,pi.name))}</h3>
      <p class="small muted">${esc(pi.q)} ${esc(t.hint)}: ${c.l2.up.map(esc).join(' · ')}</p>
      <label class="lab" for="quizAns">${esc(t.myReading)}</label>
      <textarea id="quizAns" placeholder="${esc(t.quizPh)}">${esc(q.answer)}</textarea>
      <div class="row"><button class="btn primary" data-act="quizShow" type="button">${esc(t.seeExample)}</button><button class="btn gold" data-act="quizAI" type="button">${esc(t.copyAI)}</button><button class="btn" data-act="quizNext" type="button">${esc(t.nextQ)}</button></div>
      ${L.quizErr?`<p class="err">${esc(L.quizErr)}</p>`:''}
      ${L.quizShown?`<div class="panel" style="padding:12px"><b>${esc(t.example)}</b><p>${esc(c.l4[q.pos])}</p><p class="small muted">${esc(c.l2.line)}</p></div>`:''}
      ${L.quizCopy?copyBlock(L.quizCopy,'quiz'):''}
    </div></div>`;
  }
  return `<section class="view">
    <div class="panel"><span class="eyebrow">${esc(t.stepEyebrow)}</span>
      <div class="step">${ICON_MOON}<div><b>${esc(step[0])}</b><p class="small">${esc(step[1])}</p></div></div>
      <div class="levels">${levels}</div>
      <p class="small muted">${esc(t.levelNote)}</p>
    </div>
    <div class="panel">
      <div class="seg" role="group" aria-label="${esc(t.practiceKind)}"><button data-mode="flash" aria-pressed="${L.mode==='flash'}" type="button">${esc(t.flash)}</button><button data-mode="quiz" aria-pressed="${L.mode==='quiz'}" type="button">${esc(t.quiz)}</button></div>
      ${L.mode==='flash'?`<div class="seg" role="group" aria-label="${esc(t.level)}">${[1,2,3,4].map(l=>`<button data-level="${l}" aria-pressed="${L.level===l}" type="button">${esc(t.level)}${l}</button>`).join('')}</div>`:''}
      ${body}
    </div>
  </section>`;
}

/* ---------- READ ---------- */
function readHTML(){
  const R=state.read, t=T(), sp=spread(R.spread), names=posNames(sp), keys=posKeys(sp.id), drawn=!!R.cards;
  let options='';
  if(sp.id==='one') options=`<div class="seg" role="group" aria-label="${esc(t.qType)}">${['future','advice','obstacle','present'].map(k=>`<button data-oneq="${k}" aria-pressed="${R.oneQ===k}" type="button">${esc(posInfo(k).name)}</button>`).join('')}</div>`;
  if(sp.id==='three') options=`<div class="seg" role="group" aria-label="${esc(t.posMeaning)}"><button data-threev="time" aria-pressed="${R.threeV==='time'}" type="button">${esc(t.timeV)}</button><button data-threev="adv" aria-pressed="${R.threeV==='adv'}" type="button">${esc(t.advV)}</button></div>`;
  let hint='';
  if(drawn&&R.sel!=null){
    const it=R.cards[R.sel], c=card(it.id), k=keys[R.sel], st=R.hintStep[R.sel]||0;
    const posDesc=sp.id==='one'?posInfo(R.oneQ).q:(sp.id==='three'?'':sp.positions[R.sel][2]);
    let blocks='';
    if(st>=1) blocks+=`<div class="lvl"><b>${esc(t.keywords)}</b><p>${(it.rev?c.l2.rev:c.l2.up).map(esc).join(' · ')}</p><p class="small muted">${esc(c.l2.line)}</p></div>`;
    if(st>=2) blocks+=`<div class="lvl"><b>${esc(t.pictureP)}</b>${pointsList(c)}</div>`;
    if(st>=3) blocks+=`<div class="lvl"><b>${esc(t.readInPos(names[R.sel]))}</b><p>${k?esc(c.l4[k]):esc(t.noKey(posDesc))}</p>${it.rev?`<p class="small muted">${esc(t.revNote)}</p>`:''}</div>`;
    hint=`<div class="hint"><div class="row" style="justify-content:space-between"><h3>${R.sel+1}. ${esc(names[R.sel])}: ${esc(c.name)} ${orient(it.rev)}</h3><button class="btn small" data-act="dict" data-id="${c.id}" type="button">${esc(t.seeDict)}</button></div>
    ${posDesc?`<p class="small muted">${esc(posDesc)}</p>`:''}
    <p class="small">${esc(t.thinkFirst)}</p>
    ${blocks}${st<3?`<div><button class="btn" data-act="hintMore" type="button">${esc(t.nextHint[st])}</button></div>`:''}</div>`;
  }
  return `<section class="view">
    <div class="panel"><span class="eyebrow">${esc(t.r1)}</span>
      <div class="seg" role="group" aria-label="${esc(t.spreadL)}">${SPREADS().map(s=>`<button data-spread="${s.id}" aria-pressed="${R.spread===s.id}" type="button" ${drawn?'disabled':''}>${esc(s.name)}</button>`).join('')}</div>
      <p class="small muted">${esc(sp.use)} (${esc(t.guide)}: ${esc(sp.level)})</p>
      ${drawn?'':options}
      <label class="lab" for="readQ">${esc(t.r2)}</label>
      <input type="text" id="readQ" value="${esc(R.q)}" placeholder="${esc(sp.id==='one'?t.qSuggest[R.oneQ]:sp.id==='two'?t.qPhTwo:t.qPh)}" ${drawn?'readonly':''}>
      <div class="row" style="justify-content:space-between">
        <label class="small row" style="gap:6px"><input type="checkbox" id="readRev" ${R.useRev?'checked':''} ${drawn?'disabled':''}> ${esc(t.useRev)}</label>
        ${drawn?`<button class="btn" data-act="reset" type="button">${esc(t.newRead)}</button>`:`<button class="btn primary" data-act="draw" type="button">${esc(t.draw)}</button>`}
      </div>
      <p class="notice">${esc(t.majorOnly)}</p>
    </div>
    <div class="panel"><span class="eyebrow">${esc(t.r3)}</span>
      ${spreadHTML(sp.id,R.cards,{selectable:true,names})}
      ${drawn?(R.sel==null?`<p class="small muted" style="text-align:center">${esc(t.tapHint)}</p>`:hint):`<p class="small muted" style="text-align:center">${esc(t.beforeDraw)}</p>`}
    </div>
    ${drawn?`<div class="panel"><span class="eyebrow">${esc(t.r4)}</span>
      <label class="lab" for="mine">${esc(t.mineLabel)}</label>
      <textarea id="mine" placeholder="${esc(t.minePh)}">${esc(R.mine)}</textarea>
      <div class="row"><button class="btn gold" data-act="ai" type="button">${esc(t.copyAI)}</button><button class="btn primary" data-act="save" type="button">${esc(R.saved?t.update:t.save)}</button></div>
      ${R.saved?`<p class="ok">${esc(t.savedMsg)}</p>`:''}
      ${R.copy?copyBlock(R.copy,'read')+`<label class="lab" for="aiPaste">${esc(t.pasteAI)}</label><textarea id="aiPaste" placeholder="${esc(t.pasteAIPh)}">${esc(R.ai)}</textarea>`:''}
    </div>`:''}
  </section>`;
}
function readingPrompt(R){
  const t=T(), sp=spread(R.spread), names=posNames(sp);
  const lines=R.cards.map((it,i)=>t.lineFmt(i+1,names[i],card(it.id).name,it.rev)).join('\n');
  return t.aiReading(sp.name,R.q,lines,R.mine.trim());
}

/* ---------- REF ---------- */
function gridCards(list){return `<div class="grid">${list.map(c=>`<button class="gcard" data-act="dict" data-id="${c.id}" type="button"><img src="${c.img}" alt="" loading="lazy"><span>${esc(c.name)}</span><small>${esc(c.l1.up)}</small></button>`).join('')}</div>`}
function refHTML(){
  const F=state.ref, t=T();
  let body='';
  if(F.tab==='cards'){
    const f=F.filter.trim().toLowerCase();
    const list=CARDS().filter(c=>!f||c.name.toLowerCase().includes(f)||c.en.toLowerCase().includes(f)||c.l2.up.some(k=>k.toLowerCase().includes(f))||String(c.n)===f);
    body=`<input type="text" id="refFilter" placeholder="${esc(t.search)}" value="${esc(F.filter)}">${list.length?gridCards(list):`<p class="muted">${esc(t.notFound)}</p>`}<p class="notice">${esc(t.minorSoon)}</p>`;
  }
  if(F.tab==='spreads'){
    body=SPREADS().map(sp=>`<div class="panel"><div class="row" style="justify-content:space-between"><h3>${esc(sp.name)}</h3><span class="small muted">${esc(t.cardsN(sp.count))} · ${esc(sp.level)}</span></div>
      <p class="small">${esc(sp.use)}</p>
      ${spreadHTML(sp.id,null,{names:sp.id==='three'?splitTrio(t.timeV):sp.id==='one'?[t.theme]:sp.positions.map(p=>p[1])})}
      <table class="pos">${sp.positions.map(p=>`<tr><td>${p[0]}. ${esc(p[1])}</td><td>${esc(p[2])}</td></tr>`).join('')}</table>
      <p class="small"><b>${esc(t.order)}</b>${esc(sp.order)}</p></div>`).join('');
  }
  if(F.tab==='examples'){
    body=examples().map(ex=>`<div class="panel"><span class="eyebrow">${esc(spread(ex.spread).name)}</span><h3>${esc(ex.q)}</h3>
      <div class="minis">${ex.cards.map(([id,rev],i)=>{const c=card(id);return `<div class="mini">${cardImg(c,rev)}<b>${esc(ex.pos[i])}</b><span>${esc(c.name)}${rev?esc(t.revShort):''}</span></div>`}).join('')}</div>
      <p>${nl(ex.reading)}</p></div>`).join('');
  }
  return `<section class="view"><div class="seg" role="group"><button data-reftab="cards" aria-pressed="${F.tab==='cards'}" type="button">${esc(t.refCards)}</button><button data-reftab="spreads" aria-pressed="${F.tab==='spreads'}" type="button">${esc(t.refSpreads)}</button><button data-reftab="examples" aria-pressed="${F.tab==='examples'}" type="button">${esc(t.refExamples)}</button></div>${F.tab==='cards'?`<div class="panel">${body}</div>`:body}</section>`;
}

/* ---------- LOG ---------- */
function logHTML(){
  const E=state.entries, t=T();
  const tools=`<div class="panel"><span class="eyebrow">${esc(t.backup)}</span><p class="small muted">${esc(t.logWhere)}</p>
    <div class="row"><button class="btn small" data-act="export" type="button">${esc(t.exportB)}</button><button class="btn small" data-act="import" type="button">${esc(t.importB)}</button></div>
    ${state.msg?`<p class="${state.msgErr?'err':'ok'}">${esc(state.msg)}</p>`:''}</div>`;
  if(!E.length) return `<section class="view"><div class="panel"><div class="empty">${ICON_MOON}<b>${esc(t.noLog)}</b><span class="small">${esc(t.noLogSub)}</span><button class="btn primary" data-goto="read" type="button">${esc(t.tryRead)}</button></div></div>${tools}</section>`;
  return `<section class="view">${E.map(e=>{const sp=spread(e.spread)||{name:''};return `<details class="entry"><summary><span class="small muted">${esc(fmtDate(e.ts))} · ${esc(sp.name)}</span><b>${esc(e.q||t.noQ)}</b><span class="small muted">${e.cards.map(c=>esc(card(c.id).name)+(c.rev?esc(t.revShort):'')).join(', ')}</span></summary>
    <div class="body"><div class="minis">${e.cards.map(c=>{const cc=card(c.id);return `<div class="mini">${cardImg(cc,c.rev)}<b>${esc(c.pos)}</b><span>${esc(cc.name)}</span></div>`}).join('')}</div>
    <div><b class="small">${esc(t.myReading)}</b><p>${e.mine?nl(e.mine):`<span class="muted">${esc(t.blank)}</span>`}</p></div>
    ${e.ai?`<div><b class="small">${esc(t.aiAnswer)}</b><div class="ai">${esc(e.ai)}</div></div>`:''}
    <label class="lab" for="rf-${e._id}">${esc(t.reflect)}</label>
    <textarea id="rf-${e._id}" placeholder="${esc(t.reflectPh)}">${esc(e.reflect||'')}</textarea>
    <div class="row"><button class="btn small" data-act="saveReflect" data-id="${e._id}" type="button">${esc(t.saveReflect)}</button><span class="small ok" id="rs-${e._id}"></span></div></div></details>`}).join('')}${tools}</section>`;
}
function exportData(){
  const data=JSON.stringify({app:'tarot-study',version:1,exported:new Date().toISOString(),progress:state.progress,entries:state.entries},null,1);
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  const d=new Date(); a.download=`tarot-study-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.json`;
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
function importData(file){
  const fr=new FileReader();
  fr.onload=()=>{
    try{
      const d=JSON.parse(fr.result); if(d.app!=='tarot-study') throw 0;
      let n=0;
      (d.entries||[]).forEach(e=>{ if(e&&e._id&&Array.isArray(e.cards)&&e.cards.every(c=>baseById[c.id])){ const i=state.entries.findIndex(x=>x._id===e._id); if(i<0){state.entries.push(e);n++;} else if((e.reflect||'').length>(state.entries[i].reflect||'').length) state.entries[i]=e; } });
      state.entries.sort((a,b)=>b.ts-a.ts);
      const pm=(d.progress&&d.progress.mastered)||{};
      ['1','2','3','4'].forEach(k=>{state.progress.mastered[k]=[...new Set([...(state.progress.mastered[k]||[]),...(pm[k]||[]).filter(id=>baseById[id])])];});
      persist(); state.msg=T().imported(n); state.msgErr=false;
    }catch(e){state.msg=T().importErr; state.msgErr=true;}
    render();
  };
  fr.readAsText(file);
}

/* ---------- SHEET ---------- */
function openDetail(id){
  const c=card(id), t=T();
  $('#sheetBox').innerHTML=`<div class="head"><h2 id="sheetTitle">${esc(c.name)}</h2><div class="row"><button class="btn small" data-act="dictList" type="button">${esc(t.list)}</button><button class="btn small" data-act="close" type="button">${esc(t.close)}</button></div></div>
  <div class="detail">${cardImg(c,false,'cardimg')}<div class="back"><span class="muted small">${c.n} · ${esc(c.en)}</span>
    <div><b class="small">${esc(t.lv[0])}</b><dl class="kv"><dt>${esc(t.up)}</dt><dd>${esc(c.l1.up)}</dd><dt>${esc(t.rev)}</dt><dd>${esc(c.l1.rev)}</dd></dl></div></div></div>
  <div class="lvblock"><b>${esc(t.lv[1])}</b><dl class="kv"><dt>${esc(t.up)}</dt><dd>${c.l2.up.map(esc).join(' · ')}</dd><dt>${esc(t.rev)}</dt><dd>${c.l2.rev.map(esc).join(' · ')}</dd><dt>${esc(t.oneLine)}</dt><dd>${esc(c.l2.line)}</dd></dl></div>
  <div class="lvblock"><b>${esc(t.lv[2])}</b>${pointsList(c)}</div>
  <div class="lvblock"><b>${esc(t.lv[3])}</b><table class="pos">${POS_KEYS.map(k=>`<tr><td>${esc(posInfo(k).name)}</td><td>${esc(c.l4[k])}</td></tr>`).join('')}</table></div>
  <div class="lvblock"><b>${esc(t.lv[4])}</b><p>${esc(c.l5)}</p></div>`;
  showSheet();
}
function openDictList(){
  $('#sheetBox').innerHTML=`<div class="head"><h2 id="sheetTitle">${esc(T().dict)}</h2><button class="btn small" data-act="close" type="button">${esc(T().close)}</button></div>${gridCards(CARDS())}`;
  showSheet();
}
let lastFocus=null;
function showSheet(){const s=$('#sheet');if(s.hidden){lastFocus=document.activeElement;s.hidden=false;document.body.style.overflow='hidden';}$('#sheetBox').scrollTop=0;const b=$('#sheetBox [data-act="close"]');b&&b.focus();}
function closeSheet(){$('#sheet').hidden=true;document.body.style.overflow='';lastFocus&&lastFocus.focus&&lastFocus.focus();}

/* ---------- render + events ---------- */
function applyChrome(){
  const t=T();
  document.documentElement.lang=state.lang; document.title=t.appName;
  $('#appName').textContent=t.appName; $('#openDict').textContent=t.dict; $('#langSel').value=state.lang;
  $('#tabs').setAttribute('aria-label',t.menu); $('#langSel').setAttribute('aria-label',t.lang);
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t];});
}
function render(){
  document.querySelectorAll('nav.tabs [data-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===state.view)));
  const a=document.activeElement, f=a&&a.id&&a.closest&&a.closest('#main')?a.id:null, pos=f&&a.selectionStart;
  const v=state.view;
  $('#main').innerHTML = v==='learn'?learnHTML():v==='read'?readHTML():v==='ref'?refHTML():logHTML();
  if(f){const el=document.getElementById(f); if(el){el.focus(); try{if(pos!=null) el.setSelectionRange(pos,pos)}catch(e){}}}
}
document.addEventListener('click',ev=>{
  const tEl=ev.target.closest('button,[data-goto]');
  if(!tEl){ if(ev.target.id==='sheet') closeSheet(); return; }
  const d=tEl.dataset, L=state.learn, R=state.read;
  if(d.view){state.view=d.view;state.msg='';render();window.scrollTo(0,0);return;}
  if(d.goto){state.view=d.goto;render();return;}
  if(tEl.id==='openDict'){openDictList();return;}
  if(d.mode){L.mode=d.mode;render();return;}
  if(d.level){L.level=+d.level;buildDeck();render();return;}
  if(d.spread){R.spread=d.spread;render();return;}
  if(d.oneq){R.oneQ=d.oneq;render();return;}
  if(d.threev){R.threeV=d.threev;render();return;}
  if(d.reftab){state.ref.tab=d.reftab;render();return;}
  if(d.pick!=null&&R.cards&&state.view==='read'){R.sel=+d.pick;render();return;}
  switch(d.act){
    case 'dict': openDetail(d.id); break;
    case 'dictList': openDictList(); break;
    case 'close': closeSheet(); break;
    case 'show': L.shown=true; render(); break;
    case 'know': { const s=mastered(L.level); s.add(L.deck[L.idx].id); state.progress.mastered[String(L.level)]=[...s]; persist(); L.idx++; L.shown=false; render(); break; }
    case 'again': { L.deck.push(Object.assign({},L.deck[L.idx])); L.idx++; L.shown=false; render(); break; }
    case 'redeck': buildDeck(); render(); break;
    case 'quizShow': L.quizShown=true; render(); break;
    case 'quizNext': newQuiz(); render(); break;
    case 'quizAI': {
      const q=L.quiz; if(!q.answer.trim()){L.quizErr=T().writeFirst;render();break;}
      const c=card(q.id), pi=posInfo(q.pos);
      L.quizErr=''; L.quizCopy=T().aiQuiz(c.name,pi.name,pi.q,q.answer.trim()); const text=L.quizCopy; render(); doCopy(text,'quiz'); break; }
    case 'draw': {
      const sp=spread(R.spread);
      R.cards=shuffle(BASE).slice(0,sp.count).map(c=>({id:c.id,rev:R.useRev&&Math.random()<.5}));
      Object.assign(R,{sel:0,hintStep:{},mine:'',ai:'',copy:null,saved:false,err:'',_ts:null}); render(); break; }
    case 'reset': Object.assign(R,{cards:null,sel:null,mine:'',ai:'',copy:null,saved:false,q:''}); render(); break;
    case 'hintMore': R.hintStep[R.sel]=(R.hintStep[R.sel]||0)+1; render(); break;
    case 'ai': { R.copy=readingPrompt(R); const text=R.copy; render(); doCopy(text,'read'); break; }
    case 'save': doSave(); render(); break;
    case 'saveReflect': {
      const e=state.entries.find(x=>x._id===d.id), ta=document.getElementById('rf-'+d.id);
      if(e&&ta){e.reflect=ta.value; persist(); const s=document.getElementById('rs-'+d.id); if(s) s.textContent=T().savedShort;}
      break; }
    case 'export': exportData(); break;
    case 'import': $('#importFile').click(); break;
  }
});
function doSave(){
  const R=state.read, sp=spread(R.spread), names=posNames(sp);
  if(!R._ts) R._ts=Date.now();
  const id='j'+R._ts, old=state.entries.find(x=>x._id===id);
  saveEntry({_id:id,ts:R._ts,spread:R.spread,q:R.q,cards:R.cards.map((c,i)=>({id:c.id,rev:!!c.rev,pos:names[i]})),mine:R.mine,ai:R.ai,reflect:old?old.reflect:''});
  R.saved=true;
}
document.addEventListener('input',ev=>{
  const t=ev.target, R=state.read;
  if(t.id==='readQ') R.q=t.value;
  if(t.id==='mine') R.mine=t.value;
  if(t.id==='aiPaste'){R.ai=t.value; if(R.saved) doSave();}
  if(t.id==='quizAns'){state.learn.quiz.answer=t.value; if(state.learn.quizErr){state.learn.quizErr='';const er=document.querySelector('#main .err');er&&er.remove();}}
  if(t.id==='refFilter'){state.ref.filter=t.value;render();}
});
document.addEventListener('change',ev=>{
  const t=ev.target;
  if(t.id==='useRev'){state.learn.useRev=t.checked;buildDeck();render();}
  if(t.id==='readRev'){state.read.useRev=t.checked;}
  if(t.id==='langSel'){state.lang=t.value; lsSet('tarot-lang',t.value); state.learn.quizCopy=null; state.read.copy=null; applyChrome(); render(); if(!$('#sheet').hidden) closeSheet();}
  if(t.id==='importFile'&&t.files&&t.files[0]){importData(t.files[0]); t.value='';}
});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!$('#sheet').hidden)closeSheet();});

load(); applyChrome(); render();
})();
