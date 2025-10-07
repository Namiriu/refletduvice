(function(){
  // ---------- Config ----------
  const PLUS  = [1,2,3,5,10,20];
  const MINUS = [1,2,3,5,10,20];
  const LSK   = (k)=>'jds_'+k;
  const VERSION = 'v0.6 Playtest';

  // Ambiances longues (playlist)
  const AMBIENT_TRACKS = [
    'audio/ambient_loop.mp3',
    // 'audio/ambient_2.mp3',
    // 'audio/ambient_3.mp3',
  ];

  // SFX “hantés”
  const HAUNT = {
    perClickProb: 0.14,
    passiveEvery: [38000, 68000],
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
  const ambientEl  = document.getElementById('ambient');
  const fsBtn      = document.getElementById('fsToggle');

  const worldRadios = document.querySelectorAll('input[name="world"]');
  const playersSel  = document.getElementById('players');
  const quartierSel = document.getElementById('quartier');

  const mainEl     = document.querySelector('main');
  const vignetteEl = document.getElementById('vignette');
  const historyEl  = document.getElementById('historyList');
  const versionEl  = document.getElementById('version');

  const btnAnchor  = document.getElementById('btnAnchor');
  const btnCamp    = document.getElementById('btnCamp');
  const anchorInfo = document.getElementById('anchorInfo');
  const campInfo   = document.getElementById('campInfo');

  const fxFlash = document.getElementById('fxFlash');
  const fxBlack = document.getElementById('fxBlack');
  const btnNew  = document.getElementById('btnNew');

  // ---- Fin de partie (ID corrigé: "gameover") ----
  const goModal   = document.getElementById('gameover');
  const goYes     = document.getElementById('goYes');
  const goNo      = document.getElementById('goNo');
  let gameOverShown = false;

  function showGameOver(){
    if (!goModal) return;
    gameOverShown = true;
    // voile dramatique
    fxBlack.style.opacity = '1';
    setTimeout(()=>{ fxBlack.style.opacity = '.9'; }, 200);
    // modale
    goModal.classList.add('show');
  }
  function hideGameOver(){
    if (!goModal) return;
    goModal.classList.remove('show');
    fxBlack.style.opacity = '0';
    gameOverShown = false;
  }
  async function tryQuitApp(){
    try{ if (document.fullscreenElement) await document.exitFullscreen(); }catch(_){}
    ambientEl.pause();
    if (window.history.length > 1) window.history.back();
    try{ window.open('','_self').close(); }catch(_){}
  }

  // Gate
  const gate       = document.getElementById('gate');
  const gateInput  = document.getElementById('gateInput');
  const gateBtn    = document.getElementById('gateBtn');
  const gateError  = document.getElementById('gateError');
  const GATE_KEY   = 'playtest_gate_hash';
  const PASSPHRASE_HASH = 'sha256:2bbeda386f095c9cfe421ce02841bd948cd1405fb3cafa726947a8431a3d15ce';
  if (localStorage.getItem(GATE_KEY) === PASSPHRASE_HASH) {
    gate.style.display = 'none';
  }

  // Seuils d’alerte
  const THRESHOLD_ENTER = 50; // ≥ 50% → Reflet du vice
  const THRESHOLD_EXIT  = 49; // ≤ 49% → Retour normal

  // Voix (optionnelles)
  const VOICES = {
    enter: 'audio/voice_enter_reflet.wav',
    exit:  'audio/voice_return_normal.mp3'
  };

  // Alerte UI
  const alertBox  = document.getElementById('alert');
  const alertText = document.getElementById('alertText');

  // ---------- État ----------
  let state = {
    value:     parseInt(localStorage.getItem(LSK('instability'))||'0',10),
    world:     localStorage.getItem(LSK('world')) || 'normal',
    players:   parseInt(localStorage.getItem(LSK('players')) || '3',10),
    quartier:  parseInt(localStorage.getItem(LSK('quartier'))||'1',10),
    anchorUsed: JSON.parse(localStorage.getItem(LSK('anchorUsed'))||'{"1":false,"2":false,"3":false,"4":false}'),
    campLeft:  parseInt(localStorage.getItem(LSK('campLeft')) || '3',10),
    musicOn:   localStorage.getItem(LSK('musicOn')) === '1',
  };

  const clamp = v => Math.max(0, Math.min(100, v));
  const fmt   = v => v + ' %';

  // --- Historique simple ---
  const history = [];
  function addHistory(delta) {
    const s = (delta > 0 ? `+${delta}` : `${delta}`) + ' %';
    history.unshift(s);
    if (history.length > 8) history.pop();
    renderHistory();
  }
  function renderHistory() {
    if (!historyEl) return;
    historyEl.innerHTML = history.map(item => `<li>${item}</li>`).join('');
  }

  // --- Effets d'ambiance selon la valeur ---
  function applyMoodEffects(val) {
    if (val >= 90) {
      const t = Math.min(1, (val - 90) / 10);
      vignetteEl.style.opacity = (0.55 + 0.35 * t).toFixed(2);
    } else {
      vignetteEl.style.opacity = '0';
    }
  }
  function microEffect(val) {
    if (val >= 60 && val < 90) {
      if (Math.random() < 0.5) {
        mainEl.classList.add('fx-blur');
        setTimeout(() => mainEl.classList.remove('fx-blur'), 240);
      } else {
        mainEl.classList.add('fx-shake');
        setTimeout(() => mainEl.classList.remove('fx-shake'), 360);
      }
    }
  }

  function save(){
    localStorage.setItem(LSK('instability'), String(state.value));
    localStorage.setItem(LSK('world'),      state.world);
    localStorage.setItem(LSK('players'),    String(state.players));
    localStorage.setItem(LSK('quartier'),   String(state.quartier));
    localStorage.setItem(LSK('anchorUsed'), JSON.stringify(state.anchorUsed));
    localStorage.setItem(LSK('campLeft'),   String(state.campLeft));
    localStorage.setItem(LSK('musicOn'),    state.musicOn ? '1' : '0');
  }

  // ---- Fullscreen helpers ----
  async function enterFullscreen(){ try{ if(!document.fullscreenElement) await document.documentElement.requestFullscreen(); }catch(_){}} 
  async function exitFullscreen(){ try{ if(document.fullscreenElement) await document.exitFullscreen(); }catch(_){}} 
  const isFullscreen = ()=>!!document.fullscreenElement;

  function render(){
    bar.style.width = clamp(state.value) + '%';
    percent.textContent = fmt(state.value);
    document.title = 'Instabilité ' + fmt(state.value);

    checkThresholdTransition(); // 49/50

    applyMoodEffects(state.value);
    if (versionEl) versionEl.textContent = VERSION;

    // Contexte
    worldRadios.forEach(r => r.checked = (r.value === state.world));
    playersSel.value  = String(state.players);
    quartierSel.value = String(state.quartier);

    // Actions spéciales
    const q    = String(state.quartier);
    const used = !!state.anchorUsed[q];
    if (state.world === 'reflet'){
      btnAnchor.disabled = used;
      anchorInfo.textContent = `Restant : ${used ? 0 : 1} (1 par quartier)`;
      btnCamp.disabled = true;
      campInfo.textContent = `Utilisations restantes : 0`;
    } else {
      btnAnchor.disabled = true;
      anchorInfo.textContent = `Restant : 0 (1 par quartier)`;
      btnCamp.disabled = state.campLeft <= 0;
      campInfo.textContent = `Utilisations restantes : ${state.campLeft}`;
    }

    // Musique + plein écran
    audioBtn.textContent = state.musicOn ? 'MUSIQUE ON' : 'MUSIQUE OFF';
    audioBtn.setAttribute('aria-pressed', state.musicOn ? 'true' : 'false');
    if (fsBtn){
      fsBtn.textContent = isFullscreen() ? 'Quitter plein écran' : 'Plein écran';
      fsBtn.setAttribute('aria-pressed', isFullscreen() ? 'true' : 'false');
    }

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
        if (gameOverShown) return;
        const delta = sign * v;
        state.value = clamp(state.value + delta);
        addHistory(delta);
        microEffect(state.value);
        render();
        checkGameOver();
        maybeHaunt();
      });
      return b;
    });
  }
  mkButtons(PLUS, +1).forEach(b=>rowPlus.appendChild(b));
  mkButtons(MINUS, -1).forEach(b=>rowMinus.appendChild(b));

  // ---------- Effets hantés ----------
  function randInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function flashWhite(ms=120){ fxFlash.style.opacity='1'; setTimeout(()=> fxFlash.style.opacity='0', ms); }
  function flashBlack(ms=420){ fxBlack.style.opacity='1'; setTimeout(()=> fxBlack.style.opacity='0', ms); }
  function blackout(ms=900){
    fxBlack.style.transition='opacity .12s'; fxBlack.style.opacity='1';
    setTimeout(()=>{ fxBlack.style.opacity='0'; fxBlack.style.transition='opacity .4s'; }, ms);
  }
  function playSFX(vol=0.9){ try{ const a=new Audio(pick(HAUNT.sfx)); a.volume=vol; a.play().catch(()=>{});}catch(_){}} 
  function triggerHaunt(){
    const which = randInt(1,4);
    if (which===1) flashWhite(randInt(90,160));
    else if (which===2) flashBlack(randInt(200,480));
    else if (which===3) blackout(randInt(700,1100));
    if (Math.random() < 0.85) playSFX(0.9);
  }
  function maybeHaunt(force=false){ if (force || Math.random() < HAUNT.perClickProb) triggerHaunt(); }

  // ---------- Alertes 49 / 50 ----------
  function showAlert(msg, type='reflet', voiceSrc=null) {
    alertText.textContent = msg;
    alertBox.classList.add('show', type);
    if (voiceSrc) { const a=new Audio(voiceSrc); a.volume=0.9; a.play().catch(()=>{}); }
    setTimeout(()=> alertBox.classList.remove('show'), 5000);
    setTimeout(()=> alertBox.classList.remove(type), 6000);
  }
  const zoneFromValue = v => v >= THRESHOLD_ENTER ? 'reflet' : 'normal';
  let lastZone = zoneFromValue(parseInt(localStorage.getItem(LSK('instability'))||'0',10));
  function checkThresholdTransition() {
    const current = state.value;
    if (lastZone === undefined) lastZone = current >= 50 ? 'reflet' : 'normal';
    if (current >= 50 && lastZone !== 'reflet') {
      showAlert('Vous basculez dans le Reflet du vice','reflet', VOICES.enter);
      lastZone = 'reflet';
    } else if (current < 50 && lastZone !== 'normal') {
      showAlert('Vous reprenez pied dans le monde normal','normal', VOICES.exit);
      lastZone = 'normal';
    }
  }

  // ---------- Fin de partie (100%) ----------
  function checkGameOver(){
    if (state.value >= 100 && !gameOverShown){
      state.value = 100;
      render();
      showGameOver();
    }
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
    if(state.world!=='reflet' || gameOverShown) return;
    const q = String(state.quartier);
    if(state.anchorUsed[q]) return;
    state.anchorUsed[q] = true;
    state.value = clamp(state.value - 15);
    addHistory(-15);
    microEffect(state.value);
    render();
    checkGameOver();
    maybeHaunt(true);
  });

  btnCamp.addEventListener('click', ()=>{
    if(state.world!=='normal' || state.campLeft<=0 || gameOverShown) return;
    state.campLeft -= 1;
    state.value = clamp(state.value - 30);
    addHistory(-30);
    microEffect(state.value);
    render();
    checkGameOver();
    maybeHaunt(true);
  });

  // ---------- Nouvelle partie ----------
  function newGame(){
    state.value = 0;
    state.campLeft = 3;
    state.anchorUsed = {"1":false,"2":false,"3":false,"4":false};
    history.length = 0;
    renderHistory();
    lastZone = 'normal';
    hideGameOver();
    render();
  }
  if (btnNew){
    btnNew.addEventListener('click', ()=>{
      if (confirm('Nouvelle partie ? La jauge et les usages spéciaux seront remis à zéro.')) newGame();
    });
  }

  // --- Fin de partie : actions Oui/Non ---
  goYes?.addEventListener('click', ()=>{ newGame(); });
  goNo?.addEventListener('click', ()=>{
    try{ navigator.vibrate?.(120); }catch(_){}
    tryQuitApp();
  });

  // ---------- Contexte ----------
  worldRadios.forEach(r=> r.addEventListener('change', ()=>{
    if(r.checked){ state.world = r.value; render(); maybeHaunt(); }
  }));
  playersSel.addEventListener('change', ()=>{ state.players = parseInt(playersSel.value,10)||3; render(); });
  quartierSel.addEventListener('change', ()=>{ state.quartier = parseInt(quartierSel.value,10)||1; render(); });

  // ---------- Musique (playlist ambiance) ----------
  let ambientIdx = 0;
  function playAmbientCurrent(){
    if(!state.musicOn) return;
    ambientEl.loop = false;
    ambientEl.src  = AMBIENT_TRACKS[ambientIdx % AMBIENT_TRACKS.length];
    ambientEl.volume = 0.55;
    ambientEl.play().catch(()=>{});
  }
  ambientEl.addEventListener('ended', ()=>{
    ambientIdx = (ambientIdx + 1) % AMBIENT_TRACKS.length;
    playAmbientCurrent();
  });
  audioBtn.addEventListener('click', ()=>{
    state.musicOn = !state.musicOn;
    if(state.musicOn) playAmbientCurrent(); else ambientEl.pause();
    render();
  });

  // ---- Plein écran ----
  if (fsBtn){
    fsBtn.addEventListener('click', async ()=>{
      if (isFullscreen()) await exitFullscreen(); else await enterFullscreen();
      render();
    });
  }
  document.addEventListener('fullscreenchange', render);

  // ---------- Gate ----------
  async function sha256Hex(s){
    const enc = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function okGate(){
    gate.style.display='none';
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

  // ===== Wake Lock (anti-veille) =====
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener?.('release', () => {});
      }
    } catch (_){}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && wakeLock !== null) {
      requestWakeLock();
    }
  });

  // ===== PWA Install (Android/Chrome) + iOS fallback =====
  let deferredPrompt = null;
  const banner = document.getElementById('installBanner');
  const btnInstall = document.getElementById('installBtn');
  const btnInstallClose = document.getElementById('installClose');
  const installText = document.getElementById('installText');

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  function showBanner() {
    if (isStandalone) return;
    banner.classList.add('show');
    banner.setAttribute('aria-hidden','false');
    if (isIOS) { installText.textContent = 'Sur iPhone : touchez “Partager” puis “Ajouter à l’écran d’accueil”.'; btnInstall.textContent = 'OK'; }
  }
  function hideBanner(permanently=false){
    banner.classList.remove('show');
    banner.setAttribute('aria-hidden','true');
    if (permanently) localStorage.setItem('hideInstall','1');
  }
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    maybeShowInstallBanner();
  });
  btnInstall?.addEventListener('click', async ()=>{
    if (isIOS) { hideBanner(true); return; }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (choice.outcome === 'accepted') hideBanner(true);
  });
  btnInstallClose?.addEventListener('click', ()=> hideBanner(true));

  function maybeShowInstallBanner(){
    if (isStandalone) return;
    const sp = new URLSearchParams(location.search);
    const askedFromQR = sp.get('install') === '1';
    const userRefused = localStorage.getItem('hideInstall') === '1';
    if (isIOS){
      if (askedFromQR && !userRefused) showBanner();
    } else {
      if (!deferredPrompt) return;
      if (askedFromQR || !userRefused) showBanner();
    }
  }

  // ---------- Init ----------
  function init(){
    checkGate();
    render();
    schedulePassive();
    if(state.musicOn) playAmbientCurrent();
    requestWakeLock();
    maybeShowInstallBanner(); // pour le cas iOS ou si deferredPrompt déjà dispo
  }
  document.addEventListener('DOMContentLoaded', init);
})();
