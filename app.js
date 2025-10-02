(function(){
  const PLUS = [1,2,3,5,10,20];
  const MINUS = [1,2,3,5,10,20];
  const LSK = (k)=>'jds_'+k;

  const bar = document.getElementById('bar');
  const percent = document.getElementById('percent');
  const rowPlus = document.getElementById('rowPlus');
  const rowMinus = document.getElementById('rowMinus');
  const resetBtn = document.getElementById('reset');
  const shareBtn = document.getElementById('share');
  const copyBtn = document.getElementById('copy');
  const audioBtn = document.getElementById('audioToggle');
  const ambient = document.getElementById('ambient');
  const groan = document.getElementById('groan');

  const worldRadios = document.querySelectorAll('input[name="world"]');
  const playersSel = document.getElementById('players');
  const quartierSel = document.getElementById('quartier');

  const btnAnchor = document.getElementById('btnAnchor');
  const btnCamp = document.getElementById('btnCamp');
  const anchorInfo = document.getElementById('anchorInfo');
  const campInfo = document.getElementById('campInfo');

  const hauntEnable = document.getElementById('hauntEnable');
  const hauntIntensity = document.getElementById('hauntIntensity');
  const hauntTest = document.getElementById('hauntTest');
  const fxFlash = document.getElementById('fxFlash');
  const fxBlack = document.getElementById('fxBlack');

  let state = {
    value: parseInt(localStorage.getItem(LSK('instability'))||'0',10),
    world: localStorage.getItem(LSK('world')) || 'normal', // 'normal' or 'reflet'
    players: parseInt(localStorage.getItem(LSK('players'))||'3',10),
    quartier: parseInt(localStorage.getItem(LSK('quartier'))||'1',10),
    anchorUsed: JSON.parse(localStorage.getItem(LSK('anchorUsed'))||'{"1":false,"2":false,"3":false,"4":false}'),
    campLeft: parseInt(localStorage.getItem(LSK('campLeft'))||'3',10),
    hauntOn: localStorage.getItem(LSK('hauntOn')) === '1',
    hauntLevel: localStorage.getItem(LSK('hauntLevel')) || 'med'
  };

  function save(){
    localStorage.setItem(LSK('instability'), String(state.value));
    localStorage.setItem(LSK('world'), state.world);
    localStorage.setItem(LSK('players'), String(state.players));
    localStorage.setItem(LSK('quartier'), String(state.quartier));
    localStorage.setItem(LSK('anchorUsed'), JSON.stringify(state.anchorUsed));
    localStorage.setItem(LSK('campLeft'), String(state.campLeft));
    localStorage.setItem(LSK('hauntOn'), state.hauntOn?'1':'0');
    localStorage.setItem(LSK('hauntLevel'), state.hauntLevel);
  }

  function clamp(v){ return Math.max(0, Math.min(100, v)); }
  function render(){
    bar.style.width = state.value + '%';
    percent.textContent = state.value + ' %';
    document.title = 'Instabilité ' + state.value + ' %';

    // World radio
    worldRadios.forEach(r => r.checked = (r.value === state.world));
    playersSel.value = String(state.players);
    quartierSel.value = String(state.quartier);

    // Special buttons availability
    btnAnchor.disabled = !(state.world === 'reflet' && !state.anchorUsed[String(state.quartier)]);
    btnCamp.disabled = !(state.world === 'normal' && state.campLeft > 0);

    const remainingAnchors = Object.values(state.anchorUsed).filter(v=>!v).length;
    anchorInfo.textContent = 'Restant : ' + remainingAnchors + ' (1 par quartier)';

    campInfo.textContent = 'Utilisations restantes : ' + state.campLeft;

    hauntEnable.checked = state.hauntOn;
    hauntIntensity.value = state.hauntLevel;

    save();
  }

  function mkButtons(arr, sign){
    return arr.map(v=>{
      const b=document.createElement('button');
      b.textContent = (sign>0?'+':'-') + v;
      b.addEventListener('click', ()=>{ state.value = clamp(state.value + sign*v); render(); maybeHaunt(0.15); });
      return b;
    });
  }

  mkButtons(PLUS, +1).forEach(b=>rowPlus.appendChild(b));
  mkButtons(MINUS, -1).forEach(b=>rowMinus.appendChild(b));
  resetBtn.addEventListener('click', ()=>{ state.value = 0; render(); });
  shareBtn.addEventListener('click', async ()=>{
    const text = 'Instabilité: ' + state.value + ' %';
    if (navigator.share){ try{ await navigator.share({text}); }catch(e){} }
    else { try{ await navigator.clipboard.writeText(text); alert('Copié: ' + text); }catch(e){ alert(text); } }
  });
  copyBtn.addEventListener('click', async ()=>{
    const text = 'Instabilité: ' + state.value + ' %';
    try{ await navigator.clipboard.writeText(text); alert('Copié: ' + text); }catch(e){ alert(text); }
  });

  // World controls
  worldRadios.forEach(r=>r.addEventListener('change', e=>{
    if (r.checked){ state.world = r.value; render(); }
  }));
  playersSel.addEventListener('change', ()=>{ state.players = parseInt(playersSel.value,10)||3; render(); });
  quartierSel.addEventListener('change', ()=>{ state.quartier = parseInt(quartierSel.value,10)||1; render(); });

  // Anchor: -15% (reflet only, once per quartier)
  btnAnchor.addEventListener('click', ()=>{
    if (!(state.world==='reflet')) return;
    const q = String(state.quartier);
    if (state.anchorUsed[q]) return;
    state.value = clamp(state.value - 15);
    state.anchorUsed[q] = true;
    render();
    maybeHaunt(0.5); // more likely when using anchor
  });

  // Camp de fortune: -30% (normal only, majority vote)
  btnCamp.addEventListener('click', ()=>{
    if (!(state.world==='normal') || state.campLeft<=0) return;
    const total = state.players;
    const needed = Math.floor(total/2)+1;
    const resp = prompt('Vote "Oui" (0–'+total+'). Majorité requise: '+needed+' voix.');
    const yes = Math.max(0, Math.min(total, parseInt(resp||'0',10)));
    if (yes >= needed){
      state.value = clamp(state.value - 30);
      state.campLeft -= 1;
      alert('Vote adopté. Instabilité −30 %. Il reste '+state.campLeft+' Camp(s) de fortune.');
      render();
    } else {
      alert('Vote rejeté. Aucune réduction appliquée.');
    }
  });

  // Audio ambiance
  let audioOn = false;
  audioBtn.addEventListener('click', async ()=>{
    try{
      if (!audioOn){
        ambient.volume = 0.35;
        await ambient.play();
        audioOn = true;
        audioBtn.textContent = 'Couper l’ambiance';
      } else {
        ambient.pause();
        audioOn = false;
        audioBtn.textContent = 'Activer l’ambiance';
      }
    }catch(e){
      alert('Impossible de jouer le son : interaction utilisateur requise ou blocage navigateur.');
    }
  });

  // Haunts
  hauntEnable.addEventListener('change', ()=>{ state.hauntOn = hauntEnable.checked; render(); });
  hauntIntensity.addEventListener('change', ()=>{ state.hauntLevel = hauntIntensity.value; render(); });
  hauntTest.addEventListener('click', ()=>{ triggerHaunt(); });

  function maybeHaunt(base){
    if (!state.hauntOn) return;
    let p = base || 0.1;
    if (state.hauntLevel==='low') p *= 0.5;
    if (state.hauntLevel==='high') p *= 2.0;
    if (Math.random() < p) triggerHaunt();
  }

  function triggerHaunt(){
    const r = Math.random();
    if (r < 0.5){ // flash
      fxFlash.style.opacity = '1';
      setTimeout(()=>{ fxFlash.style.opacity = '0'; }, 120);
      playGroan(0.4);
    } else { // blackout
      fxBlack.style.opacity = '1';
      playGroan(0.6);
      setTimeout(()=>{ fxBlack.style.opacity = '0'; }, 1800 + Math.random()*1200);
    }
  }
  function playGroan(vol){
    try{ groan.volume = vol; groan.currentTime = 0; groan.play(); }catch(e){}
  }

  // Interval haunts
  setInterval(()=>{ maybeHaunt(0.05); }, 30000);

  // Gate (passphrase)
  const GATE_KEY='playtest_gate_hash';
  const gate = document.getElementById('gate');
  const gateInput = document.getElementById('gateInput');
  const gateBtn = document.getElementById('gateBtn');
  const gateError = document.getElementById('gateError');
  const PASSPHRASE_HASH = 'sha256:2bbeda386f095c9cfe421ce02841bd948cd1405fb3cafa726947a8431a3d15ce';

  async function sha256Hex(s){
    const enc = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function ok(){
    gate.style.display='none';
    // Register SW after passing gate to avoid caching the gate
    if ('serviceWorker' in navigator){
      navigator.serviceWorker.register('./service-worker.js');
    }
  }
  async function check(){
    const stored = localStorage.getItem(GATE_KEY);
    if (stored === PASSPHRASE_HASH) { ok(); return; }
    gate.style.display='flex';
  }
  gateBtn.addEventListener('click', async ()=>{
    const h = await sha256Hex(gateInput.value);
    const target = PASSPHRASE_HASH.replace('sha256:','');
    if (h === target){
      localStorage.setItem(GATE_KEY, PASSPHRASE_HASH);
      ok();
    } else {
      gateError.textContent = 'Mot de passe incorrect.';
    }
  });

  render();
  check();
})();
