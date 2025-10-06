(function(){
  // ---------- Config ----------
  const PLUS  = [1,2,3,5,10,20];
  const MINUS = [1,2,3,5,10,20];
  const LSK   = (k)=>'jds_'+k;

  // Ambiances longues (playlist). Ajoute tes pistes ici si tu en as d’autres.
  const AMBIENT_TRACKS = [
    'audio/ambient_loop.mp3', // existant
    // 'audio/ambient_2.mp3',
    // 'audio/ambient_3.mp3',
  ];

  // SFX “hantés” (tes sons du dossier audio/sounds/)
  const HAUNT = {
    perClickProb: 0.14,              // 14% à chaque action
    passiveEvery: [38000, 68000],    // effets passifs ~38–68s
    sfx: [
      'audio/sounds/creepy_crow_caw.mp3',
      'audio/sounds/creepy_ghost_whisper.mp3',
      'audio/sounds/creepy_laugh.mp3',
      'audio/sounds/creepy_wind.mp3',
      'audio/sounds/door_slam_angrily.mp3',
      'audio/sounds/footsteps_on_wooden_floor.mp3',
      'audio/sounds/forest_whisper.mp3',
      'audio/sounds/scratching_metal.mp3',
      'audio/sounds/whisper_voices.mp3',
      'audio/sounds/wood_creak_single.mp3',
    ]
  };

  // ---------- Sélecteurs ----------
  const bar        = document.getElementById('bar');
  const percent    = document.getElementById('percent');
  const rowPlus    = document.getElementById('rowPlus');
  const rowMinus   = document.getElementById('rowMinus');
  const audioBtn   = document.getElementById('audioToggle');
  const ambientEl  = document.getElementById('ambient'); // lecteur unique pour l’ambiance

  const worldRadios = document.querySelectorAll('input[name="world"]');
  const playersSel  = document.getElementById('players');
  const quartierSel = document.getElementById('quartier');

  const btnAnchor  = document.getElementById('btnAnchor');
  const btnCamp    = document.getElementById('btnCamp');
  const anchorInfo = document.getElementById('anchorInfo');
  const campInfo   = document.getElementById('campInfo');

  const fxFlash = document.getElementById('fxFlash');
  const fxBlack = document.getElementById('fxBlack');

  // Gate
  const gate       = document.getElementById('gate');
  const gateInput  = document.getElementById('gateInput');
  const gateBtn    = document.getElementById('gateBtn');
  const gateError  = document.getElementById('gateError');
  const GATE_KEY   = 'playtest_gate_hash';
  // Hash SHA-256 fourni dans ton code (garde-le tel quel : mot de passe = la valeur qui correspond à ce hash)
  const PASSPHRASE_HASH = 'sha256:2bbeda386f095c9cfe421ce02841bd948cd1405fb3cafa726947a8431a3d15ce';

  // ---------- État ----------
  let state = {
    value:     parseInt(localStorage.getItem(LSK('instability'))||'0',10),
    world:     localStorage.getItem(LSK('world')) || 'normal', // 'normal' | 'reflet'
    players:   parseInt(localStorage.getItem(LSK('players')) || '3',10),
    quartier:  parseInt(localStorage.getItem(LSK('quartier'))||'1',10),
    anchorUsed: JSON.parse(localStorage.getItem(LSK('anchorUsed'))||'{"1":false,"2":false,"3":false,"4":false}'),
    campLeft:  parseInt(localStorage.getItem(LSK('campLeft')) || '3',10),
    musicOn:   localStorage.getItem(LSK('musicOn')) === '1',
  };

  function save(){
    localStorage.setItem(LSK('instability'), String(state.value));
    localStorage.setItem(LSK('world'),      state.world);
    localStorage.setItem(LSK('players'),    String(state.players));
    localStorage.setItem(LSK('quartier'),   String(state.quartier));
    localStorage.setItem(LSK('anchorUsed'), JSON.stringify(state.anchorUsed));
    localStorage.setItem(LSK('campLeft'),   String(state.campLeft));
    localStorage.setItem(LSK('musicOn'),    state.musicOn ? '1' : '0');
  }

  const clamp = v => Math.max(0, Math.min(100, v));
  const fmt   = v => v + ' %';

  function render(){
    bar.style.width = clamp(state.value) + '%';
    percent.textContent = fmt(state.value);
    document.title = 'Instabilité ' + fmt(state.value);

    // Monde / sélecteurs
    worldRadios.forEach(r => r.checked = (r.value === state.world));
    playersSel.value  = String(state.players);
    quartierSel.value = String(state.quartier);

    // Actions spéciales
    const q      = String(state.quartier);
    const used   = !!state.anchorUsed[q];

    if (state.world === 'reflet'){
      btnAnchor.disabled = used;
      anchorInfo.textContent = `Restant : ${used ? 0 : 1} (1 par quartier)`;
      btnCamp.disabled = true;
      campInfo.textContent = `Utilisations restantes : 0`;
    } else { // normal
      btnAnchor.disabled = true;
      anchorInfo.textContent = `Restant : 0 (1 par quartier)`;
      btnCamp.disabled = state.campLeft <= 0;
      campInfo.textContent = `Utilisations restantes : ${state.campLeft}`;
    }

    // Musique
    audioBtn.textContent = state.musicOn ? 'MUSIQUE ON' : 'MUSIQUE OFF';
    audioBtn.setAttribute('aria-pressed', state.musicOn ? 'true' : 'false');

    save();
  }

  // ---------- Boutons +/- ----------
  function mkButtons(arr, sign){
    return arr.map(v=>{
      const b = document.createElement('button');
      b.classList.add('btn');
      if (sign > 0) { b.classList.add('btn-plus',  'btn-p'+v); }
      else          { b.classList.add('btn-minus', 'btn-m'+v); }

      b.addEventListener('click', ()=>{
        state.value = clamp(state.value + sign*v);
        render();
        maybeHaunt();
      });
      return b;
    });
  }
  mkButtons(PLUS, +1).forEach(b=>rowPlus.appendChild(b));
  mkButtons(MINUS, -1).forEach(b=>rowMinus.appendChild(b));

  // ---------- Effets hantés (obligatoires, invisibles) ----------
  function randInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function flashWhite(ms=120){
    fxFlash.style.opacity = '1';
    setTimeout(()=> fxFlash.style.opacity='0', ms);
  }
  function flashBlack(ms=420){
    fxBlack.style.opacity = '1';
    setTimeout(()=> fxBlack.style.opacity='0', ms);
  }
  function blackout(ms=900){
    fxBlack.style.transition = 'opacity .12s';
    fxBlack.style.opacity = '1';
    setTimeout(()=>{
      fxBlack.style.opacity='0';
      fxBlack.style.transition = 'opacity .4s';
    }, ms);
  }

  function playSFX(vol=0.9){
    try{
      const a = new Audio(pick(HAUNT.sfx));
      a.volume = vol;
      a.play().catch(()=>{});
    }catch(e){}
  }

  function triggerHaunt(){
    const which = randInt(1,4);
    switch(which){
      case 1: flashWhite(randInt(90,160)); break;
      case 2: flashBlack(randInt(200,480)); break;
      case 3: blackout(randInt(700,1100)); break;
      case 4: /* sfx only */ break;
    }
    if (Math.random() < 0.85) playSFX(0.9); // souvent accompagné d’un son
  }

  function maybeHaunt(force=false){
    if (force || Math.random() < HAUNT.perClickProb) triggerHaunt();
  }

  // Effets passifs réguliers
  let passiveTimer = null;
  function schedulePassive(){
    clearTimeout(passiveTimer);
    const [min,max] = HAUNT.passiveEvery;
    passiveTimer = setTimeout(()=>{
      if(Math.random()<0.6) playSFX(0.9); else flashBlack(160);
      schedulePassive();
    }, randInt(min, max));
  }

  // ---------- Actions spéciales ----------
  btnAnchor.addEventListener('click', ()=>{
    if(state.world!=='reflet') return;
    const q = String(state.quartier);
    if(state.anchorUsed[q]) return;
    state.anchorUsed[q] = true;
    state.value = clamp(state.value - 15);
    render();
    maybeHaunt(true); // effet garanti
  });

  btnCamp.addEventListener('click', ()=>{
    if(state.world!=='normal' || state.campLeft<=0) return;
    state.campLeft -= 1;
    state.value = clamp(state.value - 30);
    render();
    maybeHaunt(true);
  });

  // ---------- Contexte ----------
  worldRadios.forEach(r=> r.addEventListener('change', ()=>{
    if(r.checked){ state.world = r.value; render(); maybeHaunt(); }
  }));
  playersSel.addEventListener('change', ()=>{
    state.players = parseInt(playersSel.value,10)||3; render();
  });
  quartierSel.addEventListener('change', ()=>{
    state.quartier = parseInt(quartierSel.value,10)||1; render();
  });

  // ---------- Musique (playlist ambiance) ----------
  let ambientIdx = 0;
  function playAmbientCurrent(){
    if(!state.musicOn) return;
    ambientEl.loop = false;                 // playlist → pas de loop par piste
    ambientEl.src  = AMBIENT_TRACKS[ambientIdx % AMBIENT_TRACKS.length];
    ambientEl.volume = 0.55;
    ambientEl.play().catch(()=>{ /* besoin d’un clic utilisateur */ });
  }
  ambientEl.addEventListener('ended', ()=>{
    ambientIdx = (ambientIdx + 1) % AMBIENT_TRACKS.length;
    playAmbientCurrent();
  });

  audioBtn.addEventListener('click', ()=>{
    state.musicOn = !state.musicOn;
    if(state.musicOn){
      playAmbientCurrent();
    }else{
      ambientEl.pause();
    }
    render();
  });

  // ---------- Gate ----------
  async function sha256Hex(s){
    const enc = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function okGate(){
    gate.style.display='none';
    // registre le SW après la gate
    if ('serviceWorker' in navigator){
      navigator.serviceWorker.register('./service-worker.js');
    }
  }
  async function checkGate(){
    const stored = localStorage.getItem(GATE_KEY);
    if (stored === PASSPHRASE_HASH) { okGate(); return; }
    gate.style.display='flex';
  }
  gateBtn.addEventListener('click', async ()=>{
    const h = await sha256Hex((gateInput.value||'').trim());
    const target = PASSPHRASE_HASH.replace('sha256:','');
    if (h === target){
      localStorage.setItem(GATE_KEY, PASSPHRASE_HASH);
      okGate();
    } else {
      gateError.textContent = 'Mot de passe incorrect.';
    }
  });
  gateInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') gateBtn.click(); });

  // ---------- Init ----------
  function init(){
    // Gate
    checkGate();

    // Rendu & timers
    render();
    schedulePassive();

    // Si musique déjà activée précédemment
    if(state.musicOn) playAmbientCurrent();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
