(()=>{
  const V8_WORLD_ORDER=['farm','jungle','ocean','city','space'];
  let V8_unlocked=Math.max(1,Math.min(5,+localStorage.getItem('unlockedWorlds')||1+Math.floor((+localStorage.getItem('stars')||0)/15)));
  let V8_progress=(()=>{try{return JSON.parse(localStorage.getItem('worldCorrect')||'{}')}catch(e){return {}}})();
  let V8_audio=null,V8_goodBusy=false,V8_traceTarget=null,V8_traceDrawing=false,V8_traceLast=null,V8_traceSetup=false;

  const V8_baseGood=good,V8_basePrepare=prepareGame,V8_baseOpenMode=openMode,V8_baseStartWorld=startWorld,V8_baseHome=home,V8_baseStatus=status,V8_baseRenderSettings=renderSettings;

  function V8_ctx(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!V8_audio)V8_audio=new C();if(V8_audio.state==='suspended')V8_audio.resume();return V8_audio}
  function V8_tone(ctx,a,b,d,type='sine',gain=.09,delay=0){const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(40,a),t);o.frequency.exponentialRampToValueAtTime(Math.max(40,b),t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+d+.03)}
  function V8_noise(ctx,d=.35,gain=.06,freq=700,delay=0,type='lowpass'){const len=Math.max(1,Math.floor(ctx.sampleRate*d)),buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<len;i++)data[i]=Math.random()*2-1;const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain(),t=ctx.currentTime+delay;s.buffer=buf;f.type=type;f.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(ctx.destination);s.start(t);s.stop(t+d+.02)}

  function V8_playAnimal(a){
    const ctx=V8_ctx();if(!ctx||!a||a.type!=='animal')return false;const n=a.label;
    if(n==='Куче'){V8_noise(ctx,.16,.11,520);V8_tone(ctx,190,95,.18,'square',.07);V8_noise(ctx,.14,.1,560,.22);V8_tone(ctx,205,105,.16,'square',.065,.22)}
    else if(n==='Котка'){V8_tone(ctx,520,1050,.32,'sine',.09);V8_tone(ctx,1050,620,.32,'sine',.08,.28)}
    else if(n==='Крава'){V8_tone(ctx,150,92,.85,'sawtooth',.12);V8_tone(ctx,115,80,.7,'sine',.07,.12)}
    else if(['Овца','Коза'].includes(n)){V8_tone(ctx,430,285,.28,'square',.08);V8_tone(ctx,420,270,.28,'square',.075,.33)}
    else if(n==='Прасе'){V8_tone(ctx,190,115,.18,'square',.09);V8_tone(ctx,205,125,.18,'square',.08,.24);V8_tone(ctx,165,105,.16,'square',.07,.48)}
    else if(['Патица','Гъска'].includes(n)){V8_tone(ctx,530,335,.14,'square',.075);V8_tone(ctx,560,350,.15,'square',.07,.2);V8_tone(ctx,500,315,.13,'square',.065,.4)}
    else if(['Лъв','Тигър','Леопард','Гепард','Мечка','Горила'].includes(n)){V8_noise(ctx,.68,.13,420);V8_tone(ctx,105,62,.7,'sawtooth',.1)}
    else if(n==='Слон'){V8_tone(ctx,380,920,.55,'sawtooth',.09);V8_tone(ctx,860,520,.35,'sawtooth',.065,.46)}
    else if(n==='Вълк'){V8_tone(ctx,300,520,1.05,'sine',.08);V8_tone(ctx,520,410,.38,'sine',.06,.9)}
    else if(n==='Жаба'){V8_tone(ctx,155,88,.18,'square',.08);V8_tone(ctx,145,82,.18,'square',.07,.28)}
    else if(n==='Пчела'){V8_tone(ctx,185,205,.7,'square',.05);V8_tone(ctx,370,390,.7,'square',.022)}
    else if(n==='Делфин'){V8_tone(ctx,1100,2200,.2,'sine',.05);V8_tone(ctx,1900,2800,.17,'sine',.045,.25);V8_tone(ctx,1400,2450,.18,'sine',.045,.48)}
    else if(n==='Кит'){V8_tone(ctx,150,280,.95,'sine',.065);V8_tone(ctx,260,175,.65,'sine',.05,.7)}
    else {V8_tone(ctx,430,310,.2,'sine',.045);V8_noise(ctx,.17,.03,900,.11)}
    return true;
  }
  function V8_playVehicle(v){
    const ctx=V8_ctx();if(!ctx||!v||v.type!=='vehicle')return false;const n=v.label;
    if(['Линейка','Полицейска кола','Пожарна'].includes(n)){V8_tone(ctx,620,940,.24,'sine',.075);V8_tone(ctx,940,620,.24,'sine',.075,.25);V8_tone(ctx,620,940,.24,'sine',.075,.5);V8_tone(ctx,940,620,.24,'sine',.075,.75)}
    else if(['Влак','Метро','Трамвай'].includes(n)){V8_tone(ctx,210,205,.62,'square',.075);V8_tone(ctx,270,260,.62,'square',.06);V8_noise(ctx,.5,.035,450,.42)}
    else if(n==='Хеликоптер'){for(let i=0;i<8;i++){V8_noise(ctx,.075,.05,320,i*.09);V8_tone(ctx,78,72,.07,'square',.04,i*.09)}}
    else if(n==='Самолет'){V8_noise(ctx,1,.07,1250);V8_tone(ctx,130,210,.95,'sawtooth',.03)}
    else if(n==='Ракета'){V8_noise(ctx,1.05,.11,360);V8_tone(ctx,70,115,1,'sawtooth',.07)}
    else if(['Кораб','Ферибот','Яхта','Лодка','Кану','Скутер за вода'].includes(n)){V8_tone(ctx,115,92,.6,'sine',.08);if(n==='Скутер за вода')V8_noise(ctx,.65,.055,900,.08)}
    else if(['Велосипед','Тротинетка'].includes(n)){V8_tone(ctx,1100,920,.15,'sine',.065);V8_tone(ctx,1150,950,.15,'sine',.055,.21)}
    else if(['Мотор','Скутер','Състезателна кола'].includes(n)){V8_tone(ctx,105,260,.65,'sawtooth',.075);V8_noise(ctx,.6,.04,650,.04)}
    else if(['Камион','Трактор','Багер','Бетоновоз','Сметосъбирачка','Булдозер','Кран','Снегорин','Комбайн'].includes(n)){V8_tone(ctx,72,110,.7,'sawtooth',.08);V8_noise(ctx,.65,.05,420,.02)}
    else {V8_tone(ctx,95,210,.58,'sawtooth',.065);V8_noise(ctx,.48,.03,700,.05)}
    return true;
  }
  function V8_playSound(o){if(!o)return false;if(o.type==='animal')return V8_playAnimal(o);if(o.type==='vehicle')return V8_playVehicle(o);return false}
  function V8_playAndName(o){const fx=V8_playSound(o);setTimeout(()=>speak(o.label),fx?620:0)}

  function V8_worldIndex(w){return V8_WORLD_ORDER.indexOf(w)}
  function V8_isUnlocked(w){const i=V8_worldIndex(w);return i<0||i<V8_unlocked}
  function V8_updateLocks(){
    document.querySelectorAll('[data-world]').forEach(btn=>{const w=btn.dataset.world,isLocked=!V8_isUnlocked(w);btn.classList.toggle('worldLocked',isLocked);btn.setAttribute('aria-disabled',isLocked?'true':'false');let badge=btn.querySelector('.lockBadge');if(isLocked&&!badge){badge=document.createElement('span');badge.className='lockBadge';badge.textContent='🔒';btn.appendChild(badge)}if(!isLocked&&badge)badge.remove()});
    if($('worldProgressText'))$('worldProgressText').textContent=`Отключени ${V8_unlocked} от 5`;
    if($('settingsWorlds'))$('settingsWorlds').textContent=V8_unlocked;
  }
  function V8_recordWorld(){
    if(!worldMode)return '';
    V8_progress[worldMode]=Math.min(5,(V8_progress[worldMode]||0)+1);localStorage.setItem('worldCorrect',JSON.stringify(V8_progress));const i=V8_worldIndex(worldMode);
    if(V8_progress[worldMode]>=5&&i>=0&&i+1<5&&V8_unlocked===i+1){V8_unlocked=i+2;localStorage.setItem('unlockedWorlds',V8_unlocked);V8_updateLocks();return `Отключи ${worlds[V8_WORLD_ORDER[i+1]].title}!`}
    return '';
  }
  function V8_unlockCelebration(message,next){$('celebrateText').textContent=message;$('celebrate').classList.remove('hidden');speak(message);setTimeout(()=>{$('celebrate').classList.add('hidden');next()},1500)}

  status=function(){V8_baseStatus();V8_updateLocks()};
  renderSettings=function(){V8_baseRenderSettings();V8_updateLocks()};
  prepareGame=function(title){V8_basePrepare(title);if($('traceArea'))$('traceArea').classList.add('hidden')};
  home=function(){V8_baseHome();if($('traceArea'))$('traceArea').classList.add('hidden');V8_updateLocks()};

  good=function(b,next,bonus=1){
    if(locked||V8_goodBusy)return;const unlockMsg=V8_recordWorld(),wrappedNext=()=>unlockMsg?V8_unlockCelebration(unlockMsg,next):next();
    if(correct?.type==='vehicle'){V8_goodBusy=true;V8_playVehicle(correct);setTimeout(()=>{V8_goodBusy=false;V8_baseGood(b,wrappedNext,bonus)},620)}else V8_baseGood(b,wrappedNext,bonus);
  };

  startWorld=function(w){if(!V8_isUnlocked(w)){const i=V8_worldIndex(w),prev=i>0?worlds[V8_WORLD_ORDER[i-1]].title:'Фермата';speak(`Този свят е заключен. Първо завърши ${prev}.`);const btn=[...document.querySelectorAll(`[data-world="${w}"]`)][0];if(btn){btn.classList.add('lockShake');setTimeout(()=>btn.classList.remove('lockShake'),500)}return}V8_baseStartWorld(w)};

  function V8_startExplore(){locked=false;$('target').classList.add('hidden');$('promptText').textContent='Докосни и чуй';$('subPrompt').textContent='Натисни картинка, за да чуеш името и звука.';const pool=shuffle([...sample(animals,5),...sample(vehicles,4),...sample(objects,3)]),g=$('grid');g.innerHTML='';pool.forEach(o=>{const b=document.createElement('button');b.className='choice exploreChoice';b.innerHTML=`${visual(o)}<div class="label">${o.label}</div>`;b.onclick=()=>{g.querySelectorAll('.exploreChoice').forEach(x=>x.classList.remove('heard'));b.classList.add('heard');$('feedback').textContent=o.label;V8_playAndName(o)};g.appendChild(b)});speak('Докосни картинка и чуй името й.')}

  startSounds=function(){locked=false;$('target').classList.add('hidden');const aNames=['Куче','Котка','Крава','Овца','Петел','Патица','Прасе','Жаба','Пчела','Лъв','Слон','Вълк','Делфин'],vNames=['Кола','Влак','Линейка','Пожарна','Полицейска кола','Хеликоптер','Самолет','Мотор','Трактор','Кораб'],pool=[...animals.filter(x=>aNames.includes(x.label)),...vehicles.filter(x=>vNames.includes(x.label))],s=pick(pool);correct=s;const opts=shuffle([s,...sample(pool.filter(x=>x!==s),Math.min(count-1,pool.length-1))]);$('promptText').textContent='Познай по звука';$('subPrompt').textContent='Слушай внимателно';choices(opts,(o,b)=>o===s?good(b,startSounds):bad(b));setTimeout(()=>V8_playSound(s),220)};

  startSorting=function(){
    locked=false;$('target').classList.remove('hidden');const groups=[{kind:'animal',label:'Животни',icon:'🐾',pool:animals},{kind:'object',label:'Предмети',icon:'🧸',pool:objects},{kind:'vehicle',label:'Превозни средства',icon:'🚗',pool:vehicles}],group=pick(groups),answer=pick(group.pool);correct=answer;
    $('promptText').textContent=`Къде принадлежи ${answer.label}?`;$('subPrompt').textContent='Плъзни картинката или натисни правилната кошница.';$('targetVisual').innerHTML=`<div id="dragSortItem" class="sortPromptItem" draggable="true">${answer.icon}</div>`;$('targetLabel').textContent=answer.label;
    const grid=$('grid');grid.innerHTML='<div class="sortBins">'+groups.map(x=>`<button class="sortBin" data-sort-kind="${x.kind}"><span>${x.icon}</span><b>${x.label}</b></button>`).join('')+'</div>';
    const check=(kind,btn)=>{if(locked)return;if(kind===group.kind){good(btn,startSorting)}else bad(btn)};
    grid.querySelectorAll('.sortBin').forEach(btn=>{btn.onclick=()=>check(btn.dataset.sortKind,btn);btn.addEventListener('dragover',e=>{e.preventDefault();btn.classList.add('dragOver')});btn.addEventListener('dragleave',()=>btn.classList.remove('dragOver'));btn.addEventListener('drop',e=>{e.preventDefault();btn.classList.remove('dragOver');check(btn.dataset.sortKind,btn)})});
    const d=$('dragSortItem');if(d)d.addEventListener('dragstart',e=>e.dataTransfer?.setData('text/plain',group.kind));speak(`Къде принадлежи ${answer.label}?`)
  };

  function V8_setupTrace(){
    const c=$('traceCanvas');if(!c||V8_traceSetup)return;V8_traceSetup=true;const point=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    c.addEventListener('pointerdown',e=>{V8_traceDrawing=true;V8_traceLast=point(e);c.setPointerCapture?.(e.pointerId);e.preventDefault()});
    c.addEventListener('pointermove',e=>{if(!V8_traceDrawing)return;const p=point(e),ctx=c.getContext('2d'),dpr=window.devicePixelRatio||1;ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.strokeStyle='#258bd5';ctx.lineWidth=14;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(V8_traceLast.x,V8_traceLast.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();V8_traceLast=p;e.preventDefault()});
    const end=e=>{V8_traceDrawing=false;V8_traceLast=null;e.preventDefault?.()};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end)
  }
  function V8_drawTrace(){const c=$('traceCanvas');if(!c||!V8_traceTarget)return;const r=c.getBoundingClientRect(),w=Math.max(280,r.width||360),h=Math.max(260,r.height||320),dpr=window.devicePixelRatio||1;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${Math.min(w*.58,h*.68)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;ctx.fillStyle='#e1edf5';ctx.strokeStyle='#aac6d9';ctx.lineWidth=3;ctx.setLineDash([10,9]);const glyph=V8_traceTarget.type==='shape'?V8_traceTarget.icon:V8_traceTarget.label;ctx.strokeText(glyph,w/2,h/2);ctx.fillText(glyph,w/2,h/2);ctx.setLineDash([])}
  function V8_nextTrace(){locked=false;V8_traceTarget=pick([...letters.slice(0,24),...numbers.slice(0,10),...shapes.slice(0,8)]);$('traceTitle').textContent=V8_traceTarget.type==='letter'?`Проследи буквата ${V8_traceTarget.label}`:V8_traceTarget.type==='number'?`Проследи числото ${V8_traceTarget.label}`:`Проследи: ${V8_traceTarget.label}`;setTimeout(V8_drawTrace,40);speak($('traceTitle').textContent)}
  function V8_startTracing(){$('quizArea').classList.add('hidden');$('memoryArea').classList.add('hidden');$('traceArea').classList.remove('hidden');$('modeTitle').textContent='✍️ Проследи';$('feedback').textContent='';V8_setupTrace();V8_nextTrace()}
  function V8_traceDone(){if(locked)return;locked=true;stars++;streak++;save();status();$('feedback').textContent='Браво! ⭐';speak('Браво!');setTimeout(V8_nextTrace,650)}

  openMode=function(m){if(m==='explore'){requested=m;worldMode=null;prepareGame('Разгледай и чуй');V8_startExplore();return}if(m==='tracing'){requested=m;worldMode=null;prepareGame('Проследи');V8_startTracing();return}V8_baseOpenMode(m)};

  if($('traceClear'))$('traceClear').onclick=V8_drawTrace;
  if($('traceNext'))$('traceNext').onclick=V8_nextTrace;
  if($('traceDone'))$('traceDone').onclick=V8_traceDone;
  status();V8_updateLocks();
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=8');
})();