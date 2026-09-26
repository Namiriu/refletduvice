(function(){

  // =========================================================
  // CONFIG
  // =========================================================

  const STEPS = [5, 10, 15, 20];

  const LSK = (k) => 'jds_' + k;

  const VERSION = 'v0.7 Playtest';


  // =========================================================
  // AMBIANCE LONGUE
  // =========================================================

  const AMBIENT_TRACKS = [
    'audio/ambient_loop.mp3',
  ];


  // =========================================================
  // EFFETS HANTÉS
  // =========================================================

  const HAUNT = {

    perClickProb: 0.14,

    passiveEvery: [
      38000,
      68000
    ],

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


  // =========================================================
  // MASQUES
  // =========================================================

  /*
    Pour l'instant seul masque0.png existe.

    Plus tard, lorsqu'on aura les autres états, il suffira
    d'ajouter ici :

    { min: 25,  src: 'img/masque25.png'  },
    { min: 50,  src: 'img/masque50.png'  },
    { min: 75,  src: 'img/masque75.png'  },
    { min: 100, src: 'img/masque100.png' }

    Toute la structure est déjà prévue pour.
  */

  const MASK_STATES = [

    {
      min: 0,
      src: 'img/masque0.png'
    }

  ];


  // =========================================================
  // SÉLECTEURS PRINCIPAUX
  // =========================================================

  const percent =
    document.getElementById('percent');

  const instabilityButtons =
    document.getElementById('instabilityButtons');

  const subjectId =
    document.getElementById('subjectId');

  const maskImage =
    document.getElementById('maskImage');


  // =========================================================
  // AUDIO / FULLSCREEN
  // =========================================================

  const audioBtn =
    document.getElementById('audioToggle');

  const ambientEl =
    document.getElementById('ambient');

  const fsBtn =
    document.getElementById('fsToggle');


  // =========================================================
  // CONTEXTE
  // =========================================================

  const worldRadios =
    document.querySelectorAll(
      'input[name="world"]'
    );

  const playersSel =
    document.getElementById('players');

  const quartierSel =
    document.getElementById('quartier');


  // =========================================================
  // INTERFACE
  // =========================================================

  const mainEl =
    document.querySelector('main');

  const vignetteEl =
    document.getElementById('vignette');

  const historyEl =
    document.getElementById('historyList');

  const versionEl =
    document.getElementById('version');


  // =========================================================
  // ACTIONS SPÉCIALES
  // =========================================================

  const btnAnchor =
    document.getElementById('btnAnchor');

  const btnCamp =
    document.getElementById('btnCamp');

  const anchorInfo =
    document.getElementById('anchorInfo');

  const campInfo =
    document.getElementById('campInfo');

  const btnNew =
    document.getElementById('btnNew');


  // =========================================================
  // FX
  // =========================================================

  const fxFlash =
    document.getElementById('fxFlash');

  const fxBlack =
    document.getElementById('fxBlack');


  // =========================================================
  // FIN DE PARTIE
  // =========================================================

  const goModal =
    document.getElementById('gameover');

  const goYes =
    document.getElementById('goYes');

  const goNo =
    document.getElementById('goNo');

  let gameOverShown = false;


  function showGameOver(){

    if (!goModal) return;

    gameOverShown = true;

    fxBlack.style.opacity = '1';

    setTimeout(()=>{

      fxBlack.style.opacity = '.9';

    }, 200);

    goModal.classList.add('show');
  }


  function hideGameOver(){

    if (!goModal) return;

    goModal.classList.remove('show');

    fxBlack.style.opacity = '0';

    gameOverShown = false;
  }


  async function tryQuitApp(){

    try{

      if (document.fullscreenElement){

        await document.exitFullscreen();

      }

    }catch(_){}


    ambientEl.pause();


    if (window.history.length > 1){

      window.history.back();

    }


    try{

      window.open('', '_self').close();

    }catch(_){}
  }


  // =========================================================
  // GATE PLAYTEST
  // =========================================================

  const gate =
    document.getElementById('gate');

  const gateInput =
    document.getElementById('gateInput');

  const gateBtn =
    document.getElementById('gateBtn');

  const gateError =
    document.getElementById('gateError');


  const GATE_KEY =
    'playtest_gate_hash';


  const PASSPHRASE_HASH =
    'sha256:2bbeda386f095c9cfe421ce02841bd948cd1405fb3cafa726947a8431a3d15ce';


  // =========================================================
  // SEUILS D'INSTABILITÉ
  // =========================================================

  const THRESHOLD_ENTER = 50;

  const THRESHOLD_EXIT = 49;


  const VOICES = {

    enter:
      'audio/voice_enter_reflet.wav',

    exit:
      'audio/voice_return_normal.mp3'

  };


  const alertBox =
    document.getElementById('alert');

  const alertText =
    document.getElementById('alertText');


  // =========================================================
  // ÉTAT DE LA PARTIE
  // =========================================================

  let state = {

    value:

      parseInt(
        localStorage.getItem(
          LSK('instability')
        ) || '0',
        10
      ),


    world:

      localStorage.getItem(
        LSK('world')
      ) || 'normal',


    players:

      parseInt(
        localStorage.getItem(
          LSK('players')
        ) || '3',
        10
      ),


    quartier:

      parseInt(
        localStorage.getItem(
          LSK('quartier')
        ) || '1',
        10
      ),


    anchorUsed:

      JSON.parse(
        localStorage.getItem(
          LSK('anchorUsed')
        ) ||
        '{"1":false,"2":false,"3":false,"4":false}'
      ),


    campLeft:

      parseInt(
        localStorage.getItem(
          LSK('campLeft')
        ) || '3',
        10
      ),


    musicOn:

      localStorage.getItem(
        LSK('musicOn')
      ) === '1',


    subjectNumber:

      Math.max(

        1,

        parseInt(
          localStorage.getItem(
            LSK('subjectNumber')
          ) || '1',
          10
        ) || 1

      )

  };


  // =========================================================
  // OUTILS
  // =========================================================

  const clamp = (v) =>
    Math.max(
      0,
      Math.min(
        100,
        v
      )
    );


  const fmt = (v) =>
    v + ' %';


  function formatSubjectNumber(number){

    return (
      'SUJET #' +
      String(number).padStart(2, '0')
    );
  }


  // =========================================================
  // JOURNAL
  // =========================================================

  const history = [];


  function addHistory(delta){

    /*
      Si aucun changement réel n'a eu lieu
      (par exemple -20 lorsque la jauge est déjà à 0),
      on n'ajoute rien au journal.
    */

    if (delta === 0) return;


    const text =

      (
        delta > 0
          ? `+${delta}`
          : `${delta}`
      )

      + ' %';


    history.unshift(text);


    if (history.length > 8){

      history.pop();

    }


    renderHistory();
  }


  function renderHistory(){

    if (!historyEl) return;


    if (history.length === 0){

      historyEl.innerHTML =
        '<li class="muted">Aucun changement récent</li>';

      return;
    }


    historyEl.innerHTML =

      history

        .map(
          item =>
            `<li>• Ajustement : <strong>${item}</strong></li>`
        )

        .join('');
  }


  // =========================================================
  // MASQUE
  // =========================================================

  function getMaskState(value){

    let currentMask =
      MASK_STATES[0];


    for (const maskState of MASK_STATES){

      if (value >= maskState.min){

        currentMask =
          maskState;

      }

    }


    return currentMask;
  }


  function updateMask(){

    if (!maskImage) return;


    const maskState =
      getMaskState(
        state.value
      );


    if (
      maskImage.getAttribute('src')
      !==
      maskState.src
    ){

      maskImage.src =
        maskState.src;

    }
  }


  // =========================================================
  // EFFETS D'AMBIANCE SELON INSTABILITÉ
  // =========================================================

  function applyMoodEffects(value){

    if (value >= 90){

      const t =
        Math.min(
          1,
          (value - 90) / 10
        );


      vignetteEl.style.opacity =

        (
          0.55
          +
          0.35 * t
        )

        .toFixed(2);

    }else{

      vignetteEl.style.opacity =
        '0';

    }
  }


  function microEffect(value){

    if (
      value >= 60
      &&
      value < 90
    ){

      if (
        Math.random()
        <
        0.5
      ){

        mainEl.classList.add(
          'fx-blur'
        );


        setTimeout(()=>{

          mainEl.classList.remove(
            'fx-blur'
          );

        }, 240);

      }else{

        mainEl.classList.add(
          'fx-shake'
        );


        setTimeout(()=>{

          mainEl.classList.remove(
            'fx-shake'
          );

        }, 360);

      }
    }
  }


  // =========================================================
  // SAUVEGARDE
  // =========================================================

  function save(){

    localStorage.setItem(

      LSK('instability'),

      String(
        state.value
      )

    );


    localStorage.setItem(

      LSK('world'),

      state.world

    );


    localStorage.setItem(

      LSK('players'),

      String(
        state.players
      )

    );


    localStorage.setItem(

      LSK('quartier'),

      String(
        state.quartier
      )

    );


    localStorage.setItem(

      LSK('anchorUsed'),

      JSON.stringify(
        state.anchorUsed
      )

    );


    localStorage.setItem(

      LSK('campLeft'),

      String(
        state.campLeft
      )

    );


    localStorage.setItem(

      LSK('musicOn'),

      state.musicOn
        ? '1'
        : '0'

    );


    localStorage.setItem(

      LSK('subjectNumber'),

      String(
        state.subjectNumber
      )

    );
  }


  // =========================================================
  // FULLSCREEN
  // =========================================================

  async function enterFullscreen(){

    try{

      if (
        !document.fullscreenElement
      ){

        await document
          .documentElement
          .requestFullscreen();

      }

    }catch(_){}
  }


  async function exitFullscreen(){

    try{

      if (
        document.fullscreenElement
      ){

        await document
          .exitFullscreen();

      }

    }catch(_){}
  }


  const isFullscreen =
    () =>
      !!document.fullscreenElement;


  // =========================================================
  // RENDU PRINCIPAL
  // =========================================================

  function render(){

    state.value =
      clamp(
        state.value
      );


    // Pourcentage

    percent.textContent =
      fmt(
        state.value
      );


    document.title =
      'Instabilité '
      +
      fmt(
        state.value
      );


    // Sujet

    if (subjectId){

      subjectId.textContent =
        formatSubjectNumber(
          state.subjectNumber
        );

    }


    // Masque

    updateMask();


    // Alertes seuil 50 %

    checkThresholdTransition();


    // Ambiance

    applyMoodEffects(
      state.value
    );


    // Version

    if (versionEl){

      versionEl.textContent =
        VERSION;

    }


    // Contexte

    worldRadios.forEach(

      radio =>{

        radio.checked =
          (
            radio.value
            ===
            state.world
          );

      }

    );


    playersSel.value =
      String(
        state.players
      );


    quartierSel.value =
      String(
        state.quartier
      );


    // =======================================================
    // ACTIONS SPÉCIALES
    //
    // RÈGLES ACTUELLES CONSERVÉES POUR CETTE ÉTAPE.
    // =======================================================

    const quartier =
      String(
        state.quartier
      );


    const anchorAlreadyUsed =
      !!state.anchorUsed[
        quartier
      ];


    // Point d'ancrage actuel

    btnAnchor.disabled =

      (
        state.world
        !==
        'reflet'
      )

      ||

      anchorAlreadyUsed;


    anchorInfo.textContent =

      state.world
      ===
      'reflet'

        ?

        `Restant : ${
          anchorAlreadyUsed
            ? 0
            : 1
        } (1 par quartier)`

        :

        'Restant : 0 (1 par quartier)';


    // Camp de fortune actuel

    btnCamp.disabled =
      state.campLeft
      <=
      0;


    campInfo.textContent =

      `Utilisations restantes : ${
        state.campLeft
      } — ${
        state.world === 'reflet'
          ? '−20 % en Reflet'
          : '−30 % en Monde normal'
      }`;


    // Musique

    audioBtn.textContent =

      state.musicOn
        ? 'MUSIQUE ON'
        : 'MUSIQUE OFF';


    audioBtn.setAttribute(

      'aria-pressed',

      state.musicOn
        ? 'true'
        : 'false'

    );


    // Plein écran

    if (fsBtn){

      fsBtn.textContent =

        isFullscreen()
          ? 'Quitter plein écran'
          : 'Plein écran';


      fsBtn.setAttribute(

        'aria-pressed',

        isFullscreen()
          ? 'true'
          : 'false'

      );
    }


    save();
  }


  // =========================================================
  // MODIFICATION DE L'INSTABILITÉ
  // =========================================================

  function applyInstabilityDelta(
    requestedDelta
  ){

    if (gameOverShown){

      return;

    }


    const oldValue =
      state.value;


    const newValue =
      clamp(
        oldValue
        +
        requestedDelta
      );


    const actualDelta =
      newValue
      -
      oldValue;


    /*
      Exemple :

      95 % + 20 %

      La jauge monte réellement de 5 %.

      Le journal affichera donc +5 %
      et non +20 %.
    */

    if (actualDelta === 0){

      return;

    }


    state.value =
      newValue;


    addHistory(
      actualDelta
    );


    microEffect(
      state.value
    );


    render();


    checkGameOver();


    maybeHaunt();
  }


  // =========================================================
  // CRÉATION DES 8 BOUTONS
  // =========================================================

  function createInstabilityButton(
    value,
    sign
  ){

    const button =
      document.createElement(
        'button'
      );


    const delta =
      sign
      *
      value;


    button.type =
      'button';


    button.classList.add(
      'btn'
    );


    if (sign > 0){

      button.classList.add(

        'btn-plus',

        'btn-p' + value

      );


      button.setAttribute(

        'aria-label',

        `Augmenter l’instabilité de ${value} %`

      );

    }else{

      button.classList.add(

        'btn-minus',

        'btn-m' + value

      );


      button.setAttribute(

        'aria-label',

        `Réduire l’instabilité de ${value} %`

      );
    }


    button.addEventListener(

      'click',

      ()=>{

        applyInstabilityDelta(
          delta
        );

      }

    );


    return button;
  }


  function buildInstabilityButtons(){

    if (
      !instabilityButtons
    ){

      return;

    }


    instabilityButtons.innerHTML =
      '';


    /*
      Génère automatiquement :

      -5     +5
      -10   +10
      -15   +15
      -20   +20
    */

    STEPS.forEach(

      value =>{

        const row =
          document.createElement(
            'div'
          );


        row.className =
          'instability-row';


        row.appendChild(

          createInstabilityButton(
            value,
            -1
          )

        );


        row.appendChild(

          createInstabilityButton(
            value,
            +1
          )

        );


        instabilityButtons.appendChild(
          row
        );

      }

    );
  }


  buildInstabilityButtons();


  // =========================================================
  // EFFETS HANTÉS
  // =========================================================

  function randInt(
    a,
    b
  ){

    return (

      a

      +

      Math.floor(

        Math.random()
        *
        (
          b
          -
          a
          +
          1
        )

      )

    );
  }


  function pick(array){

    return array[

      Math.floor(
        Math.random()
        *
        array.length
      )

    ];
  }


  function flashWhite(
    ms = 120
  ){

    fxFlash.style.opacity =
      '1';


    setTimeout(()=>{

      fxFlash.style.opacity =
        '0';

    }, ms);
  }


  function flashBlack(
    ms = 420
  ){

    fxBlack.style.opacity =
      '1';


    setTimeout(()=>{

      fxBlack.style.opacity =
        '0';

    }, ms);
  }


  function blackout(
    ms = 900
  ){

    fxBlack.style.transition =
      'opacity .12s';


    fxBlack.style.opacity =
      '1';


    setTimeout(()=>{

      fxBlack.style.opacity =
        '0';


      fxBlack.style.transition =
        'opacity .4s';

    }, ms);
  }


  function playSFX(
    volume = 0.9
  ){

    try{

      const audio =
        new Audio(
          pick(
            HAUNT.sfx
          )
        );


      audio.volume =
        volume;


      audio
        .play()
        .catch(
          ()=>{}
        );

    }catch(_){}
  }


  function triggerHaunt(){

    const effect =
      randInt(
        1,
        4
      );


    if (effect === 1){

      flashWhite(

        randInt(
          90,
          160
        )

      );

    }else if (
      effect
      ===
      2
    ){

      flashBlack(

        randInt(
          200,
          480
        )

      );

    }else if (
      effect
      ===
      3
    ){

      blackout(

        randInt(
          700,
          1100
        )

      );
    }


    if (
      Math.random()
      <
      0.85
    ){

      playSFX(
        0.9
      );

    }
  }


  function maybeHaunt(
    force = false
  ){

    if (

      force

      ||

      Math.random()
      <
      HAUNT.perClickProb

    ){

      triggerHaunt();

    }
  }


  // =========================================================
  // ALERTES 49 / 50
  // =========================================================

  function showAlert(
    message,
    type = 'reflet',
    voiceSrc = null
  ){

    alertText.textContent =
      message;


    alertBox.classList.add(
      'show',
      type
    );


    if (voiceSrc){

      const audio =
        new Audio(
          voiceSrc
        );


      audio.volume =
        0.9;


      audio
        .play()
        .catch(
          ()=>{}
        );

    }


    setTimeout(()=>{

      alertBox.classList.remove(
        'show'
      );

    }, 5000);


    setTimeout(()=>{

      alertBox.classList.remove(
        type
      );

    }, 6000);
  }


  const zoneFromValue =
    value =>

      value >= THRESHOLD_ENTER

        ? 'reflet'

        : 'normal';


  let lastZone =
    zoneFromValue(

      parseInt(

        localStorage.getItem(
          LSK('instability')
        ) || '0',

        10

      )

    );


  function checkThresholdTransition(){

    const current =
      state.value;


    if (
      lastZone
      ===
      undefined
    ){

      lastZone =

        current >= 50
          ? 'reflet'
          : 'normal';

    }


    if (

      current >= 50

      &&

      lastZone
      !==
      'reflet'

    ){

      showAlert(

        'Vous basculez dans le Reflet du vice',

        'reflet',

        VOICES.enter

      );


      lastZone =
        'reflet';

    }else if (

      current < 50

      &&

      lastZone
      !==
      'normal'

    ){

      showAlert(

        'Vous reprenez pied dans le monde normal',

        'normal',

        VOICES.exit

      );


      lastZone =
        'normal';
    }
  }


  // =========================================================
  // GAME OVER 100 %
  // =========================================================

  function checkGameOver(){

    if (

      state.value >= 100

      &&

      !gameOverShown

    ){

      state.value =
        100;


      render();


      showGameOver();

    }
  }


  // =========================================================
  // EFFETS PASSIFS
  // =========================================================

  let passiveTimer =
    null;


  function schedulePassive(){

    clearTimeout(
      passiveTimer
    );


    const [
      min,
      max
    ] =
      HAUNT.passiveEvery;


    passiveTimer =
      setTimeout(

        ()=>{

          if (
            Math.random()
            <
            0.6
          ){

            playSFX(
              0.9
            );

          }else{

            flashBlack(
              160
            );

          }


          schedulePassive();

        },

        randInt(
          min,
          max
        )

      );
  }


  // =========================================================
  // ACTION SPÉCIALE :
  // POINT D'ANCRAGE
  //
  // ANCIENNE RÈGLE CONSERVÉE POUR LE MOMENT.
  // =========================================================

  btnAnchor.addEventListener(

    'click',

    ()=>{

      if (

        state.world
        !==
        'reflet'

        ||

        gameOverShown

      ){

        return;

      }


      const quartier =
        String(
          state.quartier
        );


      if (
        state.anchorUsed[
          quartier
        ]
      ){

        return;

      }


      state.anchorUsed[
        quartier
      ] = true;


      const oldValue =
        state.value;


      state.value =
        clamp(
          state.value
          -
          15
        );


      const actualDelta =
        state.value
        -
        oldValue;


      addHistory(
        actualDelta
      );


      microEffect(
        state.value
      );


      render();


      checkGameOver();


      maybeHaunt(
        true
      );

    }

  );


  // =========================================================
  // ACTION SPÉCIALE :
  // CAMP DE FORTUNE
  //
  // ANCIENNE RÈGLE CONSERVÉE POUR LE MOMENT.
  // =========================================================

  btnCamp.addEventListener(

    'click',

    ()=>{

      if (

        state.campLeft
        <=
        0

        ||

        gameOverShown

      ){

        return;

      }


      const requestedDelta =

        state.world
        ===
        'reflet'

          ? -20

          : -30;


      state.campLeft -=
        1;


      const oldValue =
        state.value;


      state.value =
        clamp(

          state.value
          +
          requestedDelta

        );


      const actualDelta =
        state.value
        -
        oldValue;


      addHistory(
        actualDelta
      );


      microEffect(
        state.value
      );


      render();


      checkGameOver();


      maybeHaunt(
        true
      );

    }

  );


  // =========================================================
  // NOUVELLE PARTIE
  // =========================================================

  function newGame(){

    // Jauge

    state.value =
      0;


    // Anciennes règles actuelles

    state.campLeft =
      3;


    state.anchorUsed = {

      "1": false,

      "2": false,

      "3": false,

      "4": false

    };


    /*
      Nouveau matricule.

      SUJET #01
          ↓
      Nouvelle partie
          ↓
      SUJET #02
          ↓
      Nouvelle partie
          ↓
      SUJET #03
    */

    state.subjectNumber +=
      1;


    // Journal

    history.length =
      0;


    renderHistory();


    // Monde psychologique

    lastZone =
      'normal';


    // Ferme éventuellement la modale

    hideGameOver();


    // Mise à jour

    render();
  }


  if (btnNew){

    btnNew.addEventListener(

      'click',

      ()=>{

        const confirmNewGame =
          confirm(

            'Nouvelle partie ? La jauge et les usages spéciaux seront remis à zéro.'

          );


        if (
          confirmNewGame
        ){

          newGame();

        }

      }

    );
  }


  // =========================================================
  // GAME OVER :
  // RECOMMENCER / QUITTER
  // =========================================================

  goYes?.addEventListener(

    'click',

    ()=>{

      newGame();

    }

  );


  goNo?.addEventListener(

    'click',

    ()=>{

      try{

        navigator.vibrate?.(
          120
        );

      }catch(_){}


      tryQuitApp();

    }

  );


  // =========================================================
  // CONTEXTE DE PARTIE
  // =========================================================

  worldRadios.forEach(

    radio =>

      radio.addEventListener(

        'change',

        ()=>{

          if (
            radio.checked
          ){

            state.world =
              radio.value;


            render();


            maybeHaunt();

          }

        }

      )

  );


  playersSel.addEventListener(

    'change',

    ()=>{

      state.players =

        parseInt(
          playersSel.value,
          10
        )

        ||

        3;


      render();

    }

  );


  quartierSel.addEventListener(

    'change',

    ()=>{

      state.quartier =

        parseInt(
          quartierSel.value,
          10
        )

        ||

        1;


      render();

    }

  );


  // =========================================================
  // MUSIQUE
  // =========================================================

  let ambientIdx =
    0;


  function playAmbientCurrent(){

    if (
      !state.musicOn
    ){

      return;

    }


    ambientEl.loop =
      false;


    ambientEl.src =

      AMBIENT_TRACKS[

        ambientIdx
        %
        AMBIENT_TRACKS.length

      ];


    ambientEl.volume =
      0.55;


    ambientEl
      .play()
      .catch(
        ()=>{}
      );
  }


  ambientEl.addEventListener(

    'ended',

    ()=>{

      ambientIdx =

        (
          ambientIdx
          +
          1
        )

        %

        AMBIENT_TRACKS.length;


      playAmbientCurrent();

    }

  );


  audioBtn.addEventListener(

    'click',

    ()=>{

      state.musicOn =
        !state.musicOn;


      if (
        state.musicOn
      ){

        playAmbientCurrent();

      }else{

        ambientEl.pause();

      }


      render();

    }

  );


  // =========================================================
  // PLEIN ÉCRAN
  // =========================================================

  if (fsBtn){

    fsBtn.addEventListener(

      'click',

      async ()=>{

        if (
          isFullscreen()
        ){

          await exitFullscreen();

        }else{

          await enterFullscreen();

        }


        render();

      }

    );
  }


  document.addEventListener(

    'fullscreenchange',

    render

  );


  // =========================================================
  // MOT DE PASSE PLAYTEST
  // =========================================================

  async function sha256Hex(
    text
  ){

    const encoded =
      new TextEncoder()
        .encode(
          text
        );


    const buffer =
      await crypto.subtle.digest(

        'SHA-256',

        encoded

      );


    return Array

      .from(
        new Uint8Array(
          buffer
        )
      )

      .map(

        byte =>
          byte
            .toString(16)
            .padStart(2, '0')

      )

      .join('');
  }


  function okGate(){

    gate.style.display =
      'none';


    if (
      'serviceWorker'
      in
      navigator
    ){

      navigator.serviceWorker.register(

        './service-worker.js'

      );

    }
  }


  async function checkGate(){

    const stored =
      localStorage.getItem(
        GATE_KEY
      );


    if (
      stored
      ===
      PASSPHRASE_HASH
    ){

      okGate();

      return;

    }


    gate.style.display =
      'flex';
  }


  gateBtn.addEventListener(

    'click',

    async ()=>{

      const hash =
        await sha256Hex(

          (
            gateInput.value
            ||
            ''
          )

          .trim()

        );


      const target =
        PASSPHRASE_HASH.replace(

          'sha256:',

          ''

        );


      if (
        hash
        ===
        target
      ){

        localStorage.setItem(

          GATE_KEY,

          PASSPHRASE_HASH

        );


        okGate();

      }else{

        gateError.textContent =
          'Mot de passe incorrect.';

      }

    }

  );


  gateInput.addEventListener(

    'keydown',

    event =>{

      if (
        event.key
        ===
        'Enter'
      ){

        gateBtn.click();

      }

    }

  );


  // =========================================================
  // WAKE LOCK
  // =========================================================

  let wakeLock =
    null;


  async function requestWakeLock(){

    try{

      if (
        'wakeLock'
        in
        navigator
      ){

        wakeLock =
          await navigator
            .wakeLock
            .request(
              'screen'
            );

      }

    }catch(_){}
  }


  document.addEventListener(

    'visibilitychange',

    ()=>{

      if (
        document.visibilityState
        ===
        'visible'
      ){

        requestWakeLock();

      }

    }

  );


  // =========================================================
  // INSTALLATION PWA
  // =========================================================

  let deferredPrompt =
    null;


  const banner =
    document.getElementById(
      'installBanner'
    );


  const btnInstall =
    document.getElementById(
      'installBtn'
    );


  const btnInstallClose =
    document.getElementById(
      'installClose'
    );


  const installText =
    document.getElementById(
      'installText'
    );


  const isIOS =
    /iPhone|iPad|iPod/i
      .test(
        navigator.userAgent
      );


  const isStandalone =

    window
      .matchMedia(
        '(display-mode: standalone)'
      )
      .matches

    ||

    window.navigator.standalone;


  function showBanner(){

    if (
      isStandalone
    ){

      return;

    }


    banner.classList.add(
      'show'
    );


    banner.setAttribute(

      'aria-hidden',

      'false'

    );


    if (
      isIOS
    ){

      installText.textContent =

        'Sur iPhone : touchez “Partager” puis “Ajouter à l’écran d’accueil”.';


      btnInstall.textContent =
        'OK';

    }
  }


  function hideBanner(
    permanently = false
  ){

    banner.classList.remove(
      'show'
    );


    banner.setAttribute(

      'aria-hidden',

      'true'

    );


    if (
      permanently
    ){

      localStorage.setItem(

        'hideInstall',

        '1'

      );

    }
  }


  window.addEventListener(

    'beforeinstallprompt',

    event =>{

      event.preventDefault();


      deferredPrompt =
        event;


      maybeShowInstallBanner();

    }

  );


  btnInstall?.addEventListener(

    'click',

    async ()=>{

      if (
        isIOS
      ){

        hideBanner(
          true
        );

        return;

      }


      if (
        !deferredPrompt
      ){

        return;

      }


      deferredPrompt.prompt();


      const choice =
        await deferredPrompt.userChoice;


      deferredPrompt =
        null;


      if (
        choice.outcome
        ===
        'accepted'
      ){

        hideBanner(
          true
        );

      }

    }

  );


  btnInstallClose?.addEventListener(

    'click',

    ()=>{

      hideBanner(
        true
      );

    }

  );


  function maybeShowInstallBanner(){

    if (
      isStandalone
    ){

      return;

    }


    const params =
      new URLSearchParams(
        location.search
      );


    const askedFromQR =

      params.get(
        'install'
      )

      ===

      '1';


    const userRefused =

      localStorage.getItem(
        'hideInstall'
      )

      ===

      '1';


    if (
      isIOS
    ){

      if (
        askedFromQR
        &&
        !userRefused
      ){

        showBanner();

      }

    }else{

      if (
        !deferredPrompt
      ){

        return;

      }


      if (
        askedFromQR
        ||
        !userRefused
      ){

        showBanner();

      }

    }
  }


  // =========================================================
  // INITIALISATION
  // =========================================================

  function init(){

    checkGate();


    renderHistory();


    render();


    schedulePassive();


    if (
      state.musicOn
    ){

      playAmbientCurrent();

    }


    requestWakeLock();


    maybeShowInstallBanner();

  }


  document.addEventListener(

    'DOMContentLoaded',

    init

  );

})();
