(()=>{
  let audioContext=null;
  const getCtx=()=>{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return null;
    if(!audioContext)audioContext=new AudioCtx();
    if(audioContext.state==='suspended')audioContext.resume();
    return audioContext;
  };
  const tone=(ctx,startHz,endHz,duration,type='sine',gain=.12,delay=0)=>{
    const now=ctx.currentTime+delay,osc=ctx.createOscillator(),g=ctx.createGain();
    osc.type=type;osc.frequency.setValueAtTime(Math.max(40,startHz),now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40,endHz),now+duration);
    g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(gain,now+.025);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(g).connect(ctx.destination);osc.start(now);osc.stop(now+duration+.03);
  };
  const noise=(ctx,duration=.35,gain=.08,filterHz=700,delay=0,filterType='lowpass')=>{
    const length=Math.max(1,Math.floor(ctx.sampleRate*duration)),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<length;i++)data[i]=Math.random()*2-1;
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain(),now=ctx.currentTime+delay;
    src.buffer=buffer;filter.type=filterType;filter.frequency.value=filterHz;
    g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(gain,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
    src.connect(filter).connect(g).connect(ctx.destination);src.start(now);src.stop(now+duration+.02);
  };
  const play=(a)=>{
    const ctx=getCtx();if(!ctx||!a||a.type!=='animal')return false;
    const n=a.label;
    if(n==='Куче'){noise(ctx,.18,.12,520);tone(ctx,190,95,.2,'square',.08);noise(ctx,.16,.11,560,.25);tone(ctx,210,110,.18,'square',.07,.25);}
    else if(n==='Котка'){tone(ctx,520,1050,.34,'sine',.1);tone(ctx,1050,620,.34,'sine',.09,.3);}
    else if(n==='Крава'){tone(ctx,150,95,.9,'sawtooth',.13);tone(ctx,115,82,.75,'sine',.08,.12);}
    else if(['Овца','Коза'].includes(n)){tone(ctx,430,290,.28,'square',.09);tone(ctx,420,270,.28,'square',.08,.34);}
    else if(n==='Прасе'){tone(ctx,185,115,.18,'square',.1);tone(ctx,205,125,.2,'square',.09,.25);tone(ctx,165,105,.16,'square',.08,.5);}
    else if(['Патица','Гъска'].includes(n)){tone(ctx,520,330,.15,'square',.08);tone(ctx,560,350,.16,'square',.08,.22);tone(ctx,490,310,.14,'square',.07,.44);}
    else if(['Петел','Кокошка'].includes(n)){tone(ctx,800,1150,.12,'square',.07);tone(ctx,980,720,.12,'square',.07,.15);tone(ctx,900,1350,.18,'square',.08,.31);}
    else if(['Кон','Магаре'].includes(n)){tone(ctx,340,780,.26,'sawtooth',.09);tone(ctx,760,310,.34,'sawtooth',.08,.24);noise(ctx,.18,.05,1200,.54);}
    else if(['Лъв','Тигър','Леопард','Гепард','Мечка','Горила'].includes(n)){noise(ctx,.7,.14,430);tone(ctx,105,62,.75,'sawtooth',.11);}
    else if(n==='Слон'){tone(ctx,380,920,.58,'sawtooth',.1);tone(ctx,860,520,.38,'sawtooth',.07,.48);}
    else if(n==='Маймуна'){tone(ctx,950,1250,.1,'square',.06);tone(ctx,1150,820,.11,'square',.06,.14);tone(ctx,900,1300,.1,'square',.06,.28);tone(ctx,1200,850,.12,'square',.06,.42);}
    else if(n==='Вълк'){tone(ctx,300,520,1.15,'sine',.09);tone(ctx,520,410,.42,'sine',.07,.95);}
    else if(n==='Жаба'){tone(ctx,155,88,.18,'square',.09);tone(ctx,145,82,.18,'square',.08,.28);}
    else if(n==='Пчела'){tone(ctx,185,205,.75,'square',.055);tone(ctx,370,390,.75,'square',.025);}
    else if(n==='Мишка'){tone(ctx,1450,2200,.14,'sine',.055);tone(ctx,1700,2500,.12,'sine',.05,.2);}
    else if(n==='Бухал'){tone(ctx,260,220,.28,'sine',.085);tone(ctx,250,210,.28,'sine',.08,.42);}
    else if(n==='Змия'){noise(ctx,.8,.055,3500,0,'highpass');}
    else if(n==='Делфин'){tone(ctx,1100,2200,.22,'sine',.055);tone(ctx,1900,2800,.18,'sine',.05,.27);tone(ctx,1400,2450,.2,'sine',.05,.51);}
    else if(n==='Кит'){tone(ctx,150,280,1,'sine',.07);tone(ctx,260,175,.7,'sine',.055,.75);}
    else if(['Риба','Тропическа риба','Октопод','Костенурка','Рак','Медуза','Скариди','Калмар','Морско конче'].includes(n)){tone(ctx,620,920,.14,'sine',.035);tone(ctx,850,540,.16,'sine',.03,.18);}
    else if(['Папагал','Паун','Орел','Фламинго','Гълъб','Щъркел'].includes(n)){tone(ctx,1050,1550,.12,'sine',.05);tone(ctx,1420,900,.11,'sine',.045,.16);tone(ctx,1200,1700,.1,'sine',.04,.31);}
    else {tone(ctx,420,300,.2,'sine',.05);noise(ctx,.18,.035,900,.12);}
    return true;
  };

  good=function(b,next,bonus=1){
    if(locked)return;
    locked=true;b.classList.add('good');stars+=bonus;streak++;save();status();
    const praise=pick(['Браво!','Чудесно!','Страхотно!','Точно така!','Супер!']);
    const animalFx=correct?.type==='animal'&&play(correct);
    $('feedback').textContent=animalFx?`${correct.label}! ${praise}`:praise;
    setTimeout(()=>speak(praise),animalFx?720:0);
    if(stars%5===0){
      setTimeout(()=>{$('celebrateText').textContent=`Събра ${stars} звездички! Отключи нов стикер!`;$('celebrate').classList.remove('hidden')},animalFx?700:220);
      setTimeout(()=>{$('celebrate').classList.add('hidden');next()},animalFx?2200:1600);
    }else setTimeout(next,animalFx?1650:800);
  };

  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=7');
})();