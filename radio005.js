(function(){
'use strict';
// RADIO-005 — Radio du Vice : spectacle interactif + montage multipiste en direct.
window.RdVRadio05=function createRadio05(api){
  const $=id=>document.getElementById('radio05'+id);
  const ui={};
  for(const k of ['Overlay','Status','Marquee','Winner','WinnerName','Spinner',
    'Speaker','Countdown','Count','Choices','Accept','Refuse','Outcome',
    'Next','Retry','Sound','Led','Equalizer'])
    ui[k]=$(k);
  const ROOT='audio/events/radio/radio-005-';
  const FILES={
    opening:'jingle-ouverture',intro:'intro',pubj:'jingle-pub',pub:'publicite',
    fanfare:'fanfare-jeu',game:'jeu',draw:'tirage',winner:'gagnant',
    question:'choix',acceptj:'fanfare-cadeau',accept:'accepter',
    refuse:'refuser',publicIntro:'public-presentation',applause:'public-applaudissements',
    knocks:'public-coups',reaction:'public-reaction',
    prisoner1:'sequestre-1',prisoner2:'sequestre-2',anger:'colere',
    impact:'objet-micro',returnj:'jingle-retour',outro:'conclusion',
    endj:'jingle-fin'
  };
  const SFX=new Set(['opening','pubj','fanfare','draw','acceptj','applause',
    'knocks','impact','returnj','endj']);
  const DECISION_MS=15000;
  const ANGER_FALLBACK_LEAD_SEC=.38; // Raccord du coup de micro sur la dernière syllabe.
  let current=null, serial=0, analyzed=new Map(), audioContext=null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const show=(el,yes)=>el.classList.toggle('hidden',!yes);
  const delay=(r,fn,ms)=>{
    const id=setTimeout(()=>{r.timers.delete(id);if(current===r)fn();},ms);
    r.timers.add(id);return id;
  };
  function save(){
    const r=current;if(!r||r.preview)return;
    api.session.pendingRadio005={
      id:'radio-005',phase:r.phase,winner:r.winner,choice:r.choice,
      applied:r.applied,before:r.before,after:r.after,over:r.over
    };
    api.save();
  }
  function silence(a){
    if(!a)return;
    try{a.pause();a.onended=null;a.onerror=null;a.ontimeupdate=null;}catch(_){}
  }
  function stopAudio(){
    const r=current;if(!r)return;
    for(const a of Object.values(r.media))silence(a);
    r.main=null;
    for(const id of r.timers)clearTimeout(id);r.timers.clear();
    clearInterval(r.tick);r.tick=null;
    clearInterval(r.spin);r.spin=null;
  }
  function close(){
    const r=current;if(!r)return;
    stopAudio();
    current=null;
    ui.Overlay.classList.remove('show','is-dark');
    ui.Overlay.setAttribute('aria-hidden','true');
    api.markActive(false);api.onClose();api.syncAmbient();api.renderControls();
  }
  function view(phase,caption){
    const r=current;if(!r)return;
    r.phase=phase;
    ui.Overlay.dataset.phase=phase;
    ui.Status.textContent=caption||'Vous êtes en direct sur Radio du Vice !';
    show(ui.Choices,phase==='decision');
    show(ui.Countdown,phase==='decision');
    show(ui.Winner,!!r.winner&&['draw','winner','question','decision',
      'acceptj','accept','refuse'].includes(phase));
    show(ui.Outcome,phase==='result');
    show(ui.Next,phase==='result');
    show(ui.Retry,false);
    ui.Overlay.classList.toggle('is-dark',['crowd','anger','impact','pause'].includes(phase));
    save();
  }
  // Optionnel : mesure la fin audible des SFX, pas les pauses comiques des dialogues.
  // Une piste de 2,5 s contenant 1 s de silence final n'impose plus 1 s d'attente.
  async function analyzeSfx(key){
    if(analyzed.has(key)||typeof fetch!=='function')return;
    analyzed.set(key,null);
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      if(!audioContext)audioContext=new AC();
      const response=await fetch(ROOT+FILES[key]+'.mp3');
      if(!response.ok)return;
      const buffer=await audioContext.decodeAudioData(await response.arrayBuffer());
      const total=buffer.duration;
      if(total<.5)return;
      const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
      const step=Math.max(1,Math.round(buffer.sampleRate*.015));
      const frameCount=Math.ceil(channels[0].length/step);
      const energy=new Float32Array(frameCount);
      let peak=0;
      for(let i=0;i<frameCount;i++){
        let amp=0;const at=i*step,end=Math.min(at+step,channels[0].length);
        for(let c=0;c<channels.length;c++){
          const data=channels[c];let sum=0;
          for(let n=at;n<end;n+=4)sum+=data[n]*data[n];
          amp=Math.max(amp,Math.sqrt(sum/Math.max(1,(end-at)/4)));
        }
        energy[i]=amp;peak=Math.max(peak,amp);
      }
      if(peak<.0002)return;
      const threshold=Math.max(.00045,peak*.025);
      let endFrame=frameCount-1;
      while(endFrame>0&&energy[endFrame]<threshold)endFrame--;
      // Le tronquage cible uniquement une queue silencieuse effective.
      const audible=clamp((endFrame+1)*step/buffer.sampleRate+.12,.7,total);
      if(total-audible>.22)analyzed.set(key,audible);
    }catch(_){/* Pas d'échec de lecture si WebAudio est indisponible. */}
  }
  function prepareSfx(){
    Object.keys(FILES).filter(k=>SFX.has(k)||k==='anger')
      .forEach(k=>{analyzeSfx(k);});
  }
  function audio(key){
    const r=current;if(!r)return null;
    const a=r.media[key];
    if(!a)return null;
    a.loop=false;
    return a;
  }
  function play(key,done,opts={}){
    const r=current;if(!r||r.hidden)return;
    if(r.main)silence(r.main);
    const a=audio(key);r.main=a;
    if(!a){soundFallback(done,'Fichier audio indisponible.');return;}
    const token=++r.playSerial;
    r.fallback=done;
    ui.Sound.textContent='◉ EN DIRECT';
    show(ui.Retry,false);
    a.onended=()=>{if(current!==r||token!==r.playSerial)return;
      silence(a);r.main=null;done?.();};
    a.onerror=()=>{if(current===r&&token===r.playSerial)
      soundFallback(done,'Audio indisponible.');};
    const audible=analyzed.get(key);
    // Pour la colère, faire tomber le micro à la fin audible de « bande de… » :
    // les secondes de silence exportées par ElevenLabs ne retardent plus l'impact.
    // Repli : avance très légère si l'analyse audio n'est pas disponible.
    const endAt=Number.isFinite(audible)?audible
      :key==='anger'&&Number.isFinite(a.duration)&&a.duration>1
        ?a.duration-ANGER_FALLBACK_LEAD_SEC:null;
    if((SFX.has(key)||key==='anger')&&Number.isFinite(endAt)){
      a.ontimeupdate=()=>{
        if(current===r&&token===r.playSerial&&a.currentTime>=endAt){
          silence(a);r.main=null;done?.();
        }
      };
    }
    a.volume=opts.volume??(SFX.has(key)?.82:.96);
    try{
      a.currentTime=0;
      a.play()?.catch?.(()=>{if(current===r&&token===r.playSerial)
        soundFallback(done,'Activez le son pour écouter la transmission.');});
    }catch(_){soundFallback(done,'Activez le son pour écouter la transmission.');}
  }
  function soundFallback(done,label){
    const r=current;if(!r)return;
    ui.Status.textContent=label;
    ui.Sound.textContent='SON EN ATTENTE';
    r.fallback=done;
    ui.Retry.textContent='ACTIVER LE SON / CONTINUER';
    show(ui.Retry,true);
  }
  function retry(){
    const r=current;if(!r||r.hidden)return;
    show(ui.Retry,false);
    if(r.phase==='crowd')return crowd();
    if(r.main){
      const a=r.main;
      try{a.play()?.catch?.(()=>{
        if(current===r){silence(a);r.main=null;r.fallback?.();}
      });}catch(_){silence(a);r.main=null;r.fallback?.();}
    }else r.fallback?.();
  }
  const row=(phase,key,next,caption,opts)=>{
    view(phase,caption);play(key,next,opts||{});
  };
  function opening(){row('opening','opening',intro,'Un générique joyeux surgit des parasites…');}
  function intro(){row('intro','intro',pubJingle,'BIENVENUE SUR RADIO DU VICE !');}
  function pubJingle(){row('pubj','pubj',publicite,'Notre partenaire commercial prend l’antenne…');}
  function publicite(){row('pub','pub',gameFanfare,'Les pompes funèbres Après Vous !');}
  function gameFanfare(){row('fanfare','fanfare',game,'LE CADEAU OU LE CAVEAU !');}
  function game(){row('game','game',draw,'Le grand jeu du jour commence !');}
  function draw(){
    const r=current;if(!r)return;
    if(!r.winner){const alive=api.living();if(!alive.length)return finish();
      r.winner=alive[Math.floor(Math.random()*alive.length)];}
    view('draw','ET NOTRE GRAND GAGNANT EST…');
    show(ui.Winner,true);
    ui.WinnerName.textContent='???';
    ui.Spinner.textContent='TIRAGE EN COURS';
    ui.Winner.classList.remove('is-revealed');
    const alive=api.living();
    const started=Date.now();
    r.spin=setInterval(()=>{
      if(current!==r)return;
      const n=alive[Math.floor(Math.random()*alive.length)];
      ui.WinnerName.textContent=n?api.playerName(n):'???';
    },90);
    play('draw',()=>{}, {volume:.76});
    // Le roulement accompagne le tirage, même si son MP3 contient du silence.
    delay(r,()=>{silence(r.main);r.main=null;
      clearInterval(r.spin);r.spin=null;
      ui.WinnerName.textContent=api.playerName(r.winner);
      ui.Spinner.textContent='CANDIDAT SÉLECTIONNÉ';
      ui.Winner.classList.add('is-revealed');
      delay(r,winner,550);
    },Math.max(3000,Math.min(4200,Date.now()-started+3400)));
  }
  function winner(){row('winner','winner',question,'ET LE GAGNANT EST… VOUS !');}
  function question(){row('question','question',decision,'LE CADEAU… OU LE CAVEAU ?');}
  function decision(){
    const r=current;if(!r)return;
    view('decision','ACCEPTEZ-VOUS LE CADEAU MYSTÈRE ?');
    r.deadline=Date.now()+DECISION_MS;
    ui.Accept.disabled=false;ui.Refuse.disabled=false;
    function tick(){
      if(current!==r||r.phase!=='decision')return;
      const left=Math.max(0,r.deadline-Date.now());
      ui.Count.textContent='00:'+String(Math.ceil(left/1000)).padStart(2,'0');
      if(left<=0)answer('refuse',true);
    }
    r.tick=setInterval(tick,100);tick();
  }
  function answer(choice,timedOut=false){
    const r=current;
    if(!r||r.phase!=='decision'||r.choice)return;
    r.choice=choice;
    clearInterval(r.tick);r.tick=null;
    ui.Accept.disabled=true;ui.Refuse.disabled=true;
    r.before=api.value();
    r.after=clamp(r.before+(choice==='accept'?5:-5),0,100);
    r.over=r.after>=100;
    view('reaction',timedOut?'Temps écoulé : cadeau refusé !'
      :choice==='accept'?'NOTRE CANDIDAT ACCEPTE !':'NOTRE CANDIDAT REFUSE !');
    // Le verdict est narré AVANT d'appliquer la conséquence.
    if(choice==='accept')row('acceptj','acceptj',()=>{
      row('accept','accept',applyOutcome,'Le cadeau mystère va être révélé…');
    },'QUELLE FORMIDABLE DÉCISION !');
    else row('refuse','refuse',applyOutcome,'NOTRE CANDIDAT REFUSE LE CADEAU !');
  }
  function applyOutcome(){
    const r=current;if(!r)return;
    if(!r.applied){
      const expected=Number.isFinite(r.after)?r.after:api.value();
      // Reprise F5 : reconnaître une conséquence déjà inscrite dans la jauge.
      if(api.value()!==expected){
        api.applyDelta(r.choice==='accept'?5:-5,'Radio du Vice — Le cadeau ou le caveau');
      }
      r.after=api.value();r.over=r.after>=100;r.applied=true;save();
    }
    crowdPresentation();
  }
  function crowdPresentation(){
    row('publicIntro','publicIntro',crowd,
      'UN TONNERRE D’APPLAUDISSEMENTS POUR NOTRE CANDIDAT !');
  }
  function crowd(){
    const r=current;if(!r)return;
    stopAudio();
    view('crowd','QUEL PUBLIC FORMIDABLE !');
    ui.Sound.textContent='◉ DIRECT — STUDIO';
    // Le mixage est réalisé dans Companion, sans fichier « public.mp3 ».
    // Chaque piste possède son volume et son point d'entrée.
    const stems=[];
    const playStem=(key,at,volume,handler)=>{
      delay(r,()=>{
        if(current!==r||r.phase!=='crowd'||r.hidden)return;
        const a=r.media[key];if(!a)return;
        a.volume=volume;
        a.currentTime=0;
        a.onended=null;
        stems.push(a);
        try{a.play()?.catch?.(()=>{});}catch(_){}
        handler?.(a);
      },at);
    };
    const start=Date.now();
    playStem('applause',0,.72);
    playStem('reaction',1700,.86,a=>{
      a.onended=()=>{if(current===r&&r.phase==='crowd')r.reactionFinished=true;};
    });
    // Les coups continuent derrière les cris et la voix jusqu'à la colère.
    playStem('knocks',2500,.20,a=>{a.loop=true;});
    playStem('prisoner1',5700,.35);
    playStem('prisoner2',7600,.35);
    r.reactionFinished=false;
    // Crossfade progressif : des applaudissements aux coups de porte.
    r.tick=setInterval(()=>{
      if(current!==r||r.phase!=='crowd')return;
      const sec=(Date.now()-start)/1000;
      const applause=r.media.applause,knocks=r.media.knocks;
      if(applause&&!applause.paused)applause.volume=clamp(.75-.16*Math.max(0,sec-2),.03,.75);
      if(knocks&&!knocks.paused)knocks.volume=clamp(.18+.085*Math.max(0,sec-2.5),.18,.82);
      if(sec>=11.3&&(r.reactionFinished||sec>=16.5)){
        clearInterval(r.tick);r.tick=null;
        for(const a of stems)silence(a);
        anger();return;
      }
    },100);
    // Secours navigateur suspendu : ne pas rester bloqué sur le studio.
    delay(r,()=>{
      if(r.phase==='crowd'){for(const a of stems)silence(a);anger();}
    },19000);
  }
  function anger(){row('anger','anger',impact,'LE DIRECT DÉRAPE…');}
  function impact(){row('impact','impact',pause,'UN CHOC VIOLENT COUPE LE MICRO…');}
  function pause(){
    const r=current;if(!r)return;
    view('pause','…');
    ui.Sound.textContent='SIGNAL COUPÉ';
    delay(r,returnJingle,1300);
  }
  function returnJingle(){row('returnj','returnj',outro,'RETOUR À L’ANTENNE !');}
  function outro(){row('outro','outro',endJingle,'UN GRAND MERCI À NOS AUDITEURS !');}
  function endJingle(){row('endj','endj',finish,'À TRÈÈÈS BIENTÔÔÔT !');}
  function finish(){
    const r=current;if(!r)return;
    stopAudio();
    view('result',r.choice==='accept'?'LE CADEAU A ÉTÉ LIVRÉ !':'L’OFFRE A ÉTÉ REFUSÉE !');
    const actual=Number.isFinite(r.after)&&Number.isFinite(r.before)
      ?r.after-r.before:0;
    const summary='Instabilité globale : '+(actual>0?'+':'')+actual
      +' point(s).\n'+r.before+' % → '+r.after+' %.';
    ui.Outcome.textContent=r.choice==='accept'
      ?'🎁 CADEAU ACCEPTÉ !\n'+summary
      :r.choice==='refuse'
        ?'🎁 CADEAU REFUSÉ !\n'+summary
        :'Le direct est terminé.';
    ui.Sound.textContent='FIN DE TRANSMISSION';
  }
  function complete(){
    const r=current;if(!r||r.phase!=='result')return;
    const delayNext=r.preview?r.previewDelay:api.nextDelay();
    const transition=Number.isFinite(r.before)&&Number.isFinite(r.after)&&r.before!==r.after
      ?[r.before,r.after]:null;
    const over=r.over;
    close();
    if(!r.preview)api.session.pendingRadio005=null;
    api.session.remainingMs=delayNext;api.save();api.renderControls();api.updateClock();
    if(over||transition)setTimeout(()=>{
      if(over)api.gameOver();
      else if(transition&&api.value()===transition[1])
        api.threshold(transition[0],transition[1]);
    },api.reducedMotion?0:650);
  }
  function begin(item,preview=false,restoring=false){
    if(current||!item||item.id!=='radio-005')return false;
    const pending=restoring?api.session.pendingRadio005:null;
    if(restoring&&!pending)return false;
    api.pauseClock();
    const r={token:++serial,preview,phase:'opening',winner:pending?.winner??null,
      choice:pending?.choice??null,applied:pending?.applied===true,
      before:pending?.before??null,after:pending?.after??null,over:pending?.over===true,
      media:{},main:null,playSerial:0,fallback:null,timers:new Set(),
      tick:null,spin:null,hidden:false,deadline:null,
      previewDelay:api.session.remainingMs,reactionFinished:false};
    for(const [key,suffix]of Object.entries(FILES)){
      const a=new Audio(ROOT+suffix+'.mp3');a.preload='auto';r.media[key]=a;
    }
    current=r;api.onOpen(r);
    if(!preview&&!restoring){api.session.played.push(item.id);api.session.remainingMs=null;}
    ui.Overlay.classList.add('show');
    ui.Overlay.setAttribute('aria-hidden','false');
    api.markActive(true);api.silenceHaunts();api.syncAmbient();api.renderControls();
    // Nouvelle demande de maintien de l'écran, notamment lors du lancement tactile.
    api.keepAwake?.();
    prepareSfx();
    if(restoring){
      if(pending.phase==='result'){finish();}
      else if(pending.applied||(['crowd','anger','impact','pause','returnj',
        'outro','endj'].includes(pending.phase)&&api.value()===pending.after)){
        r.applied=true;crowdPresentation();
      }else if(pending.choice){
        // Le choix ne peut plus être modifié après F5, mais son annonce
        // doit rester audible et le gain ne doit jamais être compté deux fois.
        if(pending.choice==='accept')row('acceptj','acceptj',()=>{
          row('accept','accept',applyOutcome,'Le cadeau mystère est révélé…');
        },'LE CADEAU A ÉTÉ ACCEPTÉ !');
        else row('refuse','refuse',applyOutcome,'LE CADEAU A ÉTÉ REFUSÉ !');
      }else if(pending.phase==='decision')decision();
      else if(['draw','winner','question'].includes(pending.phase))draw();
      else opening();
    }else opening();
    save();return true;
  }
  function visibility(forceHide=false){
    const r=current;if(!r)return;
    const hidden=forceHide||document.visibilityState==='hidden';
    if(hidden){
      r.hidden=true;stopAudio();
      if(r.phase==='decision')r.deadline=Date.now()+DECISION_MS;
      save();
    }else if(r.hidden){
      r.hidden=false;
      api.keepAwake?.();
      // Ne pas reprendre un chrono depuis l'arrière-plan.
      if(r.phase==='decision')decision();
      else if(r.phase==='result')finish();
      else if(r.applied||r.choice)crowdPresentation();
      else if(['draw','winner','question'].includes(r.phase))draw();
      else opening();
    }
  }
  ui.Accept.addEventListener('click',()=>answer('accept'));
  ui.Refuse.addEventListener('click',()=>answer('refuse'));
  ui.Next.addEventListener('click',complete);
  ui.Retry.addEventListener('click',retry);
  return{begin,stop:close,visibility,pageHide:()=>visibility(true),
    active:()=>Boolean(current)};
};
})();
