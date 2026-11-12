(function () {
'use strict';
// RADIO-004 — La Fréquence interdite. Module isolé de la logique du reste du jeu.
window.RdVRadio04 = function createRadio04(api) {
  const $ = id => document.getElementById(id);
  const ui = {};
  for (const id of [
    'Overlay','Display','Rx','Status','Tuning','Prev','Next',
    'ReadyPanel','ReadyClock','ReadyProgress','ChallengePanel','ChallengeClock',
    'Cursor','Zone','QualityText','QualityTrack','QualityBar','Touch',
    'Instruction','Result','Main','Replay'
  ]) ui[id] = $('radio04'+id);
  const FREQUENCIES=['88.4','94.7','107.3'];
  const AUDIO={
    intro:'intro',a:'884-annonce',b:'947-consigne',interruption:'947-interruption',
    whisper:'1073-murmure',alert:'alerte',
    win0:'884-reussite',win1:'947-reussite',win2:'1073-reussite_FAIREPAUSE',
    failure:'echec',static:'parasites',rail:'ambiance-ferroviaire',
    breath:'respiration',tune:'changement-frequence',
    glitch:'glitch-ecran',interference:'interferences',
    good:'signal-reussi',bad:'signal-perdu'
  };
  const VOLUME={
    intro:.95,a:.91,b:.91,interruption:.9,whisper:.93,alert:.93,
    win0:.96,win1:.96,win2:.96,failure:.96,
    static:.12,rail:.21,breath:.70,tune:.64,glitch:.42,
    interference:.3,good:.77,bad:.77
  };
  const READY_MS=15000, GAME_SECONDS=20, POST_GAME_LOCK_MS=2200;
  const RADIO04_ZONE_HALF_WIDTH=11;
  const RADIO04_QUALITY_GAIN=6.5, RADIO04_QUALITY_LOSS=3.5;
  const RADIO04_FINAL_SPRINT_AT=10, RADIO04_FINAL_SPEED_MULTIPLIER=1.4;
  let current=null, sequence=0;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const hidden=(el,isHidden)=>el.classList.toggle('hidden',Boolean(isHidden));

  function pauseAudio(audio) {
    if(!audio)return;
    try {audio.pause();audio.onended=null;audio.onerror=null;}catch(_){}
  }
  function save(){
    const r=current;
    if(!r||r.preview)return;
    api.session.pendingRadio004={
      id:'radio-004',stage:r.stage,index:r.index,
      scanElapsed:r.scanOrigin?Math.max(0,Date.now()-r.scanOrigin):0,
      outcome:r.outcome,before:r.before,after:r.after,gameOver:r.gameOver
    };
    api.save();
  }
  function playSfx(key) {
    const r=current;if(!r||r.hidden||document.visibilityState!=='visible')return;
    pauseAudio(r.sfx);
    const a=r.media[key];r.sfx=a;
    if(!a)return;
    try {a.currentTime=0;const p=a.play();p?.catch?.(()=>{});}catch(_){}
  }
  function stopClip(){
    const r=current;if(!r)return;
    ++r.clipSerial;
    pauseAudio(r.clip);
    r.clip=null;r.clipKey=null;r.clipDone=null;r.clipFailed=false;
    clearTimeout(r.delayedClip);r.delayedClip=null;
  }
  function stopScan(){
    const r=current;if(!r)return;
    clearInterval(r.scanTick);r.scanTick=null;
    pauseAudio(r.voice);r.voice=null;r.scanKey=null;
    for(const k of ['static','rail','breath'])pauseAudio(r.media[k]);
  }
  function stopTiming(){
    const r=current;if(!r)return;
    clearInterval(r.readyTick);r.readyTick=null;
    clearInterval(r.countdownTick);r.countdownTick=null;
    cancelAnimationFrame(r.gameFrame);r.gameFrame=null;
    r.pressed=false;r.pointer=null;
    ui.Touch.classList.remove('is-pressed');
    pauseAudio(r.media.interference);
  }
  function clear(){
    const r=current;if(!r)return;
    stopClip();stopScan();stopTiming();
    clearTimeout(r.glitch);clearTimeout(r.unlockTimer);pauseAudio(r.sfx);
    for(const a of Object.values(r.media))pauseAudio(a);
    current=null;
    ui.Main.disabled=false;
    ui.Overlay.className='radio04-overlay';
    ui.Overlay.setAttribute('aria-hidden','true');
    api.markActive(false);
    api.onClose();
    api.syncAmbient();
    api.renderControls();
  }
  function stage(next){
    const r=current;if(!r)return;
    r.stage=next;
    ui.Overlay.className='radio04-overlay show is-'+next+
      (r.outcome==='failure'&&next==='result'?' is-failed':'');
    hidden(ui.Tuning,next!=='scan');
    hidden(ui.ReadyPanel,next!=='ready');
    hidden(ui.ChallengePanel,next!=='challenge');
    hidden(ui.Touch,next!=='challenge');
    hidden(ui.Instruction,next!=='challenge');
    hidden(ui.Result,next!=='result');
    hidden(ui.Main,['intro','alert','resultvoice','challenge','countdown'].includes(next));
    hidden(ui.Replay,true);
    ui.Display.textContent=next==='intro'?'---.-':FREQUENCIES[r.index];
    ui.Rx.textContent=next==='intro'?'RX: RECHERCHE'
      :next==='scan'?'RX: SIGNAL INTERCEPTÉ'
      :next==='result'?'RX: TRANSMISSION TERMINÉE'
      :'RX: FRÉQUENCE VERROUILLÉE';
    save();
  }
  function playClip(key,done){
    const r=current;if(!r)return;
    const previous=r.clipKey;
    stopClip();
    r.clipAttempts=previous===key?(r.clipAttempts||0)+1:1;
    const token=r.clipSerial;
    const a=r.media[key];
    r.clip=a;r.clipKey=key;r.clipDone=done;
    if(!a){
      r.clipFailed=true;
      ui.Status.textContent='Audio indisponible. Vous pouvez continuer.';
      ui.Replay.textContent='CONTINUER SANS AUDIO';hidden(ui.Replay,false);
      return;
    }
    a.loop=false;
    a.onended=()=>{
      if(current!==r||r.clipSerial!==token)return;
      stopClip();done?.();
    };
    a.onerror=()=>{
      if(current!==r||r.clipSerial!==token)return;
      r.clipFailed=true;
      ui.Status.textContent='Audio indisponible. Vous pouvez continuer.';
      ui.Replay.textContent='CONTINUER SANS AUDIO';hidden(ui.Replay,false);
    };
    try{
      a.currentTime=0;
      const p=a.play();
      p?.then?.(()=>{
        if(current===r&&r.clipSerial===token)hidden(ui.Replay,true);
      })?.catch?.(()=>{
        if(current!==r||r.clipSerial!==token)return;
        r.clipFailed=r.clipAttempts>=2;
        ui.Replay.textContent=r.clipFailed?'CONTINUER SANS AUDIO':'ACTIVER LE SON';
        hidden(ui.Replay,false);
      });
    }catch(_){
      r.clipFailed=r.clipAttempts>=2;
      ui.Replay.textContent=r.clipFailed?'CONTINUER SANS AUDIO':'ACTIVER LE SON';
      hidden(ui.Replay,false);
    }
  }
  function intro(){
    stage('intro');
    ui.Status.textContent='Une conversation surgit des parasites…';
    playClip('intro',enterScan);
  }
  function enterScan(){
    const r=current;if(!r)return;
    stopClip();
    r.scanOrigin=Date.now()-(r.restoreElapsed||0);
    r.restoreElapsed=0;r.confirm=false;r.scanBlocked=false;
    stage('scan');
    ui.Main.textContent='VERROUILLER CETTE FRÉQUENCE';
    ui.Status.textContent='Explorez les fréquences. Les transmissions ne vous attendent pas.';
    startScan();
    save();
  }
  function duration(key,fallback){
    const a=current?.media[key];
    return Number.isFinite(a?.duration)&&a.duration>.1?a.duration:fallback;
  }
  function background(){
    const r=current;if(!r||r.hidden)return;
    for(const [key,enabled]of [
      ['static',true],['rail',r.index===0],['breath',r.index===2]
    ]){
      const a=r.media[key];if(!a)continue;
      if(!enabled){if(!a.paused)a.pause();continue;}
      if(a.paused){
        a.loop=true;
        try{a.play()?.catch?.(()=>{});}catch(_){}
      }
    }
  }
  // Les trois pistes sont virtuelles : l'horloge avance même quand on n'écoute pas.
  // Seule la piste sélectionnée est véritablement jouée par le navigateur.
  function syncScan(force=false){
    const r=current;if(!r||r.stage!=='scan'||r.hidden)return;
    background();
    const sec=Math.max(0,(Date.now()-r.scanOrigin)/1000);
    const offset=[0,15,30][r.index];
    let key=null,seek=0;
    if(r.index===0){
      const d=duration('a',25);
      // Intervalle de parasites pour un raccord propre et un début intelligible.
      const lead=.65,tail=1.55,t=(sec+offset)%(lead+d+tail);
      if(t>=lead&&t<lead+d){
        key='a';
        seek=t-lead<.4?0:t-lead;
      }
    }else if(r.index===1){
      const d1=duration('b',25),d2=duration('interruption',3);
      const t=(sec+offset)%(d1+d2+2);
      if(t<d1){key='b';seek=t;}
      else if(t<d1+d2){key='interruption';seek=t-d1;}
    }else{
      const d=duration('whisper',3);
      // Murmure rapproché, puis respiration avant la répétition.
      const arrival=4.5,cycle=Math.max(13,arrival+d+3.5);
      const t=(sec+offset)%cycle;
      if(t>=arrival&&t<arrival+d){key='whisper';seek=t-arrival;}
    }
    if(!force&&key===r.scanKey)return;
    pauseAudio(r.voice);r.voice=null;r.scanKey=key;r.scanBlocked=false;
    if(!key)return;
    const a=r.media[key];if(!a)return;
    if(a.readyState<1){
      // Ne pas jouer une fréquence à 0 avant de connaître sa durée.
      r.scanKey=null;
      if(!r.metadataLoading.has(key)){
        r.metadataLoading.add(key);
        const selectedIndex=r.index;
        a.addEventListener('loadedmetadata',()=>{
          r.metadataLoading.delete(key);
          if(current===r&&r.stage==='scan'&&!r.hidden
            &&r.index===selectedIndex)syncScan(true);
        },{once:true});
        a.load();
      }
      return;
    }
    try{
      a.loop=false;
      a.currentTime=Math.min(seek,Math.max(0,a.duration-.08));
      r.voice=a;
      a.onended=()=>{if(current===r)r.scanKey=null;};
      const p=a.play();
      p?.then?.(()=>{
        if(current===r&&r.stage==='scan')hidden(ui.Replay,true);
      })?.catch?.(()=>{
        if(current!==r||r.stage!=='scan')return;
        r.scanBlocked=true;
        ui.Replay.textContent='ACTIVER LE SON';
        hidden(ui.Replay,false);
      });
    }catch(_){
      r.scanBlocked=true;
      ui.Replay.textContent='ACTIVER LE SON';hidden(ui.Replay,false);
    }
  }
  function startScan(){
    stopScan();
    syncScan(true);
    if(current)current.scanTick=setInterval(()=>syncScan(),230);
  }
  function tune(direction){
    const r=current;if(!r||r.stage!=='scan')return;
    r.index=(r.index+direction+3)%3;r.confirm=false;
    ui.Main.textContent='VERROUILLER CETTE FRÉQUENCE';
    ui.Status.textContent='Écoutez attentivement…';
    ui.Display.textContent=FREQUENCIES[r.index];
    playSfx('tune');syncScan(true);save();
    clearTimeout(r.glitch);
    if(Math.random()<.38){
      ui.Overlay.classList.add('is-glitch');
      ui.Display.textContent='000.0';
      playSfx('glitch');
      r.glitch=setTimeout(()=>{
        if(current!==r||r.stage!=='scan')return;
        ui.Display.textContent=FREQUENCIES[r.index];
        ui.Overlay.classList.remove('is-glitch');
      },140);
    }
  }
  function lock(){
    const r=current;if(!r||r.stage!=='scan')return;
    if(!r.confirm){
      r.confirm=true;
      ui.Status.textContent='Choix définitif. Vous ne pourrez plus changer de fréquence.';
      ui.Main.textContent='CONFIRMER LE VERROUILLAGE';return;
    }
    stopScan();stage('alert');
    ui.Status.textContent='SIGNAL INCONTRÔLABLE';
    playClip('alert',enterReady);
  }
  function readyDraw(){
    const r=current;if(!r||r.stage!=='ready'||r.hidden)return;
    const ms=Math.max(0,r.readyDeadline-Date.now());
    r.readyRemaining=ms;
    ui.ReadyClock.textContent='00:'+String(Math.ceil(ms/1000)).padStart(2,'0');
    ui.ReadyProgress.style.width=(ms/READY_MS*100).toFixed(2)+'%';
    if(ms<=0)startCountdown();
  }
  function enterReady(){
    const r=current;if(!r)return;
    stopClip();stopTiming();
    stage('ready');
    ui.Status.textContent='STABILISATION MANUELLE REQUISE\nDésignez immédiatement un survivant pour maintenir le signal !';
    ui.Main.textContent='JE SUIS PRÊT — COMMENCER';
    r.readyRemaining=READY_MS;
    r.readyDeadline=Date.now()+READY_MS;
    if(!r.hidden){
      r.readyTick=setInterval(readyDraw,100);readyDraw();
    }
  }
  function startCountdown(){
    const r=current;if(!r||r.stage!=='ready')return;
    stopTiming();stage('countdown');
    ui.Status.textContent='LA STABILISATION VA COMMENCER';
    let left=3;
    ui.Rx.textContent='DÉPART DANS '+left+'…';
    r.countdownTick=setInterval(()=>{
      if(current!==r)return;
      left--;
      if(left<=0){clearInterval(r.countdownTick);r.countdownTick=null;startGame();}
      else ui.Rx.textContent='DÉPART DANS '+left+'…';
    },1000);
  }
  function drawGame(r){
    ui.ChallengeClock.textContent='00:'+String(Math.ceil(Math.max(0,GAME_SECONDS-r.elapsed))).padStart(2,'0');
    ui.Cursor.style.left=r.cursor.toFixed(3)+'%';
    ui.Zone.style.left=(r.zone-RADIO04_ZONE_HALF_WIDTH).toFixed(3)+'%';
    ui.Zone.style.width=(RADIO04_ZONE_HALF_WIDTH*2)+'%';
    const q=Math.floor(r.quality+1e-8);
    ui.QualityText.textContent=q+' %';
    ui.QualityBar.style.width=r.quality.toFixed(3)+'%';
    ui.QualityTrack.setAttribute('aria-valuenow',String(q));
  }
  function step(now){
    const r=current;if(!r||r.stage!=='challenge'||r.hidden)return;
    const dt=Math.min(.07,Math.max(0,(now-r.lastFrame)/1000));
    r.lastFrame=now;r.elapsed=Math.min(GAME_SECONDS,r.elapsed+dt);
    const progress=r.elapsed/GAME_SECONDS;
    // À 10 s, accélération nette de 40 % de la zone verte uniquement.
    // Phase continue : le mouvement accélère sans téléporter la zone.
    const zoneTime=r.elapsed<=RADIO04_FINAL_SPRINT_AT?r.elapsed
      :RADIO04_FINAL_SPRINT_AT+
        (r.elapsed-RADIO04_FINAL_SPRINT_AT)*RADIO04_FINAL_SPEED_MULTIPLIER;
    r.zone=50+(10+8*progress)*Math.sin(zoneTime*.83+.35)
      +(2+2*progress)*Math.sin(zoneTime*1.7);
    const interference=(Math.sin(r.elapsed*3.1)+.43*Math.sin(r.elapsed*9.3+.7))
      *(3+progress*10);
    r.cursor=clamp(r.cursor+((r.pressed?27:-27)+interference)*dt,1,99);
    const inside=Math.abs(r.cursor-r.zone)<=RADIO04_ZONE_HALF_WIDTH;
    r.quality=clamp(r.quality+(inside?RADIO04_QUALITY_GAIN:-RADIO04_QUALITY_LOSS)*dt,0,100);
    drawGame(r);
    if(r.quality>=99.999){
      r.quality=100;drawGame(r);resolve('success');return;
    }
    if(r.elapsed>=GAME_SECONDS){resolve('failure');return;}
    r.gameFrame=requestAnimationFrame(step);
  }

  function startGame(){
    const r=current;if(!r)return;
    stopTiming();stage('challenge');
    ui.Status.textContent='MAINTENEZ LA FRÉQUENCE !';
    r.cursor=50;r.zone=50+10*Math.sin(.35);r.quality=0;r.elapsed=0;r.pressed=false;r.pointer=null;
    r.lastFrame=performance.now();drawGame(r);
    const a=r.media.interference;a.loop=true;
    try{a.play()?.catch?.(()=>{});}catch(_){}
    r.gameFrame=requestAnimationFrame(step);
  }
  function touchDown(e){
    const r=current;
    if(!r||r.stage!=='challenge'||r.pointer!==null)return;
    e.preventDefault();r.pointer=e.pointerId;r.pressed=true;
    ui.Touch.classList.add('is-pressed');
    try{ui.Touch.setPointerCapture(e.pointerId);}catch(_){}
  }
  function touchUp(e){
    const r=current;
    if(!r||r.stage!=='challenge'||r.pointer!==e.pointerId)return;
    r.pressed=false;r.pointer=null;ui.Touch.classList.remove('is-pressed');
  }
  function protectAfterChallenge(r){
    if(current!==r)return;
    clearTimeout(r.unlockTimer);
    const wait=Math.max(0,(r.lockUntil||0)-Date.now());
    ui.Main.disabled=wait>0;
    ui.Overlay.classList.toggle('is-input-locked',wait>0);
    if(wait>0){
      r.unlockTimer=setTimeout(()=>{
        if(current!==r)return;
        ui.Main.disabled=false;
        ui.Overlay.classList.remove('is-input-locked');
      },wait+10);
    }
  }

  function resolve(outcome){
    const r=current;if(!r||r.stage!=='challenge')return;
    stopTiming();
    r.outcome=outcome;r.before=api.value();
    const delta=outcome==='failure'?5:r.index===0?5:r.index===1?-10:10;
    r.after=clamp(r.before+delta,0,100);
    r.gameOver=r.after>=100;
    stage('resultvoice'); // Sauvegarde préventive : ne jamais appliquer deux fois.
    // Neutraliser les gestes encore en cours après une séquence tactile intense.
    r.lockUntil=Date.now()+POST_GAME_LOCK_MS;
    protectAfterChallenge(r);
    if(r.before!==r.after){
      const effect=api.applyDelta(delta,
        'Radio — La Fréquence interdite ('+FREQUENCIES[r.index]+' MHz)');
      r.after=api.value();r.gameOver=effect.gameOver;
      save();
    }
    ui.Status.textContent=outcome==='success'?'SIGNAL STABILISÉ':'TRANSMISSION PERDUE';
    playSfx(outcome==='success'?'good':'bad');
    const key=outcome==='failure'?'failure':'win'+r.index;
    r.delayedClip=setTimeout(()=>{
      if(current===r&&r.stage==='resultvoice')playClip(key,showResult);
    },650);
  }
  function showResult(){
    const r=current;if(!r)return;
    stopClip();stage('result');
    ui.Main.textContent='CONTINUER LA PARTIE';
    protectAfterChallenge(r);
    ui.Status.textContent=r.outcome==='success'?'TRANSMISSION TERMINÉE':'SIGNAL PERDU';
    const diff=r.after-r.before;
    const summary='Instabilité globale : '+r.before+' % → '+r.after+' % ('+
      (diff>0?'+':'')+diff+' points).';
    const text=r.outcome==='failure'
      ? 'ÉCHEC DE LA STABILISATION.\nAucune récompense.\n'+summary
      :r.index===0
        ? '88.4 MHz — SIGNAL STABILISÉ.\nLe groupe pioche 2 cartes Équipement et en conserve 1.\n'+summary
        :r.index===1
          ? '94.7 MHz — PROCÉDURE D’ANCRAGE.\nLe groupe défausse 1 carte Équipement.\n'+summary
          : '107.3 MHz — CONTACT ÉTABLI.\nChoisissez un survivant : soignez une de ses blessures.\n'+summary;
    ui.Result.textContent=text;
    hidden(ui.Result,false);hidden(ui.Main,false);
    ui.Main.focus();
  }
  function primary(){
    const r=current;
    if(!r||r.hidden||Date.now()<(r.lockUntil||0))return;
    if(r.stage==='scan')lock();
    else if(r.stage==='ready')startCountdown();
    else if(r.stage==='result')complete();
  }
  function replay(){
    const r=current;
    if(!r||r.hidden||Date.now()<(r.lockUntil||0))return;
    if(r.clipFailed){const done=r.clipDone;stopClip();done?.();return;}
    if(r.stage==='scan'){r.scanBlocked=false;syncScan(true);}
    else if(r.stage==='intro')playClip('intro',enterScan);
    else if(r.stage==='alert')playClip('alert',enterReady);
    else if(r.stage==='resultvoice')
      playClip(r.outcome==='failure'?'failure':'win'+r.index,showResult);
  }
  function complete(){
    const r=current;if(!r||r.stage!=='result')return;
    const next=r.preview?r.savedPreviewDelay:api.nextDelay();
    const over=r.gameOver;
    const transition=Number.isFinite(r.before)&&Number.isFinite(r.after)&&
      r.before!==r.after?[r.before,r.after]:null;
    clear();
    if(!r.preview)api.session.pendingRadio004=null;
    api.session.remainingMs=next;
    api.save();api.renderControls();api.updateClock();
    if(over||transition){
      setTimeout(()=>{
        if(over)api.gameOver();
        else if(transition&&api.value()===transition[1])
          api.threshold(transition[0],transition[1]);
      },api.reducedMotion?0:650);
    }
  }
  function begin(item,preview=false,restoring=false){
    const pending=restoring?api.session.pendingRadio004:null;
    if(current||!item||item.id!=='radio-004'||(restoring&&!pending))return false;
    api.pauseClock();
    const media={};
    for(const [key,suffix]of Object.entries(AUDIO)){
      const a=new Audio('audio/events/radio/radio-004-'+suffix+'.mp3');
      a.preload='auto';a.volume=VOLUME[key]??1;
      media[key]=a;
      // Récupérer les durées et préparer les sauts avant la première sélection.
      if(['a','b','interruption','whisper'].includes(key)){
        try{a.load();}catch(_){}
      }
    }
    const r={
      id:++sequence,preview,stage:'intro',
      index:pending?.index??0,
      restoreElapsed:pending?.scanElapsed??0,scanOrigin:0,
      confirm:false,media,hidden:false,
      clip:null,clipSerial:0,clipKey:null,clipDone:null,delayedClip:null,
      clipFailed:false,clipAttempts:0,metadataLoading:new Set(),unlockTimer:null,lockUntil:0,
      scanTick:null,voice:null,scanKey:null,scanBlocked:false,glitch:null,sfx:null,
      readyTick:null,readyDeadline:0,readyRemaining:READY_MS,countdownTick:null,
      gameFrame:null,lastFrame:0,cursor:50,zone:50,quality:0,elapsed:0,pressed:false,pointer:null,
      outcome:pending?.outcome??null,before:pending?.before??null,
      after:pending?.after??null,gameOver:pending?.gameOver===true,
      savedPreviewDelay:api.session.remainingMs
    };
    current=r;api.onOpen(r);
    if(!preview&&!restoring){
      api.session.played.push(item.id);api.session.remainingMs=null;
    }
    ui.Overlay.classList.add('show');ui.Overlay.setAttribute('aria-hidden','false');
    api.markActive(true);api.silenceHaunts();api.syncAmbient();api.renderControls();
    if(restoring){
      if(['result','resultvoice'].includes(pending.stage)){
        if(Number.isFinite(r.before)&&Number.isFinite(r.after)&&
          r.before!==r.after&&api.value()===r.before){
          api.applyDelta(r.after-r.before,'Radio — La Fréquence interdite (reprise)');
        }
        showResult();
      }else if(pending.stage==='scan')enterScan();
      else if(['ready','countdown','challenge','alert'].includes(pending.stage))enterReady();
      else enterScan();
    }else intro();
    save();return true;
  }
  function visibility(forceHide=false){
    const r=current;if(!r)return;
    const isHidden=forceHide||document.visibilityState==='hidden';
    if(isHidden){
      r.hidden=true;stopScan();
      if(r.stage==='ready'){
        clearInterval(r.readyTick);r.readyTick=null;
        r.readyRemaining=Math.max(0,r.readyDeadline-Date.now());
      }else if(['challenge','countdown'].includes(r.stage)){
        stopTiming();r.readyRemaining=READY_MS;
        stage('ready');
        ui.Status.textContent='Épreuve interrompue. Préparez un survivant avant de reprendre.';
        ui.Main.textContent='JE SUIS PRÊT — COMMENCER';
      }
      if(r.clip&&!r.clip.paused)r.clip.pause();
      hidden(ui.Replay,true);
      save();
    }else{
      if(!r.hidden)return;
      r.hidden=false;
      if(r.stage==='ready'){
        r.readyDeadline=Date.now()+Math.max(1000,r.readyRemaining);
        r.readyTick=setInterval(readyDraw,100);readyDraw();
      }else if(r.stage==='scan'){
        startScan();
        ui.Replay.textContent='ACTIVER LE SON';hidden(ui.Replay,false);
      }else if(['intro','alert','resultvoice'].includes(r.stage)){
        ui.Replay.textContent='REPRENDRE LA TRANSMISSION';hidden(ui.Replay,false);
      }
    }
  }
  ui.Prev.addEventListener('click',()=>tune(-1));
  ui.Next.addEventListener('click',()=>tune(1));
  ui.Main.addEventListener('click',primary);
  ui.Replay.addEventListener('click',replay);
  ui.Touch.addEventListener('pointerdown',touchDown);
  for(const event of ['pointerup','pointercancel','lostpointercapture'])
    ui.Touch.addEventListener(event,touchUp);
  return {begin,stop:clear,visibility,pageHide:()=>visibility(true),
    active:()=>Boolean(current)};
};
})();