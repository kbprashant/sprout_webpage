/* ============================================================
   AUDIO.JS — built-in synthesized sounds.
   These play automatically ONLY when a key or the flip hinge
   doesn't have a matching custom sound file yet. You never need
   to edit this file — just add real files via config.js / assets.
   ============================================================ */

const BoopAudio = (function(){
  let ctx;
  function getCtx(){
    if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playChord(freqs, dur=0.32){
    const ac=getCtx();
    const now=ac.currentTime;
    freqs.forEach((f,i)=>{
      const osc=ac.createOscillator();
      const gain=ac.createGain();
      osc.type = i===0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now+0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now+dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(now);
      osc.stop(now+dur+0.05);
    });
  }

  // toy "click" for the flip hinge — short filtered noise burst
  function playClick(){
    const ac=getCtx();
    const now=ac.currentTime;
    const bufferSize = ac.sampleRate * 0.06;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){
      data[i] = (Math.random()*2-1) * (1 - i/bufferSize);
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type='bandpass';
    filter.frequency.value=1800;
    filter.Q.value=1.2;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now+0.07);
    noise.connect(filter).connect(gain).connect(ac.destination);
    noise.start(now);
    noise.stop(now+0.08);
  }

  let loopTimer=null;
  function stopLoop(){
    if(loopTimer){ clearInterval(loopTimer); loopTimer=null; }
  }
  function playLoopedChord(freqs, gap=340){
    stopLoop();
    playChord(freqs);
    loopTimer = setInterval(()=>playChord(freqs), gap);
  }

  function unlock(){ getCtx(); }

  return { playChord, playClick, playLoopedChord, stopLoop, unlock };
})();
