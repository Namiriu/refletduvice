(function(){

  // =========================================================
  // CONFIG
  // =========================================================

  const STEPS = [5, 10, 15, 20];

  const LSK = (k) => 'jds_' + k;

  const VERSION = 'v0.7.1 Playtest';

  const FIXED_PLAYERS = 4;


  // =========================================================
  // AUDIO D'AMBIANCE
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
  // ÉTATS DU MASQUE
  // =========================================================

  /*
    Pour l'instant seul masque0.png existe.

    Quand les prochains visuels seront prêts,
    il suffira de réactiver les lignes correspondantes.

    Exemple :

    { min: 25,  src: 'img/masque25.png' },
    { min: 50,  src: 'img/masque50.png' },
    { min: 75,  src: 'img/masque75.png' },
    { min: 100, src: 'img/masque100.png' }
  */

  const MASK_STATES = [
    {
      min: 0,
      src: 'img/masque0.png'
    }

    // Futurs masques :
    // { min: 25,  src: 'img/masque25.png' },
    // { min: 50,  src: 'img/masque50.png' },
    // { min: 75,  src: 'img/masque75.png' },
    // { min: 100, src: 'img/masque100.png' },
  ];


  // =========================================================
  // ÉLÉMENTS PRINCIPAUX
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
  // INTERFACE
  // =========================================================

  const mainEl =
    document.querySelector('main');

  const vignetteEl =
    document.getElementById('vignette');

  const versionEl =
    document.getElementById('version');


  // =========================================================
  // JOURNAL
  // =========================================================

  const historyEl =
    document.getElementById('historyList');

  const btnJournal =
    document.getElementById('btnJournal');

  const journalModal =
    document.getElementById('journalModal');

  const journalClose =
    document.getElementById('journalClose');


  // =========================================================
  // ONGLETS
  // =========================================================

  const tabButtons =
    document.querySelectorAll('.tab-btn');

  const tabPanels =
    document.querySelectorAll('.tab-panel');


  // =========================================================
  // ACTIONS SPÉCIALES
  // =========================================================

  const btnAnchor =
    document.getElementById('btnAnchor');

  const btnAnchorHelp =
    document.getElementById('btnAnchorHelp');

  const btnCamp =
    document.getElementById('btnCamp');

  const btnCampHelp =
    document.getElementById('btnCampHelp');

  const anchorInfo =
    document.getElementById('anchorInfo');

  const campInfo =
    document.getElementById('campInfo');

  const btnNew =
    document.getElementById('btnNew');


  // =========================================================
  // EFFETS VISUELS
  // =========================================================

  const fxFlash =
    document.getElementById('fxFlash');

  const fxBlack =
    document.getElementById('fxBlack');

  const alertBox =
    document.getElementById('alert');

  const alertText =
    document.getElementById('alertText');


  // =========================================================
  // GAME OVER
  // =========================================================

  const goModal =
    document.getElementById('gameover');

  const goYes =
    document.getElementById('goYes');

  const goNo =
    document.getElementById('goNo');

  let gameOverShown = false;


  // =========================================================
  // MOT DE PASSE PLAYTEST
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
  // SEUILS
  // =========================================================

  const THRESHOLD_ENTER = 50;
  const THRESHOLD_EXIT = 49;


  const VOICES = {
    enter: 'audio/voice_enter_reflet.wav',
    exit: 'audio/voice_return_normal.mp3'
  };


  // =========================================================
  // VALEURS PAR DÉFAUT
  // =========================================================

  const DEFAULT_ANCHORS = {
    "1": false,
    "2": false,
    "3": false,
    "4": false
  };


  function readAnchorUsed(){

    try{

      const stored =
        JSON.parse(
          localStorage.getItem(
            LSK('anchorUsed')
          )
          ||
          JSON.stringify(DEFAULT_ANCHORS)
        );


      return {
        "1": !!stored["1"],
        "2": !!stored["2"],
        "3": !!stored["3"],
        "4": !!stored["4"]
      };

    }catch(_){

      return {
        ...DEFAULT_ANCHORS
      };

    }
  }


  // =========================================================
  // ÉTAT
  // =========================================================

  let state = {

    value:
      parseInt(
        localStorage.getItem(
          LSK('instability')
        ) || '0',
        10
      ),

    /*
      Le monde n'est plus sélectionné manuellement.

      Il sera recalculé automatiquement selon l'instabilité.
    */
    world: 'normal',

    /*
      Le jeu est désormais fixé à 4 joueurs.
    */
    players: FIXED_PLAYERS,

    /*
      Ancienne mécanique temporaire :
      1 Point d'ancrage maximum par quartier.
    */
    anchorUsed:
      readAnchorUsed(),

    /*
      Décision la plus récente :
      3 Camps de fortune.
    */
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

  const clamp = (value) =>
    Math.max(
      0,
      Math.min(
        100,
        value
      )
    );


  const fmt = (value) =>
    value + ' %';


  function formatSubjectNumber(number){

    return (
      'SUJET #'
      +
      String(number).padStart(2, '0')
    );
  }


  function worldFromValue(value){

    return (
      value >= THRESHOLD_ENTER
        ? 'reflet'
        : 'normal'
    );
  }


  // =========================================================
  // MONDE AUTOMATIQUE
  // =========================================================

  function updateWorld(){

    state.world =
      worldFromValue(
        state.value
      );


    document.body.classList.toggle(
      'world-normal',
      state.world === 'normal'
    );


    document.body.classList.toggle(
      'world-reflet',
      state.world === 'reflet'
    );
  }


  // =========================================================
  // ONGLETS
  // =========================================================

  function switchTab(tabName){

    tabButtons.forEach(button => {

      const isActive =
        button.dataset.tab === tabName;


      button.classList.toggle(
        'active',
        isActive
      );

    });


    tabPanels.forEach(panel => {

      const isActive =
        panel.id === 'tab-' + tabName;


      panel.classList.toggle(
        'active',
        isActive
      );

    });

  }


  tabButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        switchTab(
          button.dataset.tab
        );

      }
    );

  });


  // =========================================================
  // JOURNAL
  // =========================================================

  const history = [];


  function addHistory(delta){

    if (delta === 0){

      return;

    }


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

    if (!historyEl){

      return;

    }


    if (
      history.length === 0
    ){

      historyEl.innerHTML =
        '<li class="muted">Aucun changement récent.</li>';

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


  function openJournal(){

    if (!journalModal){

      return;

    }


    renderHistory();


    journalModal.classList.add(
      'show'
    );
  }


  function closeJournal(){

    if (!journalModal){

      return;

    }


    journalModal.classList.remove(
      'show'
    );
  }


  btnJournal?.addEventListener(
    'click',
    openJournal
  );


  journalClose?.addEventListener(
    'click',
    closeJournal
  );


  journalModal?.addEventListener(
    'click',
    event => {

      if (
        event.target === journalModal
      ){

        closeJournal();

      }

    }
  );


  // =========================================================
  // MODALE D'INFORMATION GÉNÉRIQUE
  // =========================================================

  const infoModal =
    document.createElement('div');


  infoModal.className =
    'modal journal-modal';


  infoModal.innerHTML = `
    <div class="modal-inner">

      <div
        class="modal-title"
        id="infoModalTitle"
      >
      </div>

      <div
        class="modal-text"
        id="infoModalText"
      >
      </div>

      <div class="modal-actions">

        <button
          id="infoModalClose"
          class="modal-btn"
          type="button"
        >
          Fermer
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(
    infoModal
  );


  const infoModalTitle =
    document.getElementById(
      'infoModalTitle'
    );


  const infoModalText =
    document.getElementById(
      'infoModalText'
    );


  const infoModalClose =
    document.getElementById(
      'infoModalClose'
    );


  function showInfoModal(
    title,
    html
  ){

    infoModalTitle.textContent =
      title;


    infoModalText.innerHTML =
      html;


    infoModal.classList.add(
      'show'
    );
  }


  function hideInfoModal(){

    infoModal.classList.remove(
      'show'
    );
  }


  infoModalClose.addEventListener(
    'click',
    hideInfoModal
  );


  infoModal.addEventListener(
    'click',
    event => {

      if (
        event.target === infoModal
      ){

        hideInfoModal();

      }

    }
  );


  // =========================================================
  // AIDE DES ACTIONS SPÉCIALES
  // =========================================================

  btnAnchorHelp?.addEventListener(
    'click',
    () => {

      showInfoModal(

        'Point d’ancrage',

        `
          <strong>Règle temporaire actuelle</strong>
          <br><br>

          Disponible uniquement dans le
          <strong>Reflet du Vice</strong>.
          <br><br>

          Utilisable une seule fois par quartier.
          <br><br>

          Réduit l’Instabilité mentale de
          <strong>15 %</strong>.
          <br><br>

          Cette mécanique sera prochainement remplacée
          par les Totems de résurrection.
        `
      );

    }
  );


  btnCampHelp?.addEventListener(
    'click',
    () => {

      showInfoModal(

        'Camp de fortune',

        `
          Nécessite l’accord de la
          <strong>majorité du groupe</strong>.
          <br><br>

          Nombre d’utilisations :
          <strong>3 par partie</strong>.
          <br><br>

          Monde normal :
          <strong>−30 % d’Instabilité</strong>.
          <br><br>

          Reflet du Vice :
          <strong>−20 % d’Instabilité</strong>.
          <br><br>

          L’application détermine automatiquement
          le monde actif selon le seuil des 50 %.
        `
      );

    }
  );


  // =========================================================
  // FERMETURE MODALES AVEC ÉCHAP
  // =========================================================

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key !== 'Escape'
      ){

        return;

      }


      closeJournal();

      hideInfoModal();

    }
  );


  // =========================================================
  // MASQUE
  // =========================================================

  function getMaskState(value){

    let current =
      MASK_STATES[0];


    for (
      const maskState
      of MASK_STATES
    ){

      if (
        value >= maskState.min
      ){

        current =
          maskState;

      }

    }


    return current;
  }


  function updateMask(){

    if (!maskImage){

      return;

    }


    const current =
      getMaskState(
        state.value
      );


    if (
      maskImage.getAttribute(
        'src'
      )
      !==
      current.src
    ){

      maskImage.src =
        current.src;

    }
  }


  // =========================================================
  // EFFETS D'INSTABILITÉ
  // =========================================================

  function applyMoodEffects(value){

    if (
      value >= 90
    ){

      const intensity =
        Math.min(
          1,
          (value - 90) / 10
        );


      vignetteEl.style.opacity =

        (
          0.55
          +
          0.35 * intensity
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


        setTimeout(
          () => {

            mainEl.classList.remove(
              'fx-blur'
            );

          },
          240
        );

      }else{

        mainEl.classList.add(
          'fx-shake'
        );


        setTimeout(
          () => {

            mainEl.classList.remove(
              'fx-shake'
            );

          },
          360
        );

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


    /*
      Conservé pour compatibilité avec
      les anciennes versions.

      Mais la valeur est maintenant automatique.
    */

    localStorage.setItem(
      LSK('world'),
      state.world
    );


    /*
      Le jeu est maintenant fixé à quatre joueurs.
    */

    localStorage.setItem(
      LSK('players'),
      String(
        FIXED_PLAYERS
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


  function isFullscreen(){

    return (
      !!document.fullscreenElement
    );
  }


  // =========================================================
  // RENDER
  // =========================================================

  function render(){

    state.value =
      clamp(
        state.value
      );


    /*
      Détermine automatiquement :
      0–49  = Monde normal
      50–100 = Reflet
    */

    updateWorld();


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

    if (
      subjectId
    ){

      subjectId.textContent =
        formatSubjectNumber(
          state.subjectNumber
        );

    }


    // Masque

    updateMask();


    // Transition Normal / Reflet

    checkThresholdTransition();


    // Effets visuels

    applyMoodEffects(
      state.value
    );


    // Version

    if (
      versionEl
    ){

      versionEl.textContent =
        VERSION;

    }


    // =======================================================
    // POINT D'ANCRAGE — MÉCANIQUE TEMPORAIRE
    // =======================================================

    const anchorsUsed =
      Object
        .values(
          state.anchorUsed
        )
        .filter(Boolean)
        .length;


    const anchorsLeft =
      4
      -
      anchorsUsed;


    btnAnchor.disabled =

      state.world
      !==
      'reflet'

      ||

      anchorsLeft
      <=
      0;


    if (
      state.world
      !==
      'reflet'
    ){

      anchorInfo.textContent =
        'Disponible dans le Reflet';

    }else if (
      anchorsLeft <= 0
    ){

      anchorInfo.textContent =
        'Tous les Points utilisés';

    }else{

      anchorInfo.textContent =
        `${anchorsUsed}/4 utilisés`;

    }


    // =======================================================
    // CAMP DE FORTUNE
    // =======================================================

    btnCamp.disabled =
      state.campLeft
      <=
      0;


    campInfo.textContent =
      `Restants : ${state.campLeft}/3`;


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

    if (
      fsBtn
    ){

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
  // MODIFICATION DE LA JAUGE
  // =========================================================

  function applyInstabilityDelta(
    requestedDelta
  ){

    if (
      gameOverShown
    ){

      return;

    }


    const previousValue =
      state.value;


    const newValue =
      clamp(
        previousValue
        +
        requestedDelta
      );


    const actualDelta =
      newValue
      -
      previousValue;


    if (
      actualDelta === 0
    ){

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
      value
      *
      sign;


    button.type =
      'button';


    button.classList.add(
      'btn'
    );


    if (
      sign > 0
    ){

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
      () => {

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
      Produit :

      -5      +5
      -10    +10
      -15    +15
      -20    +20
    */

    STEPS.forEach(
      value => {

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


  // =========================================================
  // EFFETS HANTÉS
  // =========================================================

  function randInt(
    min,
    max
  ){

    return (
      min
      +
      Math.floor(
        Math.random()
        *
        (
          max
          -
          min
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


    setTimeout(
      () => {

        fxFlash.style.opacity =
          '0';

      },
      ms
    );
  }


  function flashBlack(
    ms = 420
  ){

    fxBlack.style.opacity =
      '1';


    setTimeout(
      () => {

        fxBlack.style.opacity =
          '0';

      },
      ms
    );
  }


  function blackout(
    ms = 900
  ){

    fxBlack.style.transition =
      'opacity .12s';


    fxBlack.style.opacity =
      '1';


    setTimeout(
      () => {

        fxBlack.style.opacity =
          '0';


        fxBlack.style.transition =
          'opacity .4s';

      },
      ms
    );
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
          () => {}
        );

    }catch(_){}
  }


  function triggerHaunt(){

    const effect =
      randInt(
        1,
        4
      );


    if (
      effect === 1
    ){

      flashWhite(
        randInt(
          90,
          160
        )
      );

    }else if (
      effect === 2
    ){

      flashBlack(
        randInt(
          200,
          480
        )
      );

    }else if (
      effect === 3
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
  // ALERTES NORMAL / REFLET
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


    if (
      voiceSrc
    ){

      const audio =
        new Audio(
          voiceSrc
        );


      audio.volume =
        0.9;


      audio
        .play()
        .catch(
          () => {}
        );

    }


    setTimeout(
      () => {

        alertBox.classList.remove(
          'show'
        );

      },
      5000
    );


    setTimeout(
      () => {

        alertBox.classList.remove(
          type
        );

      },
      6000
    );
  }


  let lastZone =
    worldFromValue(
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
      current >= THRESHOLD_ENTER
      &&
      lastZone !== 'reflet'
    ){

      showAlert(
        'Vous basculez dans le Reflet du vice',
        'reflet',
        VOICES.enter
      );


      lastZone =
        'reflet';


    }else if (

      current <= THRESHOLD_EXIT

      &&

      lastZone !== 'normal'

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
  // GAME OVER
  // =========================================================

  function showGameOver(){

    if (
      !goModal
    ){

      return;

    }


    gameOverShown =
      true;


    fxBlack.style.opacity =
      '1';


    setTimeout(
      () => {

        fxBlack.style.opacity =
          '.9';

      },
      200
    );


    goModal.classList.add(
      'show'
    );
  }


  function hideGameOver(){

    if (
      !goModal
    ){

      return;

    }


    goModal.classList.remove(
      'show'
    );


    fxBlack.style.opacity =
      '0';


    gameOverShown =
      false;
  }


  function checkGameOver(){

    if (
      state.value >= 100
      &&
      !gameOverShown
    ){

      showGameOver();

    }
  }


  async function tryQuitApp(){

    try{

      if (
        document.fullscreenElement
      ){

        await document.exitFullscreen();

      }

    }catch(_){}


    ambientEl.pause();


    if (
      window.history.length > 1
    ){

      window.history.back();

    }


    try{

      window
        .open(
          '',
          '_self'
        )
        .close();

    }catch(_){}
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
        () => {

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
  // POINT D'ANCRAGE
  //
  // MÉCANIQUE TEMPORAIRE
  // =========================================================

  btnAnchor.addEventListener(
    'click',
    () => {

      if (
        state.world !== 'reflet'
        ||
        gameOverShown
      ){

        return;

      }


      /*
        Comme le sélecteur Quartier a disparu de l'interface,
        on demande temporairement le quartier lors de l'utilisation.

        Cette étape disparaîtra complètement lorsque nous
        remplacerons le Point d'ancrage par les Totems.
      */

      const answer =
        prompt(
          'Dans quel quartier êtes-vous ?\n\nEntrez un nombre de 1 à 4.'
        );


      if (
        answer === null
      ){

        return;

      }


      const quartier =
        parseInt(
          answer,
          10
        );


      if (
        quartier < 1
        ||
        quartier > 4
        ||
        Number.isNaN(
          quartier
        )
      ){

        alert(
          'Quartier invalide. Entrez un nombre compris entre 1 et 4.'
        );

        return;

      }


      const key =
        String(
          quartier
        );


      if (
        state.anchorUsed[
          key
        ]
      ){

        alert(
          `Le Point d’ancrage du quartier ${quartier} a déjà été utilisé.`
        );

        return;

      }


      state.anchorUsed[
        key
      ] =
        true;


      const previousValue =
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
        previousValue;


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
  // CAMP DE FORTUNE
  //
  // RÈGLE ACTUELLE TEMPORAIRE :
  // -30 % NORMAL
  // -20 % REFLET
  // 3 FOIS
  // =========================================================

  btnCamp.addEventListener(
    'click',
    () => {

      if (
        state.campLeft <= 0
        ||
        gameOverShown
      ){

        return;

      }


      const requestedDelta =

        state.world === 'reflet'
          ? -20
          : -30;


      state.campLeft -=
        1;


      const previousValue =
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
        previousValue;


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

    state.value =
      0;


    state.world =
      'normal';


    state.players =
      FIXED_PLAYERS;


    state.campLeft =
      3;


    state.anchorUsed = {
      "1": false,
      "2": false,
      "3": false,
      "4": false
    };


    /*
      Chaque nouvelle partie crée
      un nouveau sujet.
    */

    state.subjectNumber +=
      1;


    history.length =
      0;


    renderHistory();


    lastZone =
      'normal';


    hideGameOver();


    /*
      On revient automatiquement
      sur l'onglet Partie.
    */

    switchTab(
      'partie'
    );


    render();
  }


  btnNew?.addEventListener(
    'click',
    () => {

      const accepted =
        confirm(
          'Nouvelle partie ? La jauge et les usages spéciaux seront remis à zéro.'
        );


      if (
        accepted
      ){

        newGame();

      }

    }
  );


  goYes?.addEventListener(
    'click',
    () => {

      newGame();

    }
  );


  goNo?.addEventListener(
    'click',
    () => {

      try{

        navigator.vibrate?.(
          120
        );

      }catch(_){}


      tryQuitApp();

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
        () => {}
      );
  }


  ambientEl.addEventListener(
    'ended',
    () => {

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
    () => {

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
  // FULLSCREEN
  // =========================================================

  if (
    fsBtn
  ){

    fsBtn.addEventListener(
      'click',
      async () => {

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
  // GATE
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
            .padStart(
              2,
              '0'
            )
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

      navigator
        .serviceWorker
        .register(
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
      stored === PASSPHRASE_HASH
    ){

      okGate();

      return;

    }


    gate.style.display =
      'flex';
  }


  gateBtn.addEventListener(
    'click',
    async () => {

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
        hash === target
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
    event => {

      if (
        event.key === 'Enter'
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
    () => {

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
    event => {

      event.preventDefault();


      deferredPrompt =
        event;


      maybeShowInstallBanner();

    }
  );


  btnInstall?.addEventListener(
    'click',
    async () => {

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
        choice.outcome === 'accepted'
      ){

        hideBanner(
          true
        );

      }

    }
  );


  btnInstallClose?.addEventListener(
    'click',
    () => {

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

      return;

    }


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


  // =========================================================
  // INITIALISATION
  // =========================================================

  function init(){

    /*
      On construit immédiatement
      les 8 boutons.
    */

    buildInstabilityButtons();


    /*
      4 joueurs fixes.
    */

    state.players =
      FIXED_PLAYERS;


    /*
      Monde automatiquement dérivé
      de l'Instabilité.
    */

    updateWorld();


    /*
      Mot de passe playtest.
    */

    checkGate();


    /*
      Journal.
    */

    renderHistory();


    /*
      Interface.
    */

    render();


    /*
      Effets passifs.
    */

    schedulePassive();


    /*
      Musique éventuellement
      déjà activée.
    */

    if (
      state.musicOn
    ){

      playAmbientCurrent();

    }


    /*
      Anti-veille.
    */

    requestWakeLock();


    /*
      Installation PWA.
    */

    maybeShowInstallBanner();

  }


  document.addEventListener(
    'DOMContentLoaded',
    init
  );

})();
