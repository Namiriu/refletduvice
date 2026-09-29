(() => {
  'use strict';

  // ---------- Configuration ----------
  const STEPS = [5, 10, 15, 20];
  const THRESHOLD = 50;
  const VERSION = 'v0.8.0 Playtest';
  const AMBIENT_VOLUME = 0.55;
  const LSK = key => `jds_${key}`;
  const REDUCED_MOTION =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const PASSPHRASE_HASH =
    'sha256:779d99b88c773f38617d286974f7882cbbc7f91781ef98287c55a5e89ea09e9f';

  const GATE_KEY = 'playtest_gate_hash';

  // ---------- États visuels du masque ----------
  const MASK_STATES = [
    { min: 0,  src: 'img/masque0.png' },
    { min: 15, src: 'img/masque15.png' },
    { min: 25, src: 'img/masque25.png' },
    { min: 40, src: 'img/masque40.png' },
    { min: 50, src: 'img/masque50.png' },
    { min: 65, src: 'img/masque65.png' },
    { min: 75, src: 'img/masque75.png' },
    { min: 90, src: 'img/masque90.png' }
  ];

  const MAJOR_MASK_STATES = new Set([25, 50, 75]);

  const HAUNT = {
    perClickProb: 0.14,
    passiveEvery: [38000, 68000],
    volume: 0.9,
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
      'audio/sounds/wood_creak_single.mp3'
    ]
  };

  const VOICES = {
    enter: 'audio/voice_enter_reflet.wav',
    exit: 'audio/voice_return_normal.mp3'
  };

  // ---------- DOM ----------
  const $ = id => document.getElementById(id);

  const els = {
    appMain: $('appMain'),
    percent: $('percent'),
    subjectId: $('subjectId'),
    instabilityButtons: $('instabilityButtons'),

    maskContainer: $('maskContainer'),
    maskImage: $('maskImage'),
    maskImageNext: $('maskImageNext'),
    maskAura: $('maskAura'),

    vignette: $('vignette'),
    fxFlash: $('fxFlash'),
    fxBlack: $('fxBlack'),
    alert: $('alert'),
    alertText: $('alertText'),

    btnJournal: $('btnJournal'),
    journalModal: $('journalModal'),
    historyList: $('historyList'),
    journalClose: $('journalClose'),

    audioToggle: $('audioToggle'),
    fsToggle: $('fsToggle'),
    ambient: $('ambient'),
    ritualAudio: $('ritualAudio'),
    campAudio: $('campAudio'),

    btnRitual: $('btnRitual'),
    btnRitualHelp: $('btnRitualHelp'),
    ritualInfo: $('ritualInfo'),

    btnCamp: $('btnCamp'),
    btnCampHelp: $('btnCampHelp'),
    campInfo: $('campInfo'),

    btnNew: $('btnNew'),

    actionModal: $('actionModal'),
    actionModalTitle: $('actionModalTitle'),
    actionModalText: $('actionModalText'),
    actionModalYes: $('actionModalYes'),
    actionModalNo: $('actionModalNo'),
    actionModalClose: $('actionModalClose'),

    gameover: $('gameover'),
    goYes: $('goYes'),
    goNo: $('goNo'),

    gate: $('gate'),
    gateInput: $('gateInput'),
    gateBtn: $('gateBtn'),
    gateError: $('gateError'),

    installBanner: $('installBanner'),
    installText: $('installText'),
    installBtn: $('installBtn'),
    installClose: $('installClose'),

    version: $('version')
  };

  // ---------- Utilitaires / état ----------
  const clamp = (n, min, max) =>
    Math.min(max, Math.max(min, n));

  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  function readInt(key, fallback) {
    const value =
      Number.parseInt(
        localStorage.getItem(LSK(key)),
        10
      );

    return Number.isFinite(value)
      ? value
      : fallback;
  }

  function readBool(key, fallback) {
    const value =
      localStorage.getItem(LSK(key));

    if (value === null) return fallback;

    return value === 'true'
      || value === '1';
  }

  const state = {
    value:
      clamp(
        readInt('instability', 0),
        0,
        100
      ),

    subjectNumber:
      Math.max(
        1,
        readInt('subjectNumber', 1)
      ),

    musicOn:
      readBool('musicOn', false),

    ritualUsed:
      clamp(
        readInt('ritualUsed', 0),
        0,
        2
      ),

    campLeft:
      clamp(
        readInt('campLeft', 2),
        0,
        2
      )
  };

  let history = [];
  let pendingAction = null;

  let gameOverShown = false;
  let alertTimer = null;
  let passiveTimer = null;
  let maskDisturbanceTimer = null;
  let maskTransitionTimer = null;
  let maskReactionTimer = null;

  let wakeLock = null;
  let appStarted = false;
  let specialAudioActive = false;
  let deferredInstallPrompt = null;

  let maskInitialized = false;
  let currentMaskMin = null;
  let pendingMaskMin = null;
  let maskRequestToken = 0;

  const preloadedMasks = new Map();

  const worldFromValue = value =>
    value >= THRESHOLD
      ? 'reflet'
      : 'normal';

  const isReflet = () =>
    worldFromValue(state.value)
      === 'reflet';

  function save() {
    localStorage.setItem(
      LSK('instability'),
      String(state.value)
    );

    localStorage.setItem(
      LSK('world'),
      worldFromValue(state.value)
    );

    localStorage.setItem(
      LSK('musicOn'),
      String(state.musicOn)
    );

    localStorage.setItem(
      LSK('subjectNumber'),
      String(state.subjectNumber)
    );

    localStorage.setItem(
      LSK('ritualUsed'),
      String(state.ritualUsed)
    );

    localStorage.setItem(
      LSK('campLeft'),
      String(state.campLeft)
    );
  }

  // =========================================================
  // MASQUES V0.8
  // =========================================================

  function getMaskState(value) {
    return (
      [...MASK_STATES]
        .reverse()
        .find(mask => value >= mask.min)
      || MASK_STATES[0]
    );
  }

  /*
    On charge les 8 PNG dès le lancement afin que
    les changements de masque soient instantanés.
  */
  function preloadMasks() {
    for (const mask of MASK_STATES) {
      const img = new Image();

      img.src = mask.src;

      preloadedMasks.set(
        mask.min,
        img
      );
    }
  }

  /*
    Termine immédiatement une transition encore en cours.
    Utile si plusieurs boutons sont pressés rapidement.
  */
  function commitPendingMask() {
    if (pendingMaskMin === null) {
      return;
    }

    const mask =
      MASK_STATES.find(
        item =>
          item.min === pendingMaskMin
      );

    if (mask) {
      els.maskImage.src =
        mask.src;
    }

    els.maskContainer
      .classList
      .remove('mask-transition');

    currentMaskMin =
      pendingMaskMin;

    pendingMaskMin =
      null;

    clearTimeout(
      maskTransitionTimer
    );

    maskTransitionTimer =
      null;
  }

  /*
    Petite réaction lorsque le masque change réellement
    d'état.

    25 / 50 / 75 sont volontairement plus marqués.
  */
  function reactMaskToEvolution(targetMin) {
    if (REDUCED_MOTION) return;

    clearTimeout(
      maskReactionTimer
    );

    els.maskContainer
      .classList
      .remove(
        'mask-evolve',
        'mask-major'
      );

    void els.maskContainer.offsetWidth;

    const reactionClass =
      MAJOR_MASK_STATES.has(targetMin)
        ? 'mask-major'
        : 'mask-evolve';

    els.maskContainer
      .classList
      .add(reactionClass);

    maskReactionTimer =
      setTimeout(
        () => {
          els.maskContainer
            .classList
            .remove(
              'mask-evolve',
              'mask-major'
            );
        },

        reactionClass === 'mask-major'
          ? 760
          : 560
      );
  }

  /*
    Fondu entre les deux images superposées.
  */
  function startMaskTransition(target) {
    /*
      Premier affichage :
      aucun fondu inutile au démarrage.
    */
    if (
      !maskInitialized
      || REDUCED_MOTION
    ) {
      els.maskImage.src =
        target.src;

      els.maskImageNext.src =
        target.src;

      els.maskContainer
        .classList
        .remove('mask-transition');

      currentMaskMin =
        target.min;

      pendingMaskMin =
        null;

      maskInitialized =
        true;

      return;
    }

    if (
      target.min === currentMaskMin
      || target.min === pendingMaskMin
    ) {
      return;
    }

    /*
      Si une transition est encore en cours,
      on la finalise proprement.
    */
    if (pendingMaskMin !== null) {
      commitPendingMask();
    }

    const requestToken =
      ++maskRequestToken;

    const preloaded =
      preloadedMasks.get(
        target.min
      );

    els.maskImageNext.src =
      target.src;

    const begin = () => {
      /*
        Empêche une ancienne image chargée tardivement
        de remplacer un masque plus récent.
      */
      if (
        requestToken
        !== maskRequestToken
      ) {
        return;
      }

      pendingMaskMin =
        target.min;

      els.maskContainer
        .classList
        .remove('mask-transition');

      void els.maskContainer.offsetWidth;

      els.maskContainer
        .classList
        .add('mask-transition');

      reactMaskToEvolution(
        target.min
      );

      clearTimeout(
        maskTransitionTimer
      );

      maskTransitionTimer =
        setTimeout(
          commitPendingMask,
          460
        );
    };

    if (
      preloaded?.complete
      && preloaded.naturalWidth > 0
    ) {
      begin();
    }

    else if (preloaded) {
      preloaded.addEventListener(
        'load',
        begin,
        { once: true }
      );

      preloaded.addEventListener(
        'error',
        begin,
        { once: true }
      );
    }

    else {
      begin();
    }
  }

  function updateMask() {
    startMaskTransition(
      getMaskState(state.value)
    );

    updateMaskAtmosphere();
  }

  /*
    Plus l'Instabilité monte, plus le masque et
    son environnement deviennent subtilement vivants.
  */
  function updateMaskAtmosphere() {
    const value =
      state.value;

    const stage =
      els.maskContainer;

    /*
      À partir de 65 %, le masque "respire"
      presque imperceptiblement.
    */
    stage.classList.toggle(
      'mask-breathe',
      value >= 65
      && !REDUCED_MOTION
    );

    /*
      Dès 75 %, une aura rouge lente commence.
    */
    stage.classList.toggle(
      'mask-red',
      value >= 75
      && !REDUCED_MOTION
    );

    stage.classList.toggle(
      'mask-critical',
      value >= 90
    );

    /*
      Entre 50 et 75 % :
      apparition graduelle de l'aura,
      avant sa pulsation réelle.
    */
    if (
      value >= 50
      && value < 75
    ) {
      const t =
        (value - 50) / 25;

      els.maskAura.style.opacity =
        String(
          0.08 + t * 0.22
        );

      els.maskAura.style.transform =
        `scale(${0.88 + t * 0.08})`;
    }

    else {
      els.maskAura.style.opacity =
        '';

      els.maskAura.style.transform =
        '';
    }

    /*
      Vignette progressive.
      Elle reste volontairement très faible à 65 %,
      puis devient réellement perceptible après 75 %.
    */
    if (value < 65) {
      els.vignette.style.opacity =
        '0';
    }

    else if (value < 75) {
      els.vignette.style.opacity =
        String(
          0.08
          + (
            (value - 65) / 10
          ) * 0.10
        );
    }

    else if (value < 90) {
      els.vignette.style.opacity =
        String(
          0.18
          + (
            (value - 75) / 15
          ) * 0.22
        );
    }

    else {
      els.vignette.style.opacity =
        String(
          Math.min(
            0.72,
            0.45
            + (
              (value - 90) / 10
            ) * 0.27
          )
        );
    }

    /*
      Même le pourcentage commence légèrement
      à changer de caractère à forte Instabilité.
    */
    if (value < 75) {
      els.percent.style.color =
        '';

      els.percent.style.textShadow =
        '';
    }

    else if (value < 90) {
      els.percent.style.color =
        '#ead7d8';

      els.percent.style.textShadow =
        '0 0 12px rgba(125,10,15,.18)';
    }

    else {
      els.percent.style.color =
        '#efc6c8';

      els.percent.style.textShadow =
        '0 0 16px rgba(160,14,20,.38)';
    }
  }

  /*
    Petit glitch du masque seulement.
    Jamais l'interface entière.
  */
  function triggerMaskGlitch() {
    if (
      REDUCED_MOTION
      || state.value < 65
      || !isPartieTabActive()
    ) {
      return;
    }

    if (
      specialAudioActive
      || anyBlockingModalOpen()
    ) {
      return;
    }

    els.maskContainer
      .classList
      .remove('mask-glitch');

    void els.maskContainer.offsetWidth;

    els.maskContainer
      .classList
      .add('mask-glitch');

    setTimeout(
      () => {
        els.maskContainer
          .classList
          .remove('mask-glitch');
      },
      220
    );
  }

  /*
    Les glitches sont volontairement rares
    et deviennent seulement plus probables
    lorsque la jauge approche de la rupture.
  */
  function scheduleMaskDisturbance() {
    clearTimeout(
      maskDisturbanceTimer
    );

    let min = 26000;
    let max = 52000;

    if (state.value >= 90) {
      [min, max] =
        [11000, 26000];
    }

    else if (state.value >= 75) {
      [min, max] =
        [16000, 36000];
    }

    else if (state.value >= 65) {
      [min, max] =
        [22000, 46000];
    }

    maskDisturbanceTimer =
      setTimeout(
        () => {
          if (state.value >= 65) {
            const chance =
              state.value >= 90
                ? 0.62
                : state.value >= 75
                  ? 0.42
                  : 0.24;

            if (
              Math.random()
              < chance
            ) {
              triggerMaskGlitch();
            }
          }

          scheduleMaskDisturbance();
        },

        randomBetween(
          min,
          max
        )
      );
  }

  // =========================================================
  // BOUTONS D'INSTABILITÉ
  // =========================================================

  function buildInstabilityButtons() {
    els.instabilityButtons.innerHTML =
      '';

    for (const step of STEPS) {
      for (
        const delta
        of [-step, step]
      ) {
        const minus =
          delta < 0;

        const btn =
          document.createElement('button');

        btn.type =
          'button';

        btn.className =
          'instability-btn';

        btn.dataset.delta =
          String(delta);

        btn.setAttribute(
          'aria-label',

          `${minus
            ? 'Réduire'
            : 'Augmenter'
          } l'instabilité de ${step} %`
        );

        const img =
          document.createElement('img');

        img.src =
          `img/btn_${
            minus
              ? 'moins'
              : 'plus'
          }${step}.png`;

        img.alt =
          `${minus
            ? '−'
            : '+'
          }${step} %`;

        btn.appendChild(img);

        btn.addEventListener(
          'click',
          () => {
            applyInstabilityDelta(
              delta,
              {
                source:
                  'Ajustement manuel',

                haunt:
                  true
              }
            );
          }
        );

        els.instabilityButtons
          .appendChild(btn);
      }
    }
  }

  // =========================================================
  // RENDU
  // =========================================================

  function render() {
    els.percent.textContent =
      `${state.value}%`;

    els.subjectId.textContent =
      `SUJET #${String(
        state.subjectNumber
      ).padStart(2, '0')}`;

    els.ritualInfo.textContent =
      `Restants : ${
        2 - state.ritualUsed
      }/2`;

    els.campInfo.textContent =
      `Restants : ${
        state.campLeft
      }/2`;

    const gameOver =
      state.value >= 100;

    els.btnRitual.disabled =
      !isReflet()
      || state.ritualUsed >= 2
      || gameOver;

    els.btnCamp.disabled =
      state.campLeft <= 0
      || gameOver;

    els.instabilityButtons
      .querySelectorAll(
        '.instability-btn'
      )
      .forEach(btn => {
        const delta =
          Number(
            btn.dataset.delta
          );

        btn.disabled =
          gameOver
          || (
            delta < 0
            && state.value <= 0
          )
          || (
            delta > 0
            && state.value >= 100
          );
      });

    els.audioToggle.textContent =
      `MUSIQUE ${
        state.musicOn
          ? 'ON'
          : 'OFF'
      }`;

    els.audioToggle.setAttribute(
      'aria-pressed',
      String(state.musicOn)
    );

    updateMask();
    updateFullscreenButton();
    save();
  }

  // =========================================================
  // JOURNAL
  // =========================================================

  function addHistory(
    delta,
    source
  ) {
    if (!delta) return;

    const sign =
      delta > 0
        ? '+'
        : '−';

    const time =
      new Date()
        .toLocaleTimeString(
          'fr-FR',
          {
            hour: '2-digit',
            minute: '2-digit'
          }
        );

    history.unshift({
      time,
      source,

      delta:
        `${sign}${Math.abs(delta)} %`,

      value:
        state.value
    });

    if (
      history.length > 50
    ) {
      history.length =
        50;
    }
  }

  function renderHistory() {
    els.historyList.innerHTML =
      '';

    if (!history.length) {
      const li =
        document.createElement('li');

      li.className =
        'journal-empty';

      li.textContent =
        'Aucune modification pour le moment.';

      els.historyList
        .appendChild(li);

      return;
    }

    for (
      const item
      of history
    ) {
      const li =
        document.createElement('li');

      li.textContent =
        `${item.time} — ${item.source} : ${item.delta} → ${item.value} %`;

      els.historyList
        .appendChild(li);
    }
  }

  function openJournal() {
    renderHistory();

    els.journalModal
      .classList
      .add('show');

    els.journalClose.focus();
  }

  function closeJournal() {
    els.journalModal
      .classList
      .remove('show');
  }

  // =========================================================
  // MODALE GÉNÉRIQUE
  // =========================================================

  function showInfo(
    title,
    text
  ) {
    pendingAction =
      null;

    els.actionModalTitle.textContent =
      title;

    els.actionModalText.textContent =
      text;

    els.actionModalYes
      .classList
      .add('hidden');

    els.actionModalNo
      .classList
      .add('hidden');

    els.actionModalClose
      .classList
      .remove('hidden');

    els.actionModal
      .classList
      .add('show');

    els.actionModalClose
      .focus();
  }

  function showConfirm(
    title,
    text,
    onYes
  ) {
    pendingAction =
      onYes;

    els.actionModalTitle.textContent =
      title;

    els.actionModalText.textContent =
      text;

    els.actionModalYes
      .classList
      .remove('hidden');

    els.actionModalNo
      .classList
      .remove('hidden');

    els.actionModalClose
      .classList
      .add('hidden');

    els.actionModal
      .classList
      .add('show');

    els.actionModalYes
      .focus();
  }

  function closeActionModal() {
    pendingAction =
      null;

    els.actionModal
      .classList
      .remove('show');
  }

  function anyBlockingModalOpen() {
    return (
      els.gate
        .classList
        .contains('show')
      ||
      els.actionModal
        .classList
        .contains('show')
      ||
      els.journalModal
        .classList
        .contains('show')
      ||
      els.gameover
        .classList
        .contains('show')
      ||
      els.alert
        .classList
        .contains('show')
    );
  }

  // =========================================================
  // INSTABILITÉ
  // =========================================================

  function applyInstabilityDelta(
    delta,
    {
      source = 'Ajustement',
      haunt = false
    } = {}
  ) {
    if (
      state.value >= 100
      && delta > 0
    ) {
      return {
        actual: 0,
        gameOver: true
      };
    }

    const before =
      state.value;

    state.value =
      clamp(
        before + delta,
        0,
        100
      );

    const actual =
      state.value - before;

    if (actual) {
      addHistory(
        actual,
        source
      );

      handleThresholdTransition(
        before,
        state.value
      );

      microEffect();
    }

    render();

    const gameOver =
      checkGameOver();

    if (
      haunt
      && !gameOver
    ) {
      maybeHaunt();
    }

    return {
      actual,
      gameOver
    };
  }

  function handleThresholdTransition(
    before,
    after
  ) {
    if (
      before < THRESHOLD
      && after >= THRESHOLD
    ) {
      showThresholdAlert(
        'reflet',
        'Vous basculez dans le Reflet du vice',
        VOICES.enter
      );
    }

    else if (
      before >= THRESHOLD
      && after < THRESHOLD
    ) {
      showThresholdAlert(
        'normal',
        'Vous reprenez pied dans le monde normal',
        VOICES.exit
      );
    }
  }

  function showThresholdAlert(
    kind,
    text,
    voicePath
  ) {
    clearTimeout(
      alertTimer
    );

    els.alert.className =
      `threshold-alert ${kind}`;

    els.alertText.textContent =
      text;

    els.alert.style.zIndex =
      '10080';

    els.alert
      .classList
      .add('show');

    els.alert.setAttribute(
      'aria-hidden',
      'false'
    );

    playOneShot(
      voicePath,
      1
    );

    alertTimer =
      setTimeout(
        () => {
          els.alert
            .classList
            .remove('show');

          els.alert.setAttribute(
            'aria-hidden',
            'true'
          );

          setTimeout(
            () => {
              els.alert.style.zIndex =
                '';
            },
            850
          );
        },
        5000
      );
  }

  // =========================================================
  // EFFETS VISUELS GLOBAUX
  // =========================================================

  function microEffect() {
    if (
      REDUCED_MOTION
      || state.value < 60
      || state.value >= 90
    ) {
      return;
    }

    els.appMain
      .classList
      .remove(
        'fx-shake',
        'fx-blur'
      );

    void els.appMain.offsetWidth;

    els.appMain
      .classList
      .add('fx-shake');

    if (
      Math.random() < 0.32
    ) {
      els.appMain
        .classList
        .add('fx-blur');
    }

    setTimeout(
      () => {
        els.appMain
          .classList
          .remove(
            'fx-shake',
            'fx-blur'
          );
      },
      420
    );
  }

  // =========================================================
  // PROFANATION DE LA CHAIR
  // =========================================================

  const RITUAL_HELP =
`Dans le Reflet du Vice, rejoignez une Horloge pour ramener l’un de vos compagnons.

2 utilisations maximum par partie.

Chaque survivant perd 1 PV et l’Instabilité Mentale augmente de 10 %.

Le personnage ressuscité revient avec 3 PV, ainsi qu’avec l’équipement qu’il possédait encore lors de sa mort. Les objets déjà récupérés par ses compagnons ne lui sont pas rendus.

Si un survivant n’a plus qu’1 PV au moment du rituel, il perd ce dernier PV et meurt. Le rituel est néanmoins accompli normalement.`;

  function requestRitual() {
    if (
      !isReflet()
      || state.ritualUsed >= 2
      || state.value >= 100
    ) {
      return;
    }

    showConfirm(
      'Profanation de la chair',

`L’Horloge pulse à contretemps. Pour rappeler un mort parmi les vivants, ceux qui restent devront offrir une part de leur propre chair.

Accomplir le rituel ?`,

      performRitual
    );
  }

  function performRitual() {
    if (
      !isReflet()
      || state.ritualUsed >= 2
      || state.value >= 100
    ) {
      return;
    }

    state.ritualUsed +=
      1;

    save();
    render();

    playSpecialAudio(
      els.ritualAudio,
      1
    );

    const result =
      applyInstabilityDelta(
        10,
        {
          source:
            'Profanation de la chair',

          haunt:
            false
        }
      );

    /*
      À 100 %, le Game Over
      prend la priorité.
    */
    if (
      result.gameOver
    ) {
      return;
    }

    showInfo(
      'Profanation de la chair',

`Le rituel est accompli.

L’Horloge s’immobilise dans un craquement sec.

Chaque survivant perd 1 PV.

Ramenez un allié de votre choix à 3 PV.`
    );
  }

  // =========================================================
  // CAMP DE FORTUNE
  // =========================================================

  const CAMP_HELP =
`2 utilisations maximum par partie.

Son déploiement doit être approuvé à la majorité du groupe.

Monde normal : chaque personnage encore en vie soigne 2 blessures et l’Instabilité Mentale diminue de 10 %.

Reflet du Vice : aucun soin ; l’Instabilité Mentale diminue de 15 %.`;

  function requestCamp() {
    if (
      state.campLeft <= 0
      || state.value >= 100
    ) {
      return;
    }

    showConfirm(
      'Camp de fortune',

`Le groupe marque une halte. Quelques instants de répit pourraient suffire à reprendre ses esprits… à condition que le groupe accepte de ralentir.

Le déploiement du camp a-t-il été approuvé à la majorité ?

Souhaitez-vous déployer le camp maintenant ?`,

      performCamp
    );
  }

  function performCamp() {
    if (
      state.campLeft <= 0
      || state.value >= 100
    ) {
      return;
    }

    /*
      Le monde est mémorisé AVANT
      la baisse d'Instabilité.
    */
    const wasReflet =
      isReflet();

    state.campLeft -=
      1;

    save();
    render();

    playSpecialAudio(
      els.campAudio,
      0.95
    );

    applyInstabilityDelta(
      wasReflet
        ? -15
        : -10,
      {
        source:
          'Camp de fortune',

        haunt:
          false
      }
    );

    if (wasReflet) {
      showInfo(
        'Camp de fortune',

`Le camp est établi… mais quelque chose cloche.

Le feu peine à prendre. Les ombres semblent plus proches qu’avant. Aucun de vous ne parvient réellement à se reposer.

Instabilité Mentale réduite de 15 %.

Aucun soin n’est accordé dans le Reflet du Vice.`
      );
    }

    else {
      showInfo(
        'Camp de fortune',

`Le camp est établi.

Pour quelques instants, le silence semble presque rassurant. Les corps récupèrent, les esprits se relâchent.

Instabilité Mentale réduite de 10 %.

Chaque personnage encore en vie soigne 2 blessures.`
      );
    }
  }

  // =========================================================
  // NOUVELLE PARTIE
  // =========================================================

  function requestNewGame() {
    showConfirm(
      'Nouvelle partie',

`Démarrer une nouvelle partie ?

L’Instabilité, le Camp de fortune, la Profanation de la chair et le Journal seront réinitialisés.`,

      newGame
    );
  }

  function newGame() {
    stopSpecialAudio(
      els.ritualAudio
    );

    stopSpecialAudio(
      els.campAudio
    );

    specialAudioActive =
      false;

    state.value =
      0;

    state.ritualUsed =
      0;

    state.campLeft =
      2;

    state.subjectNumber +=
      1;

    history =
      [];

    gameOverShown =
      false;

    if (state.musicOn) {
      els.ambient.volume =
        AMBIENT_VOLUME;
    }

    closeActionModal();

    els.gameover
      .classList
      .remove('show');

    save();
    render();
  }

  // =========================================================
  // AUDIO
  // =========================================================

  function playOneShot(
    src,
    volume = 1
  ) {
    const audio =
      new Audio(src);

    audio.volume =
      volume;

    audio
      .play()
      .catch(() => {});

    return audio;
  }

  function stopSpecialAudio(
    audio
  ) {
    if (!audio) return;

    audio.pause();

    try {
      audio.currentTime =
        0;
    }

    catch (_) {}
  }

  function playSpecialAudio(
    audio,
    volume = 1
  ) {
    if (!audio) return;

    stopSpecialAudio(
      els.ritualAudio
    );

    stopSpecialAudio(
      els.campAudio
    );

    specialAudioActive =
      true;

    const shouldDuck =
      state.musicOn
      && !els.ambient.paused;

    if (shouldDuck) {
      els.ambient.volume =
        0.06;
    }

    audio.volume =
      volume;

    const restore =
      () => {
        specialAudioActive =
          false;

        if (
          state.musicOn
        ) {
          els.ambient.volume =
            AMBIENT_VOLUME;
        }
      };

    audio.onended =
      restore;

    audio.onerror =
      restore;

    audio
      .play()
      .catch(restore);
  }

  async function setMusic(
    on
  ) {
    state.musicOn =
      on;

    save();

    if (on) {
      els.ambient.volume =
        AMBIENT_VOLUME;

      try {
        await els.ambient.play();
      }

      catch (_) {}
    }

    else {
      els.ambient.pause();
    }

    render();
  }

  function unlockAmbientOnce() {
    if (
      state.musicOn
      && els.ambient.paused
    ) {
      els.ambient.volume =
        AMBIENT_VOLUME;

      els.ambient
        .play()
        .catch(() => {});
    }
  }

  // =========================================================
  // EFFETS HANTÉS
  // =========================================================

  function flash(
    element,
    opacity,
    duration
  ) {
    element.style.opacity =
      String(opacity);

    setTimeout(
      () => {
        element.style.opacity =
          '0';
      },
      duration
    );
  }

  function hauntVisual() {
    const roll =
      Math.random();

    if (roll < 0.42) {
      flash(
        els.fxFlash,
        0.82,
        randomBetween(
          90,
          160
        )
      );
    }

    else if (roll < 0.82) {
      flash(
        els.fxBlack,
        0.75,
        randomBetween(
          200,
          480
        )
      );
    }

    else {
      flash(
        els.fxBlack,
        1,
        randomBetween(
          700,
          1100
        )
      );
    }
  }

  function playRandomHauntSfx() {
    const src =
      HAUNT.sfx[
        Math.floor(
          Math.random()
          * HAUNT.sfx.length
        )
      ];

    playOneShot(
      src,
      HAUNT.volume
    );
  }

  function maybeHaunt() {
    if (
      specialAudioActive
      || Math.random()
        >= HAUNT.perClickProb
    ) {
      return;
    }

    hauntVisual();

    if (
      Math.random()
      < 0.85
    ) {
      playRandomHauntSfx();
    }
  }

  function schedulePassiveHaunt() {
    clearTimeout(
      passiveTimer
    );

    passiveTimer =
      setTimeout(
        () => {
          if (
            !specialAudioActive
            && !els.gate
              .classList
              .contains('show')
            && state.value < 100
          ) {
            if (
              Math.random()
              < 0.60
            ) {
              playRandomHauntSfx();
            }

            else {
              flash(
                els.fxBlack,
                0.58,
                160
              );
            }
          }

          schedulePassiveHaunt();
        },

        randomBetween(
          ...HAUNT.passiveEvery
        )
      );
  }

  // =========================================================
  // FIN DE PARTIE
  // =========================================================

  function checkGameOver() {
    if (
      state.value < 100
    ) {
      return false;
    }

    if (!gameOverShown) {
      gameOverShown =
        true;

      closeActionModal();
      closeJournal();

      els.gameover
        .classList
        .add('show');

      els.goYes.focus();
    }

    return true;
  }

  async function tryQuitApp() {
    els.ambient.pause();

    stopSpecialAudio(
      els.ritualAudio
    );

    stopSpecialAudio(
      els.campAudio
    );

    try {
      if (
        document.fullscreenElement
      ) {
        await document
          .exitFullscreen();
      }
    }

    catch (_) {}

    if (
      window.history.length > 1
    ) {
      window.history.back();
    }

    else {
      window.close();
    }
  }

  // =========================================================
  // PLEIN ÉCRAN
  // =========================================================

  function updateFullscreenButton() {
    const active =
      Boolean(
        document.fullscreenElement
      );

    els.fsToggle.textContent =
      active
        ? 'Quitter plein écran'
        : 'Plein écran';

    els.fsToggle.setAttribute(
      'aria-pressed',
      String(active)
    );
  }

  async function toggleFullscreen() {
    try {
      if (
        document.fullscreenElement
      ) {
        await document
          .exitFullscreen();
      }

      else {
        await document
          .documentElement
          .requestFullscreen();
      }
    }

    catch (_) {}

    updateFullscreenButton();
  }

  // =========================================================
  // WAKE LOCK
  // =========================================================

  async function requestWakeLock() {
    if (
      !('wakeLock' in navigator)
      || document.visibilityState
        !== 'visible'
    ) {
      return;
    }

    try {
      wakeLock =
        await navigator
          .wakeLock
          .request('screen');
    }

    catch (_) {
      wakeLock =
        null;
    }
  }

  // =========================================================
  // ONGLETS
  // =========================================================

  function isPartieTabActive() {
    return (
      document
        .getElementById('tab-partie')
        ?.classList
        .contains('active')
      ?? true
    );
  }

  function setupTabs() {
    const buttons =
      [
        ...document
          .querySelectorAll(
            '.tab-btn'
          )
      ];

    const panels =
      [
        ...document
          .querySelectorAll(
            '.tab-panel'
          )
      ];

    for (
      const btn
      of buttons
    ) {
      btn.addEventListener(
        'click',
        () => {
          const target =
            btn.dataset.tab;

          for (
            const item
            of buttons
          ) {
            const active =
              item === btn;

            item.classList
              .toggle(
                'active',
                active
              );

            item.setAttribute(
              'aria-selected',
              String(active)
            );
          }

          for (
            const panel
            of panels
          ) {
            panel.classList
              .toggle(
                'active',
                panel.id
                === `tab-${target}`
              );
          }
        }
      );
    }
  }

  // =========================================================
  // PORTE D'ACCÈS PLAYTEST
  // =========================================================

  async function sha256Hex(
    message
  ) {
    const data =
      new TextEncoder()
        .encode(message);

    const hash =
      await crypto.subtle
        .digest(
          'SHA-256',
          data
        );

    return [
      ...new Uint8Array(hash)
    ]
      .map(
        byte =>
          byte
            .toString(16)
            .padStart(2, '0')
      )
      .join('');
  }

  async function submitGate() {
    const pass =
      els.gateInput.value;

    if (!pass) {
      els.gateError.textContent =
        'Entrez le mot de passe.';

      return;
    }

    try {
      const hash =
        `sha256:${
          await sha256Hex(pass)
        }`;

      if (
        hash
        !== PASSPHRASE_HASH
      ) {
        els.gateError.textContent =
          'Mot de passe incorrect.';

        els.gateInput.select();

        return;
      }

      localStorage.setItem(
        GATE_KEY,
        PASSPHRASE_HASH
      );

      els.gateError.textContent =
        '';

      els.gate
        .classList
        .remove('show');

      startApp();
    }

    catch (_) {
      els.gateError.textContent =
        'Impossible de vérifier le mot de passe sur cet appareil.';
    }
  }

  // =========================================================
  // INSTALLATION PWA
  // =========================================================

  function setupInstallBanner() {
    const params =
      new URLSearchParams(
        location.search
      );

    const requested =
      params.get('install')
        === '1';

    const standalone =
      matchMedia(
        '(display-mode: standalone)'
      ).matches
      || window.navigator
        .standalone === true;

    if (
      standalone
      || !requested
      || localStorage.getItem(
        'hideInstall'
      ) === '1'
    ) {
      return;
    }

    els.installBanner
      .classList
      .add('show');

    els.installBanner
      .setAttribute(
        'aria-hidden',
        'false'
      );

    window.addEventListener(
      'beforeinstallprompt',
      event => {
        event.preventDefault();

        deferredInstallPrompt =
          event;
      }
    );

    els.installBtn
      .addEventListener(
        'click',
        async () => {
          if (
            !deferredInstallPrompt
          ) {
            els.installText
              .textContent =
                'Utilisez le menu du navigateur pour installer l’application.';

            return;
          }

          deferredInstallPrompt
            .prompt();

          try {
            await deferredInstallPrompt
              .userChoice;
          }

          catch (_) {}

          deferredInstallPrompt =
            null;

          hideInstallBanner(
            false
          );
        }
      );

    els.installClose
      .addEventListener(
        'click',
        () =>
          hideInstallBanner(
            true
          )
      );
  }

  function hideInstallBanner(
    neverShowAgain
  ) {
    els.installBanner
      .classList
      .remove('show');

    els.installBanner
      .setAttribute(
        'aria-hidden',
        'true'
      );

    if (neverShowAgain) {
      localStorage.setItem(
        'hideInstall',
        '1'
      );
    }
  }

  // =========================================================
  // SERVICE WORKER
  // =========================================================

  function registerServiceWorker() {
    if (
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    navigator
      .serviceWorker
      .register(
        './service-worker.js'
      )
      .then(
        registration =>
          registration
            .update()
            .catch(() => {})
      )
      .catch(() => {});
  }

  // =========================================================
  // DÉMARRAGE
  // =========================================================

  function startApp() {
    if (appStarted) {
      return;
    }

    appStarted =
      true;

    registerServiceWorker();

    requestWakeLock();

    schedulePassiveHaunt();

    /*
      Nouveau en v0.8 :
      événements visuels rares du masque.
    */
    scheduleMaskDisturbance();

    if (state.musicOn) {
      setMusic(true);
    }

    if (
      state.value >= 100
    ) {
      checkGameOver();
    }
  }

  // =========================================================
  // ÉVÉNEMENTS
  // =========================================================

  function bindEvents() {
    // Journal
    els.btnJournal
      .addEventListener(
        'click',
        openJournal
      );

    els.journalClose
      .addEventListener(
        'click',
        closeJournal
      );

    els.journalModal
      .addEventListener(
        'click',
        event => {
          if (
            event.target
            === els.journalModal
          ) {
            closeJournal();
          }
        }
      );

    // Modale générique
    els.actionModalYes
      .addEventListener(
        'click',
        () => {
          const action =
            pendingAction;

          closeActionModal();

          if (action) {
            action();
          }
        }
      );

    els.actionModalNo
      .addEventListener(
        'click',
        closeActionModal
      );

    els.actionModalClose
      .addEventListener(
        'click',
        closeActionModal
      );

    els.actionModal
      .addEventListener(
        'click',
        event => {
          if (
            event.target
            === els.actionModal
          ) {
            closeActionModal();
          }
        }
      );

    // Profanation
    els.btnRitual
      .addEventListener(
        'click',
        requestRitual
      );

    els.btnRitualHelp
      .addEventListener(
        'click',
        () =>
          showInfo(
            'Profanation de la chair',
            RITUAL_HELP
          )
      );

    // Camp
    els.btnCamp
      .addEventListener(
        'click',
        requestCamp
      );

    els.btnCampHelp
      .addEventListener(
        'click',
        () =>
          showInfo(
            'Camp de fortune',
            CAMP_HELP
          )
      );

    // Nouvelle partie
    els.btnNew
      .addEventListener(
        'click',
        requestNewGame
      );

    // Musique
    els.audioToggle
      .addEventListener(
        'click',
        () =>
          setMusic(
            !state.musicOn
          )
      );

    // Plein écran
    els.fsToggle
      .addEventListener(
        'click',
        toggleFullscreen
      );

    document
      .addEventListener(
        'fullscreenchange',
        updateFullscreenButton
      );

    // Game Over
    els.goYes
      .addEventListener(
        'click',
        newGame
      );

    els.goNo
      .addEventListener(
        'click',
        tryQuitApp
      );

    // Gate
    els.gateBtn
      .addEventListener(
        'click',
        submitGate
      );

    els.gateInput
      .addEventListener(
        'keydown',
        event => {
          if (
            event.key
            === 'Enter'
          ) {
            submitGate();
          }
        }
      );

    els.gateInput
      .addEventListener(
        'input',
        () => {
          els.gateError
            .textContent =
              '';
        }
      );

    /*
      Si l'autoplay est bloqué,
      le premier toucher réessaie.
    */
    document
      .addEventListener(
        'pointerdown',
        unlockAmbientOnce,
        {
          once: true
        }
      );

    document
      .addEventListener(
        'visibilitychange',
        () => {
          if (
            document.visibilityState
            === 'visible'
          ) {
            requestWakeLock();
          }
        }
      );

    /*
      Échap ne ferme que les modales
      non critiques.
    */
    document
      .addEventListener(
        'keydown',
        event => {
          if (
            event.key
            !== 'Escape'
          ) {
            return;
          }

          if (
            els.actionModal
              .classList
              .contains('show')
          ) {
            closeActionModal();
          }

          else if (
            els.journalModal
              .classList
              .contains('show')
          ) {
            closeJournal();
          }
        }
      );
  }

  // =========================================================
  // INITIALISATION
  // =========================================================

  function init() {
    /*
      On commence par charger tous les masques.
    */
    preloadMasks();

    buildInstabilityButtons();

    setupTabs();

    bindEvents();

    setupInstallBanner();

    els.version.textContent =
      VERSION;

    els.ambient.volume =
      AMBIENT_VOLUME;

    /*
      Le bon masque est immédiatement sélectionné
      si une ancienne partie est restaurée.
    */
    render();

    if (
      localStorage.getItem(
        GATE_KEY
      ) === PASSPHRASE_HASH
    ) {
      els.gate
        .classList
        .remove('show');

      startApp();
    }

    else {
      els.gate
        .classList
        .add('show');

      setTimeout(
        () =>
          els.gateInput.focus(),
        0
      );
    }
  }

  init();
})();
