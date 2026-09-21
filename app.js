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
      'audio/groan.wav',
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

  // Modale Point d'Ancrage
  const anchorModal   = document.getElementById('anchorModal');
  const anchorConfirm = document.getElementById('anchorConfirm');

  // Fin de partie
  const goModal   = document.getElementById('gameover');
  const goYes     = document.getElementById('goYes');
  const goNo      = document.getElementById('goNo');
  let gameOverShown = false;

  function showGameOver(){
    if (!goModal) return;
    gameOverShown = true;
    
    // Joue le gémissement au game over
    playSFXFile('audio/groan.wav');

    fxBlack.style.opacity = '1';
    setTimeout(()=>{ fxBlack.style.opacity = '.9'; }, 200);
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

  // Voix
  const VOICES = {
    enter: 'audio/voice_enter_reflet.wav',
    exit:  'audio/voice_return_normal.mp3'
  };

  // Alerte UI
  const alertBox  = document.getElementById('alert');
  const alertText = document.getElementById('alertText');

  // ---------- État ----------
  let state = {
    value:       parseInt(localStorage.getItem(LSK('instability'))||'0',10),
    world:       localStorage.getItem(LSK('world')) || 'normal',
    players:     parseInt(localStorage.getItem(LSK('players')) || '3',10),
    quartier:    parseInt(localStorage.getItem(LSK('quartier'))||'1',10),
    anchorUsed:  JSON.parse(localStorage.getItem(LSK('anchorUsed'))||'{"1":false,"2":false,"3":false,"4":false}'),
    campLeft:    parseInt(localStorage.getItem(LSK('campLeft')) || '2',10), // 2 utilisations max
    musicOn:     localStorage.getItem(LSK('musicOn')) === '1',
  };

  const clamp = v => Math.max(0, Math.min(100, v));
  const fmt   = v => v + ' %';

  // --- Historique simple ---
  const history = [];
  function addHistory(delta) {
    const s = typeof delta === 'number' 
      ? (delta > 0 ? `+${delta}` : `${delta}`) + ' %'
      : String(delta);
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

    // Point d’ancrage : seulement en Reflet du vice (1 fois / quartier)
    btnAnchor.disabled = (state.world !== 'reflet') || used;
    anchorInfo.textContent =
      state.world === 'reflet'
        ? `Ancrage : ${used ? 'Utilisé' : 'Disponible (+10 %)'}`
        : `Ancrage : Indisponible (Reflet uniquement)`;

    // Camp de fortune : 2 utilisations max par partie
    btnCamp.disabled = state.campLeft <= 0;
    campInfo.textContent = `Restants : ${state.campLeft} — ${
      state.world === 'reflet' ? '−15 % en Reflet' : '−10 % & Soin 2 PV'
    }`;

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
  function playSFXFile(src, vol=0.9){
    try {
      const a = new Audio(src);
      a.volume = vol;
      a.play().catch(()=>{});
    } catch(_){}
  }
  function playSFX(vol=0.9){ playSFXFile(pick(HAUNT.sfx), vol); }
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
    if (voiceSrc) { playSFXFile(voiceSrc, 0.9); }
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

  // Point d'Ancrage / Résurrection (+ Protection anti double-clic)
  let isReviveProcessing = false;
  btnAnchor.addEventListener('click', ()=>{
    if (state.world !== 'reflet' || gameOverShown || isReviveProcessing) return;
    const q = String(state.quartier);
    if (state.anchorUsed[q]) return;

    // Vérouillage anti-double-clic immédiat
    isReviveProcessing = true;
    state.anchorUsed[q] = true;
    btnAnchor.disabled = true;

    // Lecture de l'audio de résurrection (préparé pour audio/revive.mp4 ou .mp3)
    playSFXFile('audio/revive.mp4', 1.0);

    // Application de la pénalité d'instabilité
    state.value = clamp(state.value + 10);
    addHistory('+10 % (Ancrage)');
    microEffect(state.value);
    render();
    checkGameOver();
    maybeHaunt(true);

    // Affichage modale de rappel de perte de PV
    if (anchorModal) anchorModal.classList.add('show');

    // Déverrouillage après 500ms
    setTimeout(() => { isReviveProcessing = false; }, 500);
  });

  anchorConfirm?.addEventListener('click', ()=>{
    if (anchorModal) anchorModal.classList.remove('show');
  });

  // Camp de fortune
  btnCamp.addEventListener('click', ()=>{
    if (state.campLeft <= 0 || gameOverShown) return;

    const isNormal = (state.world === 'normal');
    const delta = isNormal ? -10 : -15;

    state.campLeft -= 1;
    state.value = clamp(state.value + delta);

    addHistory(delta);
    microEffect(state.value);
    render();
    checkGameOver();
    maybeHaunt(true);

    if (isNormal) {
      showAlert('Camp de fortune : -10 % Instabilité. Soignez 2 blessures à chaque joueur !', 'normal');
    } else {
      showAlert('Camp de fortune : -15 % Instabilité.', 'reflet');
    }
  });

  // ---------- Nouvelle partie ----------
  function newGame(){
    state.value = 0;
    state.campLeft = 2;
    state.anchorUsed = {"1":false,"2":false,"3":false,"4":false};
    history.length = 0;
    renderHistory();
    lastZone = 'normal';
    hideGameOver();
    if (anchorModal) anchorModal.classList.remove('show');
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
    ambientEl.src   = AMBIENT_TRACKS[ambientIdx % AMBIENT_TRACKS.length];
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
    maybeShowInstallBanner();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
