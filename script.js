(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs = {}) => { const el = document.createElementNS(ns, tag); for (const [name,value] of Object.entries(attrs)) el.setAttribute(name,value); return el; };
  const storage = { get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }, set(key,value) { try { localStorage.setItem(key,String(value)); } catch { /* Private or locked storage: the session still works. */ } } };
  const validBest = value => Number.isFinite(Number(value)) && Number(value) >= 0 ? Math.floor(Number(value)) : 0;
  let best = Math.max(validBest(storage.get('giftCatcherHighScore', 0)), validBest(storage.get('paperGiftCatcherBest', 0)));
  let sessionBest = best;
  let phase = 'welcome', previousPhase = 'playing', lastFrame = 0, readyTime = 0, toastTime = 0, hitTime = 0, pulse = 0;
  let pointer = null;
  const keys = new Set(), particles = [], giftNodes = new Map();
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const game = new GiftCatcherEngine.Game();
  const world = $('world'), field = $('playfield'), giftLayer = $('gifts-layer'), effects = $('effects-layer');
  const powerData = {
    slow: { title:'Замедление', text:'Подарки падают вдвое медленнее', icon:'paper-hourglass' },
    magnet: { title:'Могнит', text:'Притягивает цветные и золотые подарки', icon:'paper-magnet' },
    double: { title:'Вдвое больше очков', text:'Все обычные подарки приносят ×2 очков', icon:'paper-double' },
    clear: { title:'Чистое небо', text:'Опасные подарки исчезли. +15 очков', icon:'paper-sweep' }
  };
  function setText(element, value) { const text = String(value); if (element.textContent !== text) element.textContent = text; }
  function announce(text) { setText($('announcer'), text); }
  function saveBest() { best = Math.max(best,game.state.score); storage.set('paperGiftCatcherBest',best); storage.set('giftCatcherHighScore',best); }
  function refreshBest() { for (const id of ['welcome-best','hud-best','result-best']) setText($(id),best); }
  function toast(text, duration = 2.8) { setText($('toast'),text); $('toast').hidden=false; toastTime=duration; announce(text); }
  function setPhase(next) {
    phase=next; document.body.dataset.phase=next;
    $('welcome').hidden=next!=='welcome';
    $('hud').hidden=next==='welcome';
    $('pause-button').hidden=!['playing','countdown','paused'].includes(next);
    if (next==='welcome' || next==='result') { $('toast').hidden=true; $('power-banner').hidden=true; $('streak').hidden=true; }
  }
  function clearVisuals() { giftNodes.clear(); giftLayer.replaceChildren(); particles.length=0; effects.replaceChildren(); pulse=0; hitTime=0; toastTime=0; document.body.classList.remove('is-hit'); $('magnet-aura').hidden=true; }
  function startRound() {
    saveBest();
    for (const id of ['pause-dialog','result-dialog']) if ($(id).open) $(id).close();
    clearVisuals(); keys.clear(); pointer=null; sessionBest=best;
    game.reset(field.clientWidth,field.clientHeight);
    readyTime=3; $('ready').hidden=false; setText($('ready'),'3'); $('power-banner').hidden=true; $('streak').hidden=true;
    setPhase('countdown'); refreshBest(); updateHUD(); render(); lastFrame=0; field.focus({preventScroll:true});
  }
  function pause(reason) {
    if (!['playing','countdown'].includes(phase)) return;
    previousPhase=phase; game.pause(); keys.clear(); pointer=null; setPhase('paused');
    setText($('pause-description'),reason || 'Переведи дух. Продолжим с того же места.');
    $('pause-dialog').showModal();
  }
  function resume() {
    if (phase!=='paused') return;
    $('pause-dialog').close(); setPhase(previousPhase); if (previousPhase==='playing') game.resume();
    lastFrame=0; field.focus({preventScroll:true});
  }
  function endRound() {
    saveBest(); refreshBest(); keys.clear(); setPhase('result'); $('ready').hidden=true;
    const s=game.state;
    setText($('final-score'),s.score); setText($('result-caught'),s.caught); setText($('result-streak'),s.maxStreak);
    setText($('result-time'),Math.floor(s.elapsed/60)+':'+String(Math.floor(s.elapsed%60)).padStart(2,'0'));
    setText($('result-kicker'),s.score>sessionBest?'Новый личный рекорд':'Спасибо за игру');
    setText($('result-title'),s.score>sessionBest?'Вот это подаркопад!':'Полная корзина!');
    $('result-dialog').showModal(); announce('Игра окончена. Собрано '+s.score+' очков.');
  }
  function updateHUD() {
    const s=game.state; setText($('score'),s.score); setText($('hud-best'),Math.max(best,s.score));
    for (let i=0;i<5;i++) $('lives').children[i].classList.toggle('lost',i>=s.lives);
    $('lives').setAttribute('aria-label','Осталось жизней: '+s.lives);
    const showStreak=s.streak>=2 && ['playing','paused'].includes(phase); $('streak').hidden=!showStreak;
    if (showStreak) { setText($('streak-count'),s.streak); setText($('streak-multiplier'),'×'+Math.min(3,1+Math.floor(s.streak/5))); }
    const showPower=!!s.power && ['playing','paused'].includes(phase); $('power-banner').hidden=!showPower;
    if (showPower) { const data=powerData[s.power]; setText($('power-name'),data.title); setText($('power-explanation'),data.text); $('power-icon').setAttribute('href','#'+data.icon); setText($('power-seconds'),Math.ceil(s.powerLeft)); $('power-progress').style.transform='scaleX('+(s.powerLeft/s.powerDuration)+')'; }
    $('magnet-aura').hidden=!(s.power==='magnet' && ['playing','paused'].includes(phase));
  }
  function addBurst(x,y,text,bad=false) {
    const label=svg('text',{x,y:y-15,'text-anchor':'middle',fill:bad?'#e9ad8a':'#fff1cc','font-family':'Georgia,serif','font-weight':'bold','font-size':Math.max(22,29*game.state.scale)});
    label.textContent=text; effects.append(label); particles.push({node:label,x,y:y-15,vx:0,vy:-42,life:1,remaining:1,label:true});
    const count=reduceMotion?2:8;
    for (let i=0;i<count;i++) {
      const color=bad?'#cf876b':['#e7c678','#f7e8be','#8fb6a8'][i%3];
      const node=svg('rect',{width:4+(i%3),height:4+(i%2),fill:color}); effects.append(node);
      particles.push({node,x,y,vx:(Math.random()-.5)*150,vy:-50-Math.random()*90,life:.75,remaining:.75});
    }
  }
  function handleEvents(events) {
    for (const event of events) {
      if (event.type==='catch') { pulse=1; addBurst(event.x,event.y,'+'+event.points); }
      if (event.type==='damage') { hitTime=.4; addBurst(event.x,event.y,'−1 жизнь',true); toast(event.reason==='bad'?'Подарки с крестиком лучше пропускать':'Еще наловим!',2); }
      if (event.type==='power') { toast(powerData[event.power].title+'. '+powerData[event.power].text,3); }
      if (event.type==='streak') toast(event.value+' подряд! Очки за поимку ×'+event.multiplier,2.5);
      if (event.type==='end') endRound();
    }
  }
  function updateParticles(dt) {
    for (let i=particles.length-1;i>=0;i--) { const p=particles[i];p.remaining-=dt;
      if (p.remaining<=0) {p.node.remove();particles.splice(i,1);continue;}
      p.x+=p.vx*dt;p.y+=p.vy*dt;if (!p.label) p.vy+=130*dt;
      p.node.setAttribute('opacity',Math.min(1,p.remaining/.35));
      if (p.label) {p.node.setAttribute('x',p.x);p.node.setAttribute('y',p.y);} else p.node.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${(1-p.remaining/p.life)*100})`);
    }
  }
  function render() {
    const s=game.state, visible=new Set(s.gifts.map(g=>g.id));
    for (const [id,node] of giftNodes) if (!visible.has(id)) {node.remove();giftNodes.delete(id);}
    for (const gift of s.gifts) {
      let node=giftNodes.get(gift.id);
      if (!node) { node=svg('g');const icon=svg('svg',{viewBox:'0 0 100 110',x:-gift.r,y:-gift.r*1.1,width:gift.r*2,height:gift.r*2.2});
        icon.append(svg('use',{href:'#'+(gift.type==='bad'?'paper-danger-gift':gift.type==='bonus'?'paper-bonus-gift':gift.variant?'paper-gift':'paper-small-gift'),width:100,height:110}));node.append(icon);giftNodes.set(gift.id,node);giftLayer.append(node); }
      node.setAttribute('transform',`translate(${gift.x.toFixed(2)} ${gift.y.toFixed(2)}) rotate(${gift.angle+(reduceMotion?0:Math.sin(s.elapsed*1.8+gift.id)*4)})`);
    }
    const lean=reduceMotion?0:Math.max(-5,Math.min(5,(s.targetX-s.basketX)*.04));
    $('basket-layer').setAttribute('transform',`translate(${s.basketX} ${s.basketY}) rotate(${lean}) scale(${1+pulse*.045} ${1-pulse*.04})`);
    $('basket').setAttribute('x',-s.basketWidth/2);$('basket').setAttribute('width',s.basketWidth);$('basket').setAttribute('height',s.basketWidth/2);
    $('magnet-aura').setAttribute('transform','scale('+s.scale+')');
  }
  function frame(time) {
    const dt=lastFrame?Math.min((time-lastFrame)/1000,.05):0;lastFrame=time;
    if (phase==='countdown') {readyTime-=dt;const count=Math.ceil(readyTime);setText($('ready'),count>0?count:'Лови!');if (readyTime<=0) {$('ready').hidden=true;game.start();setPhase('playing');toast('Лови цветные подарки. Тёмные с крестом пропускай.',4);}}
    if (phase==='playing') {
      const direction=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);
      if (direction) game.moveTo(game.state.targetX+direction*game.state.width*.8*dt);
      handleEvents(game.step(dt));
      if (toastTime>0) {toastTime-=dt;if (toastTime<=0) $('toast').hidden=true;}
      pulse=Math.max(0,pulse-dt*5);hitTime=Math.max(0,hitTime-dt);document.body.classList.toggle('is-hit',hitTime>0);updateParticles(dt);
    }
    if (phase!=='welcome') {render();updateHUD();}
    requestAnimationFrame(frame);
  }
  function movePointer(event) {const rect=world.getBoundingClientRect();game.moveTo((event.clientX-rect.left)*game.state.width/rect.width);}
  world.addEventListener('pointerdown',event=>{if(phase!=='playing'||(event.pointerType==='mouse'&&event.button!==0))return;if(pointer!==null)return;pointer=event.pointerId;world.setPointerCapture(pointer);movePointer(event);});
  world.addEventListener('pointermove',event=>{if(phase==='playing'&&(pointer===event.pointerId||(event.pointerType==='mouse'&&pointer===null)))movePointer(event);});
  const release=event=>{if(event.pointerId===pointer)pointer=null;};world.addEventListener('pointerup',release);world.addEventListener('pointercancel',release);world.addEventListener('lostpointercapture',release);
  world.addEventListener('contextmenu',event=>event.preventDefault());
  document.addEventListener('keydown',event=>{
    if (['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(event.code)&&phase==='playing') {event.preventDefault();keys.add(event.code);}
    if (event.repeat)return;
    if ((event.code==='Escape'||event.code==='KeyP')&&['playing','countdown'].includes(phase)) {event.preventDefault();pause();}
    else if(event.code==='KeyP'&&phase==='paused')resume();
  });
  document.addEventListener('keyup',event=>keys.delete(event.code));
  $('start-button').addEventListener('click',startRound);$('again-button').addEventListener('click',startRound);$('restart-button').addEventListener('click',startRound);
  $('pause-button').addEventListener('click',()=>pause());$('resume-button').addEventListener('click',resume);
  $('pause-dialog').addEventListener('cancel',event=>{event.preventDefault();resume();});
  $('result-dialog').addEventListener('cancel',event=>event.preventDefault());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause('Игра остановлена, пока ты был на другой странице.');lastFrame=0;});
  window.addEventListener('blur',()=>pause('Игра подождёт, пока ты вернёшься.'));
  window.addEventListener('pagehide',saveBest);
  function resize() { const width=field.clientWidth,height=field.clientHeight;const majorChange=Math.abs(width/game.state.width-1)>.15||Math.abs(height/game.state.height-1)>.15;game.resize(width,height);giftNodes.clear();giftLayer.replaceChildren();world.setAttribute('viewBox',`0 0 ${width} ${height}`);render();if(majorChange&&['playing','countdown'].includes(phase))pause('Размер экрана изменился. Можно продолжить.'); }
  window.addEventListener('resize',resize);
  for(let i=0;i<5;i++){const icon=svg('svg',{viewBox:'0 0 40 40','aria-hidden':'true'});icon.append(svg('use',{href:'#paper-heart',width:40,height:40}));$('lives').append(icon);}
  refreshBest();resize();requestAnimationFrame(frame);
})();
