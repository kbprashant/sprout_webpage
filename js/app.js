/* ============================================================
   APP.JS — wires everything together. You shouldn't need to
   edit this file for a normal reskin; use config.js + assets/
   instead. Only touch this if you want to change *behavior*.
   ============================================================ */

(function(){

  // ---------- decorative floating background shapes ----------
  const bgColors=['#ff5da2','#7b5cff','#ffd23f','#28d0c0','#5cc9ff'];
  for(let i=0;i<9;i++){
    const s=document.createElement('div');
    s.className='bg-shape';
    const size = 20 + Math.random()*60;
    s.style.width=size+'px';
    s.style.height=size+'px';
    s.style.left=Math.random()*100+'vw';
    s.style.top=Math.random()*100+'vh';
    s.style.background=bgColors[i%bgColors.length];
    s.style.animationDuration=(6+Math.random()*6)+'s';
    s.style.animationDelay=(Math.random()*4)+'s';
    document.body.appendChild(s);
  }

  // ---------- confetti ----------
  function burstConfetti(container){
    const colors=['#ff5da2','#ffd23f','#28d0c0','#7b5cff','#5cc9ff','#ffffff'];
    for(let i=0;i<14;i++){
      const p=document.createElement('div');
      p.className='confetti-piece';
      const angle = Math.random()*Math.PI*2;
      const dist = 40+Math.random()*60;
      p.style.setProperty('--dx', Math.cos(angle)*dist+'px');
      p.style.setProperty('--dy', Math.sin(angle)*dist+'px');
      p.style.setProperty('--rot', (Math.random()*360)+'deg');
      p.style.background = colors[i%colors.length];
      container.appendChild(p);
      setTimeout(()=>p.remove(), 950);
    }
  }

  // ---------- asset probing (checks if you've dropped in real files) ----------
  function probeImage(src){
    return new Promise(resolve=>{
      if(!src) return resolve(false);
      const img=new Image();
      img.onload=()=>resolve(true);
      img.onerror=()=>resolve(false);
      img.src=src;
    });
  }
  function probeAudio(src){
    return new Promise(resolve=>{
      if(!src) return resolve(false);
      const a=new Audio();
      let done=false;
      a.addEventListener('loadedmetadata', ()=>{ if(!done){done=true; resolve(true);} });
      a.addEventListener('error', ()=>{ if(!done){done=true; resolve(false);} });
      a.preload='auto';
      a.src=src;
      // safety timeout in case neither event fires
      setTimeout(()=>{ if(!done){done=true; resolve(false);} }, 1500);
    });
  }

  // ---------- DOM refs ----------
  const phone      = document.getElementById('phone');
  const phoneTop    = document.getElementById('phoneTop');
  const faceBack    = document.getElementById('faceBack');
  const closeBtn    = document.getElementById('closeBtn');
  const screen      = document.getElementById('screen');
  const stage       = document.getElementById('stage');
  const badge       = document.getElementById('badge');
  const keypad      = document.getElementById('keypad');

  const idlePhrases = [
    "Press any button<br>to say hello! 👋",
    "Let's play!<br>Tap a button 🎵",
    "Boop boop!<br>Try me! 😄"
  ];

  let isOpen = false;
  let currentAudio = null;      // custom <audio> element currently looping
  let badgeTimeout, idleTimeout;

  // ---------- build keypad from config ----------
  const keyStatus = {}; // id -> {hasSound, hasGif}
  PHONE_CONFIG.keys.forEach(k=>{
    const btn=document.createElement('button');
    btn.className='key'+(k.special?' key-special':'');
    btn.innerHTML = `<span>${k.label}</span>` + (k.sub?`<span class="sub">${k.sub}</span>`:'');
    btn.addEventListener('click', ()=>pressKey(k, btn));
    keypad.appendChild(btn);

    keyStatus[k.id] = {hasSound:false, hasGif:false};
    probeAudio(k.sound).then(ok=>keyStatus[k.id].hasSound=ok);
    probeImage(k.gif).then(ok=>keyStatus[k.id].hasGif=ok);
  });

  let flipStatus = {openHasSound:false, closeHasSound:false};
  probeAudio(PHONE_CONFIG.flip.openSound).then(ok=>flipStatus.openHasSound=ok);
  probeAudio(PHONE_CONFIG.flip.closeSound).then(ok=>flipStatus.closeHasSound=ok);

  // ---------- stop whatever is currently playing ----------
  function stopCurrentSound(){
    if(currentAudio){ currentAudio.pause(); currentAudio.currentTime=0; currentAudio=null; }
    BoopAudio.stopLoop();
  }

  // ---------- key press ----------
  function pressKey(k, btn){
    if(!isOpen) return;

    btn.classList.add('pressed');
    setTimeout(()=>btn.classList.remove('pressed'), 180);

    // sound: prefer your custom file, loop it; else fall back to synth loop
    stopCurrentSound();
    if(keyStatus[k.id] && keyStatus[k.id].hasSound){
      currentAudio = new Audio(k.sound);
      currentAudio.loop = true;
      currentAudio.play().catch(()=>{ BoopAudio.playLoopedChord(k.fallbackFreqs); });
    } else {
      BoopAudio.playLoopedChord(k.fallbackFreqs);
    }

    // screen visual: prefer your custom gif (loops natively), else emoji animation
    if(keyStatus[k.id] && keyStatus[k.id].hasGif){
      stage.innerHTML = `<img class="actor-gif" src="${k.gif}" alt="${k.label}">`;
    } else {
      stage.innerHTML = `<div class="actor-emoji ${k.fallbackAnim}">${k.fallbackEmoji}</div>`;
    }

    // popup badge
    clearTimeout(badgeTimeout);
    badge.textContent = (k.fallbackEmoji||'') + ' ' + k.label;
    badge.classList.remove('show');
    void badge.offsetWidth;
    badge.classList.add('show');
    badgeTimeout=setTimeout(()=>badge.classList.remove('show'), 1400);

    burstConfetti(screen);

    clearTimeout(idleTimeout);
    idleTimeout=setTimeout(()=>{
      stopCurrentSound();
      stage.innerHTML = `<div class="idle-msg">${idlePhrases[Math.floor(Math.random()*idlePhrases.length)]}</div>`;
    }, 7000);
  }

  // ---------- flip open ----------
  function openPhone(){
    if(isOpen) return;
    isOpen = true;
    BoopAudio.unlock();

    if(flipStatus.openHasSound){
      const a = new Audio(PHONE_CONFIG.flip.openSound);
      a.play().catch(()=>BoopAudio.playClick());
    } else {
      BoopAudio.playClick();
    }

    phoneTop.classList.add('open');
    phone.classList.add('is-open');

    const onDone = (e)=>{
      if(e.propertyName !== 'transform') return;
      phoneTop.removeEventListener('transitionend', onDone);
      screen.classList.add('lit');
    };
    phoneTop.addEventListener('transitionend', onDone);
  }

  // ---------- flip close ----------
  function closePhone(){
    if(!isOpen) return;
    isOpen = false;
    stopCurrentSound();

    if(flipStatus.closeHasSound){
      const a = new Audio(PHONE_CONFIG.flip.closeSound);
      a.play().catch(()=>BoopAudio.playClick());
    } else {
      BoopAudio.playClick();
    }

    screen.classList.remove('lit');
    phoneTop.classList.remove('open');
    phone.classList.remove('is-open');
    stage.innerHTML = `<div class="idle-msg">${idlePhrases[0]}</div>`;
  }

  faceBack.addEventListener('click', openPhone);
  closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); closePhone(); });

  // unlock audio on first touch (mobile requirement)
  document.body.addEventListener('touchstart', ()=>BoopAudio.unlock(), {once:true});
  document.body.addEventListener('click', ()=>BoopAudio.unlock(), {once:true});

})();
