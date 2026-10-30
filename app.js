(() => {
  'use strict';

  // =========================================================
  // CONFIGURATION
  // =========================================================

  const STEPS = [5, 10, 15, 20];
  const THRESHOLD = 50;
  const VERSION = 'v0.9.8 Événements (test)';
  const AMBIENT_VOLUME = 0.55;
  const DUCK_VOLUME = 0.06;
  const BESTIAIRE_AMBIENT_VOLUME = 0.30;
  const BESTIAIRE_VIDEO_VOLUME = 0.18;
  const BESTIAIRE_NARRATION_VOLUME = 0.28;
  const AUDIO_FADE_MS = 900;
  const AUDIO_SWITCH_FADE_MS = 400;
  const LSK = key => `jds_${key}`;
  const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const PASSPHRASE_HASH =
    'sha256:779d99b88c773f38617d286974f7882cbbc7f91781ef98287c55a5e89ea09e9f';
  const GATE_KEY = 'playtest_gate_hash';

  const BESTIAIRE_PATHS = {
    image: 'bestiaire/images/',
    video: 'bestiaire/videos/',
    audio: 'bestiaire/audio/'
  };

  const BESTIAIRE_RUNTIME_CACHE = 'instability-runtime-v1';

  const MASK_STATES = [
    { min: 0, src: 'img/masque0.png' },
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

  // =========================================================
  // DOM
  // =========================================================

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
bestiaireAmbient: $('bestiaireAmbient'),
ritualAudio: $('ritualAudio'),
campAudio: $('campAudio'),

    btnRitual: $('btnRitual'),
    btnRitualHelp: $('btnRitualHelp'),
    ritualInfo: $('ritualInfo'),

    btnCamp: $('btnCamp'),
    btnCampHelp: $('btnCampHelp'),
    campInfo: $('campInfo'),

    btnNew: $('btnNew'),
    eventGameCard: $('eventGameCard'),
    btnStartEvents: $('btnStartEvents'),
    btnPlayers: $('btnPlayers'),
    btnTestMaskEvent: $('btnTestMaskEvent'),
    testMaskEventSelect: $('testMaskEventSelect'),
    eventGameStatus: $('eventGameStatus'),
    playersModal: $('playersModal'),
    playersClose: $('playersClose'),
    eventPlayersList: $('eventPlayersList'),
    maskEventOverlay: $('maskEventOverlay'),
    maskEventPortrait: $('maskEventPortrait'),
    maskEventTitle: $('maskEventTitle'),
    maskEventStatus: $('maskEventStatus'),
    maskEventPlay: $('maskEventPlay'),
    maskIntroSkip: $('maskIntroSkip'),
    maskEventResult: $('maskEventResult'),
    maskEventEffect: $('maskEventEffect'),
    maskEventInventoryLabel: $('maskEventInventoryLabel'),
    maskEventChoices: $('maskEventChoices'),
    maskChoiceSelf: $('maskChoiceSelf'),
    maskChoiceGroup: $('maskChoiceGroup'),
    maskEventDone: $('maskEventDone'),

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

    btnRecenser: $('btnRecenser'),
    btnBestiaireHelp: $('btnBestiaireHelp'),
    recensementPanel: $('recensementPanel'),
    recensementForm: $('recensementForm'),
    recensementInput: $('recensementInput'),
    recensementError: $('recensementError'),
    bestiaireSearch: $('bestiaireSearch'),
    bestiaireMeta: $('bestiaireMeta'),
    bestiaireList: $('bestiaireList'),
    bestiaireEmpty: $('bestiaireEmpty'),

   dossierModal: $('dossierModal'),
dossierTitle: $('dossierTitle'),
dossierLore: $('dossierLore'),
dossierClose: $('dossierClose'),
bestiaireNarration: $('bestiaireNarration'),

    version: $('version')
  };

  // =========================================================
  // ÉTAT / UTILITAIRES
  // =========================================================

  const clamp = (n, min, max) =>
    Math.min(max, Math.max(min, n));

  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  function readInt(key, fallback) {
    const value = Number.parseInt(localStorage.getItem(LSK(key)), 10);

    return Number.isFinite(value)
      ? value
      : fallback;
  }

  function readBool(key, fallback) {
    const value = localStorage.getItem(LSK(key));

    if (value === null) return fallback;

    return value === 'true'
      || value === '1';
  }

  const state = {
    value: clamp(readInt('instability', 0), 0, 100),

    subjectNumber: Math.max(
      1,
      readInt('subjectNumber', 1)
    ),

    musicOn: readBool('musicOn', false),

    ritualUsed: clamp(
      readInt('ritualUsed', 0),
      0,
      2
    ),

    campLeft: clamp(
      readInt('campLeft', 2),
      0,
      2
    )
  };


  // Archives permanentes, indépendantes du compteur de parties.
  const BESTIAIRE_UNLOCK_KEY = LSK('bestiaire_unlocked_v1');

  function loadBestiaireUnlocks() {
    try {
      const data = JSON.parse(localStorage.getItem(BESTIAIRE_UNLOCK_KEY) || '[]');
      return new Set(Array.isArray(data) ? data.filter(slug => typeof slug === 'string') : []);
    } catch (_) {
      return new Set();
    }
  }

  let unlockedCreatureSlugs = loadBestiaireUnlocks();

  function isCreatureUnlocked(creature) {
    return unlockedCreatureSlugs.has(creature.slug);
  }

  function normalizeCreatureName(text) {
    return String(text ?? '')
      .toLocaleLowerCase('fr-FR')
      .replace(/œ/g, 'oe')
      .replace(/æ/g, 'ae')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function creatureNameDistance(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const next = [i];
      for (let j = 1; j <= b.length; j++) {
        next[j] = Math.min(
          next[j - 1] + 1,
          previous[j] + 1,
          previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      previous = next;
    }
    return previous[b.length];
  }

  function matchRecensedCreature(input) {
    const enteredName = normalizeCreatureName(input);
    if (enteredName.length < 4 || enteredName.length > 80) return null;

    const creatures = getBestiaireData();
    const exact = creatures.filter(
      creature => normalizeCreatureName(creature.name) === enteredName
    );
    if (exact.length === 1) return { creature: exact[0], approximate: false };
    if (exact.length > 1) return null;

    const maximumErrors = enteredName.length <= 9
      ? 1
      : enteredName.length <= 20 ? 2 : 3;

    const matches = creatures
      .map(creature => ({
        creature,
        distance: creatureNameDistance(
          enteredName,
          normalizeCreatureName(creature.name)
        )
      }))
      .filter(match => match.distance <= maximumErrors);

    // Pas de suggestion ni de proposition arbitraire en cas d'ambiguïté.
    if (matches.length !== 1) return null;
    return { creature: matches[0].creature, approximate: true };
  }

  function unlockCreature(creature) {
    if (isCreatureUnlocked(creature)) {
      showInfo('Déjà recensée', 'Cette créature figure déjà dans vos archives.');
      return;
    }
    const next = new Set(unlockedCreatureSlugs);
    next.add(creature.slug);
    try {
      localStorage.setItem(BESTIAIRE_UNLOCK_KEY, JSON.stringify([...next]));
    } catch (_) {
      showInfo(
        'Sauvegarde impossible',
        'Le navigateur ne permet pas de conserver la découverte. Vérifiez le stockage local avant de réessayer.'
      );
      return;
    }
    unlockedCreatureSlugs = next;
    els.bestiaireSearch.value = '';
    els.recensementInput.value = '';
    els.recensementError.textContent = '';
    els.recensementPanel.classList.add('hidden');
    els.btnRecenser.setAttribute('aria-expanded', 'false');
    renderBestiaire('');
    showInfo(
      'Créature recensée',
      '« ' + creature.name + ' » est désormais accessible dans le Bestiaire.'
    );
  }

  function submitRecensement(event) {
    event.preventDefault();
    const found = matchRecensedCreature(els.recensementInput.value);
    if (!found) {
      els.recensementError.textContent =
        'Aucune correspondance certaine. Vérifiez le nom inscrit sur la carte.';
      return;
    }
    els.recensementError.textContent = '';
    if (isCreatureUnlocked(found.creature)) {
      showInfo('Déjà recensée', 'Cette créature figure déjà dans vos archives.');
      return;
    }
    if (found.approximate) {
      showConfirm(
        'Confirmer le recensement',
        'Vous avez saisi un nom approchant. S’agit-il bien de « '
          + found.creature.name + ' » ?',
        () => unlockCreature(found.creature)
      );
      return;
    }
    unlockCreature(found.creature);
  }

  function buildLockedCreatureEntry() {
    const entry = document.createElement('article');
    entry.className = 'creature-entry creature-locked';
    const label = document.createElement('div');
    label.className = 'creature-locked-label';
    label.textContent = '🔒 CRÉATURE NON RECENSÉE';
    entry.appendChild(label);
    return entry;
  }

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
  let bestiaireNarrationActive = false;
  let bestiaireVideoActive = false;
  let musicSyncToken = 0;
  let musicPlayBlocked = false;
  let deferredInstallPrompt = null;

  let maskInitialized = false;
  let currentMaskMin = null;
  let pendingMaskMin = null;
  let maskRequestToken = 0;

  const preloadedMasks = new Map();

  // Interventions : progression propre à la partie, distincte du Bestiaire.
  const AUDIO_EVENT_STORAGE = LSK('audio_events_session_v1');
  const EVENT_FIRST_DELAY = [5 * 60000, 9 * 60000];
  const MASK_INTRO_AUDIO = 'audio/events/masque/introduction/masque-000-presentation.mp3';
  const EVENT_NEXT_DELAY = [7 * 60000, 14 * 60000];
  const EVENT_RETRY_DELAY = 20000;
  const EVENT_TEST_MODE = new URLSearchParams(location.search).has('test-events');
  const AUDIO_EVENTS = [
    {
      id: 'masque-001',
      type: 'masque',
      title: 'LE COLLECTIONNEUR',
      audio: 'audio/events/masque/interventions/masque-001-collectionneur.mp3',
      target: 'joueur-vivant'
    },
    {
      id: 'masque-002',
      type: 'masque',
      title: 'UN ÉLAN DE GÉNÉROSITÉ',
      audio: 'audio/events/masque/interventions/masque-002-elan-de-generosite.mp3',
      target: 'joueur-vivant',
      minInstability: 5
    },
    {
      id: 'masque-003',
      type: 'masque',
      title: 'LE PRIX DU SACRIFICE',
      audio: 'audio/events/masque/interventions/masque-003-prix-du-sacrifice.mp3',
      target: 'joueur-vivant'
    }
  ];
  const eventSession = readAudioEventSession();
  let eventTimer = null;
  let eventDueAt = null;
  let currentMaskEvent = null;
  let eventAudioGapTimer = null;
  let maskClosingTimer = null;
  let maskDeferredOutcomeTimer = null;
  let maskEventToken = 0;


  let openCreatureSlug = null;
  let openCreatureEntry = null;
  let bestiaireMediaToken = 0;
let narrationLoadedUrl = null;
let activeNarrationCreature = null;
let activeStoryButton = null;
let activeStoryProgressFill = null;
let activeStoryTime = null;

  const worldFromValue = value =>
    value >= THRESHOLD
      ? 'reflet'
      : 'normal';

  const isReflet = () =>
    worldFromValue(state.value) === 'reflet';

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

  function normalizeSearch(text) {
    return String(text ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr-FR')
      .trim();
  }

  function formatTime(seconds) {
    if (
      !Number.isFinite(seconds)
      || seconds < 0
    ) {
      return '--:--';
    }

    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60);
    const secs = total % 60;

    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

const audioFadeStates =
  new WeakMap();

function fadeAudioVolume(
  audio,
  targetVolume,
  duration = AUDIO_FADE_MS
) {
  if (!audio) {
    return Promise.resolve();
  }

  const target =
    Math.max(
      0,
      Math.min(1, targetVolume)
    );

  const previous =
    audioFadeStates.get(audio);

  if (previous) {
    cancelAnimationFrame(
      previous.frame
    );

    previous.resolve();

    audioFadeStates.delete(
      audio
    );
  }

  const startVolume =
    audio.volume;

  if (
    duration <= 0
    || Math.abs(
      startVolume - target
    ) < 0.001
  ) {
    audio.volume =
      target;

    return Promise.resolve();
  }

  return new Promise(
    resolve => {
      const startedAt =
        performance.now();

      const fadeState = {
        frame: 0,
        resolve
      };

      const step =
        now => {
          const progress =
            Math.min(
              1,
              (
                now - startedAt
              ) / duration
            );

          audio.volume =
            startVolume
            + (
              target
              - startVolume
            ) * progress;

          if (
            progress >= 1
          ) {
            audio.volume =
              target;

            audioFadeStates.delete(
              audio
            );

            resolve();

            return;
          }

          fadeState.frame =
            requestAnimationFrame(
              step
            );
        };

      fadeState.frame =
        requestAnimationFrame(
          step
        );

      audioFadeStates.set(
        audio,
        fadeState
      );
    }
  );
}

function getBestiaireAmbientTargetVolume() {
  if (bestiaireNarrationActive) {
    return BESTIAIRE_NARRATION_VOLUME;
  }

  if (bestiaireVideoActive) {
    return BESTIAIRE_VIDEO_VOLUME;
  }

  return BESTIAIRE_AMBIENT_VOLUME;
}

function useOfflineBestiaireMusicFallback() {
  return (
    isBestiaireTabActive()
    && navigator.onLine === false
  );
}

function syncAmbientVolume() {
  if (!state.musicOn) {
    fadeAudioVolume(els.ambient, 0);
    fadeAudioVolume(els.bestiaireAmbient, 0);
    return;
  }

  const bestiaireActive =
    isBestiaireTabActive();

  const offlineFallback =
    useOfflineBestiaireMusicFallback();

  /*
   * BESTIAIRE
   *
   * En ligne :
   *   musique Bestiaire normale.
   *
   * Hors ligne :
   *   ambient_loop.mp3 prend le relais,
   *   avec exactement les mêmes volumes
   *   et le même ducking vidéo/narration.
   */
  if (bestiaireActive) {
    fadeAudioVolume(
      els.ambient,
      offlineFallback
        ? getBestiaireAmbientTargetVolume()
        : 0
    );

    fadeAudioVolume(
      els.bestiaireAmbient,
      offlineFallback
        ? 0
        : getBestiaireAmbientTargetVolume()
    );

    return;
  }

  /*
   * PARTIE / autres onglets
   */
  fadeAudioVolume(
    els.ambient,
    specialAudioActive
      ? DUCK_VOLUME
      : AMBIENT_VOLUME
  );

  fadeAudioVolume(
    els.bestiaireAmbient,
    0
  );
}

  // =========================================================
  // MASQUES
  // =========================================================

  function getMaskState(value) {
    return (
      [...MASK_STATES]
        .reverse()
        .find(mask => value >= mask.min)
      || MASK_STATES[0]
    );
  }

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

  function commitPendingMask() {
    if (pendingMaskMin === null) {
      return;
    }

    const mask = MASK_STATES.find(
      item => item.min === pendingMaskMin
    );

    if (mask) {
      els.maskImage.src = mask.src;
    }

    els.maskContainer
      .classList
      .remove('mask-transition');

    currentMaskMin = pendingMaskMin;
    pendingMaskMin = null;

    clearTimeout(maskTransitionTimer);

    maskTransitionTimer = null;
  }

  function reactMaskToEvolution(targetMin) {
    if (REDUCED_MOTION) return;

    clearTimeout(maskReactionTimer);

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

    maskReactionTimer = setTimeout(
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

  function startMaskTransition(target) {
    if (
      !maskInitialized
      || REDUCED_MOTION
    ) {
      els.maskImage.src = target.src;
      els.maskImageNext.src = target.src;

      els.maskContainer
        .classList
        .remove('mask-transition');

      currentMaskMin = target.min;
      pendingMaskMin = null;
      maskInitialized = true;

      return;
    }

    if (
      target.min === currentMaskMin
      || target.min === pendingMaskMin
    ) {
      return;
    }

    if (pendingMaskMin !== null) {
      commitPendingMask();
    }

    const requestToken = ++maskRequestToken;

    const preloaded =
      preloadedMasks.get(target.min);

    els.maskImageNext.src = target.src;

    const begin = () => {
      if (
        requestToken
        !== maskRequestToken
      ) {
        return;
      }

      pendingMaskMin = target.min;

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

      clearTimeout(maskTransitionTimer);

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

  function updateMaskAtmosphere() {
    const value = state.value;
    const stage = els.maskContainer;

    stage.classList.toggle(
      'mask-breathe',
      value >= 65
      && !REDUCED_MOTION
    );

    stage.classList.toggle(
      'mask-red',
      value >= 75
      && !REDUCED_MOTION
    );

    stage.classList.toggle(
      'mask-critical',
      value >= 90
    );

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
      els.maskAura.style.opacity = '';
      els.maskAura.style.transform = '';
    }

    if (value < 65) {
      els.vignette.style.opacity =
        '0';
    }

    else if (value < 75) {
      els.vignette.style.opacity =
        String(
          0.08
          + ((value - 65) / 10) * 0.10
        );
    }

    else if (value < 90) {
      els.vignette.style.opacity =
        String(
          0.18
          + ((value - 75) / 15) * 0.22
        );
    }

    else {
      els.vignette.style.opacity =
        String(
          Math.min(
            0.72,
            0.45
            + ((value - 90) / 10) * 0.27
          )
        );
    }

    if (value < 75) {
      els.percent.style.color = '';
      els.percent.style.textShadow = '';
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
      || bestiaireNarrationActive
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

  function scheduleMaskDisturbance() {
    clearTimeout(maskDisturbanceTimer);

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
  // INSTABILITÉ / RENDU
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

    els.audioToggle.textContent = state.musicOn
      ? (musicPlayBlocked ? 'LANCER MUSIQUE' : 'MUSIQUE ON')
      : 'MUSIQUE OFF';

    els.audioToggle.setAttribute(
      'aria-pressed',
      String(state.musicOn)
    );

    updateMask();
    renderEventControls();
    updateFullscreenButton();
    save();
  }

  function applyInstabilityDelta(
    delta,
    {
      source = 'Ajustement',
      haunt = false,
      deferThreshold = false,
      deferGameOver = false
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

      if (!deferThreshold) {
        handleThresholdTransition(
          before,
          state.value
        );
      }

      microEffect();
    }

    render();

    const gameOver = deferGameOver
      ? state.value >= 100
      : checkGameOver();

    // Un changement manuel d'Instabilité peut rendre de nouveau
    // possible un événement positif suspendu faute d'effet utile.
    if (eventSession.active && !currentMaskEvent) {
      updateAudioEventClock();
    }

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
    clearTimeout(alertTimer);

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
  // JOURNAL / MODALES
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

      || els.actionModal
        .classList
        .contains('show')

      || els.journalModal
        .classList
        .contains('show')

      || els.gameover
        .classList
        .contains('show')

      || els.alert
        .classList
        .contains('show')

      || els.dossierModal
        .classList
        .contains('show')
      || els.playersModal.classList.contains('show')
      || els.maskEventOverlay.classList.contains('show')
    );
  }

  // =========================================================
  // BESTIAIRE V0.9
  // =========================================================

  function getBestiaireData() {
    const data =
      Array.isArray(window.BESTIAIRE_DATA)
        ? window.BESTIAIRE_DATA
        : [];

    return data
      .filter(
        creature =>
          creature
          && creature.name
          && creature.slug
          && creature.image
      )
      .slice()
      .sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            'fr',
            {
              sensitivity: 'base'
            }
          )
      );
  }

  function bestiaireAsset(
    type,
    filename
  ) {
    return `${BESTIAIRE_PATHS[type]}${filename}`;
  }

  async function ensureRuntimeAsset(url) {
    const absoluteUrl =
      new URL(
        url,
        location.href
      ).href;

    if (!('caches' in window)) {
      const response =
        await fetch(absoluteUrl);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      return;
    }

    const cache =
      await caches.open(
        BESTIAIRE_RUNTIME_CACHE
      );

    const cached =
      await cache.match(
        absoluteUrl
      );

    if (cached) {
      return;
    }

    const response =
      await fetch(
        absoluteUrl
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    await cache.put(
      absoluteUrl,
      response.clone()
    );
  }

  function updateBestiaireMeta(
    shown,
    total,
    query
  ) {
    if (!els.bestiaireMeta) {
      return;
    }

    if (query) {
      els.bestiaireMeta.textContent =
        shown === 1
          ? '1 résultat'
          : `${shown} résultats`;

      return;
    }

    els.bestiaireMeta.textContent =
      shown === 1
        ? '1 créature recensée'
        : `${shown} créatures recensées`;
  }

  function renderBestiaire(query = '') {
    if (!els.bestiaireList) {
      return;
    }

    closeDossier();
    closeOpenCreature();

    const all =
      getBestiaireData();

    const normalizedQuery =
      normalizeSearch(query);

    // Les noms inconnus ne doivent jamais apparaître dans les résultats.
    const known = all.filter(isCreatureUnlocked);
    const shown = normalizedQuery
      ? known.filter(creature =>
          normalizeSearch(creature.name).includes(normalizedQuery)
        )
      : all;

    els.bestiaireList.innerHTML =
      '';

    els.bestiaireEmpty
      .classList
      .toggle(
        'hidden',
        shown.length > 0
      );

    updateBestiaireMeta(
      normalizedQuery ? shown.length : known.length,
      all.length,
      normalizedQuery
    );

    for (
      const creature
      of shown
    ) {
      els.bestiaireList
        .appendChild(
          isCreatureUnlocked(creature)
            ? buildCreatureEntry(creature)
            : buildLockedCreatureEntry()
        );
    }
  }

    function buildCreatureEntry(
    creature
  ) {
    const entry =
      document.createElement(
        'article'
      );

    entry.className =
      'creature-entry';

    entry.dataset.slug =
      creature.slug;

    const toggle =
      document.createElement(
        'button'
      );

    toggle.type =
      'button';

    toggle.className =
      'creature-toggle';

    toggle.setAttribute(
      'aria-expanded',
      'false'
    );

    const name =
      document.createElement(
        'span'
      );

    name.className =
      'creature-name';

    name.textContent =
      creature.name;

    const chevron =
      document.createElement(
        'span'
      );

    chevron.className =
      'creature-chevron';

    chevron.setAttribute(
      'aria-hidden',
      'true'
    );

    chevron.textContent =
      '›';

    toggle.append(
      name,
      chevron
    );

    const panel =
      document.createElement(
        'div'
      );

    panel.className =
      'creature-panel';

    const panelInner =
      document.createElement(
        'div'
      );

    panelInner.className =
      'creature-panel-inner';

    const content =
      document.createElement(
        'div'
      );

    content.className =
      'creature-content';

    const stage =
      document.createElement(
        'div'
      );

    stage.className =
      'creature-media-stage';

    const staticImage =
      document.createElement(
        'img'
      );

    staticImage.className =
      'creature-static';

    staticImage.src =
      bestiaireAsset(
        'image',
        creature.image
      );

    staticImage.alt =
      creature.name;

    staticImage.loading =
      'lazy';

    staticImage.decoding =
      'async';

    staticImage.addEventListener(
      'load',
      () => {
        if (
          staticImage.naturalWidth
          && staticImage.naturalHeight
        ) {
          stage.style.setProperty(
            '--media-ratio',
            `${staticImage.naturalWidth}/${staticImage.naturalHeight}`
          );
        }
      }
    );

    const video =
      document.createElement(
        'video'
      );

    video.className =
      'creature-video';

    video.muted =
      false;

    video.volume =
      1;

    video.playsInline =
      true;

    video.preload =
      'none';

    video.style.objectPosition =
      creature.videoPosition
      || 'center center';

    const videoScale =
      Number(
        creature.videoScale
      );

    video.style.transform =
      `scale(${
        Number.isFinite(videoScale)
          ? videoScale
          : 1
      })`;

    video.setAttribute(
      'playsinline',
      ''
    );

    video.setAttribute(
      'webkit-playsinline',
      ''
    );

    const loader =
      document.createElement(
        'div'
      );

    loader.className =
      'creature-loader';

    loader.textContent =
      'Chargement de l’archive…';

    stage.append(
      staticImage,
      video,
      loader
    );

    const actions =
      document.createElement(
        'div'
      );

    actions.className =
      'creature-actions';

    const replayButton =
      document.createElement(
        'button'
      );

    replayButton.type =
      'button';

    replayButton.className =
      'replay-btn hidden';

    replayButton.textContent =
      '↻ REJOUER';

    replayButton.addEventListener(
      'click',
      async event => {
        event.stopPropagation();

        if (!creature.video) {
          return;
        }

        /*
         * Si une narration est en cours
         * ou simplement chargée,
         * on l'arrête avant de rejouer
         * le WebM.
         */
        if (narrationLoadedUrl) {
          resetNarrationUI();
        }

        replayButton
          .classList
          .add('hidden');

        stage.classList.remove(
          'is-playing',
          'is-ending'
        );

        stage.classList.add(
          'is-loading'
        );

        try {
          video.playbackRate =
            1;

          video.currentTime =
            0;

          await video.play();
        }

        catch (_) {
          stage.classList.remove(
            'is-loading',
            'is-playing'
          );

          replayButton
            .classList
            .remove('hidden');

          bestiaireVideoActive =
            false;

          syncAmbientVolume();
        }
      }
    );

    const dossierButton =
      document.createElement(
        'button'
      );

    dossierButton.type =
      'button';

    dossierButton.className =
      'dossier-btn';

    dossierButton.textContent =
      'DOSSIER';

    dossierButton.addEventListener(
      'click',
      event => {
        event.stopPropagation();

        openDossier(
          creature
        );
      }
    );

const storyButton =
  document.createElement(
    'button'
  );

storyButton.type =
  'button';

storyButton.className =
  'story-btn';

storyButton.textContent =
  '▶ ÉCOUTER SON HISTOIRE';

const storyProgressWrap =
  document.createElement(
    'div'
  );

storyProgressWrap.className =
  'story-progress-wrap';

const storyProgress =
  document.createElement(
    'div'
  );

storyProgress.className =
  'story-progress';

storyProgress.setAttribute(
  'aria-hidden',
  'true'
);

const storyProgressFill =
  document.createElement(
    'div'
  );

storyProgressFill.className =
  'story-progress-fill';

storyProgress.appendChild(
  storyProgressFill
);

const storyTime =
  document.createElement(
    'div'
  );

storyTime.className =
  'story-time';

storyTime.textContent =
  '0:00 / --:--';

storyProgressWrap.append(
  storyProgress,
  storyTime
);

storyButton.addEventListener(
  'click',
  async event => {
    event.stopPropagation();

    if (!creature.narration) {
      return;
    }

    if (
      video
      && !video.paused
    ) {
      video.pause();

      stage.classList.remove(
        'is-loading',
        'is-playing',
        'is-ending'
      );

      replayButton
        .classList
        .remove('hidden');

      bestiaireVideoActive =
        false;

      syncAmbientVolume();
    }

    const audioUrl =
      bestiaireAsset(
        'audio',
        creature.narration
      );

    if (
      activeNarrationCreature
      && narrationLoadedUrl
        !== audioUrl
    ) {
      resetNarrationUI();
    }

    activeNarrationCreature =
      creature;

    activeStoryButton =
      storyButton;

    activeStoryProgressFill =
      storyProgressFill;

    activeStoryTime =
      storyTime;

    await toggleBestiaireNarration(
      creature
    );
  }
);

actions.append(
  replayButton,
  dossierButton,
  storyButton,
  storyProgressWrap
);

    content.append(
      stage,
      actions
    );

    panelInner.appendChild(
      content
    );

    panel.appendChild(
      panelInner
    );

    entry.append(
      toggle,
      panel
    );

    toggle.addEventListener(
      'click',
      () => {
        if (
          entry.classList
            .contains('open')
        ) {
          closeOpenCreature();
        }

        else {
          openCreature(
            creature,
            entry,
            stage,
            video,
            loader,
            replayButton
          );
        }
      }
    );

    return entry;
  }

  function resetCreatureVideo(
    entry,
    immediate = true
  ) {
    if (!entry) {
      return;
    }

    const stage =
      entry.querySelector(
        '.creature-media-stage'
      );

    const video =
      entry.querySelector(
        '.creature-video'
      );

    const loader =
      entry.querySelector(
        '.creature-loader'
      );

    if (
      !stage
      || !video
    ) {
      return;
    }

    stage.classList.remove(
      'is-loading',
      'is-playing',
      'is-ending'
    );

    if (loader) {
      loader.textContent =
        'Chargement de l’archive…';
    }

    video.pause();

    bestiaireVideoActive =
      false;

    syncAmbientVolume();

    const unload =
      () => {
        video.removeAttribute(
          'src'
        );

        try {
          video.load();
        }

        catch (_) {}
      };

    if (immediate) {
      unload();
    }

    else {
      setTimeout(
        unload,
        700
      );
    }
  }

  function closeOpenCreature() {
    bestiaireMediaToken +=
      1;

    /*
     * Si la narration appartient
     * à la créature qu'on ferme,
     * elle s'arrête également.
     */
    if (
      activeNarrationCreature
      && activeNarrationCreature.slug
        === openCreatureSlug
    ) {
      resetNarrationUI();
    }

    if (!openCreatureEntry) {
      openCreatureSlug =
        null;

      return;
    }

    openCreatureEntry
      .classList
      .remove('open');

    openCreatureEntry
      .querySelector(
        '.creature-toggle'
      )
      ?.setAttribute(
        'aria-expanded',
        'false'
      );

    resetCreatureVideo(
      openCreatureEntry,
      true
    );

    openCreatureEntry =
      null;

    openCreatureSlug =
      null;
  }

function scrollExpandedCreatureIntoView(
  entry
) {
  if (!entry) {
    return;
  }

  /*
   * On attend que l'animation
   * de déploiement du panneau
   * soit réellement terminée.
   */
  setTimeout(
    () => {
      if (
        openCreatureEntry !== entry
        || !entry.classList
          .contains('open')
      ) {
        return;
      }

      const viewport =
        window.visualViewport;

      const viewportTop =
        viewport
          ? viewport.offsetTop
          : 0;

      const viewportBottom =
        viewport
          ? viewport.offsetTop
            + viewport.height
          : window.innerHeight;

      const margin =
        14;

      const rect =
        entry.getBoundingClientRect();

      const usableHeight =
        viewportBottom
        - viewportTop
        - margin * 2;

      let scrollAmount =
        0;

      /*
       * Si toute l'entrée peut tenir
       * dans l'écran, on déplace
       * uniquement ce qui dépasse.
       */
      if (
        rect.height
        <= usableHeight
      ) {
        if (
          rect.bottom
          > viewportBottom
            - margin
        ) {
          scrollAmount =
            rect.bottom
            - (
              viewportBottom
              - margin
            );
        }

        else if (
          rect.top
          < viewportTop
            + margin
        ) {
          scrollAmount =
            rect.top
            - (
              viewportTop
              + margin
            );
        }
      }

      /*
       * Si l'entrée est physiquement
       * plus haute que l'écran,
       * on place son début proprement
       * en haut du viewport.
       */
      else {
        scrollAmount =
          rect.top
          - (
            viewportTop
            + margin
          );
      }

      if (
        Math.abs(
          scrollAmount
        ) > 1
      ) {
        window.scrollBy({
          top:
            scrollAmount,

          behavior:
            'smooth'
        });
      }
    },

    /*
     * Ton panneau se déploie en .34 s.
     * On mesure juste après.
     */
    380
  );
}
  
  async function openCreature(
    creature,
    entry,
    stage,
    video,
    loader,
    replayButton
  ) {
    closeOpenCreature();

    openCreatureSlug =
      creature.slug;

    openCreatureEntry =
      entry;

    if (creature.video) {
      stage.classList.add(
        'is-loading'
      );
    }

    entry.classList.add(
      'open'
    );

   entry.querySelector(
  '.creature-toggle'
)
  ?.setAttribute(
    'aria-expanded',
    'true'
  );

scrollExpandedCreatureIntoView(
  entry
);

if (!creature.video) {
  return;
}

    const token =
      ++bestiaireMediaToken;

    const videoUrl =
      bestiaireAsset(
        'video',
        creature.video
      );

    loader.textContent =
      'Chargement de l’archive…';

    try {
      ensureRuntimeAsset(
        videoUrl
      ).catch(() => {});

      if (
        token !== bestiaireMediaToken
        || openCreatureSlug
          !== creature.slug
      ) {
        return;
      }

      video.src =
        videoUrl;

      stage.classList.remove(
        'is-ending'
      );

      video.playbackRate =
        1;

      video.currentTime =
        0;

      video.load();

      const onPlaying =
        () => {
          if (
            token !== bestiaireMediaToken
            || openCreatureSlug
              !== creature.slug
          ) {
            return;
          }

          stage.classList.remove(
            'is-loading'
          );

          stage.classList.add(
            'is-playing'
          );

          replayButton
            .classList
            .add('hidden');

          bestiaireVideoActive =
            true;

          syncAmbientVolume();
        };

      const onTimeUpdate =
        () => {
          if (
            token !== bestiaireMediaToken
            || openCreatureSlug
              !== creature.slug
            || !Number.isFinite(
              video.duration
            )
          ) {
            return;
          }

          const remaining =
            video.duration
            - video.currentTime;

          /*
           * Fin déjà calibrée :
           * ralentissement + fondu
           * dans la dernière seconde.
           */
          if (
            remaining > 0
            && remaining <= 0.9
            && !stage.classList
              .contains('is-ending')
          ) {
            stage.classList.add(
              'is-ending'
            );

            video.playbackRate =
              0.75;
          }
        };

     const onEnded =
  () => {
    if (
      token !== bestiaireMediaToken
      || openCreatureSlug
        !== creature.slug
    ) {
      return;
    }

    stage.classList.remove(
      'is-loading',
      'is-playing'
    );

    replayButton
      .classList
      .remove('hidden');

    bestiaireVideoActive =
      false;

    syncAmbientVolume();

    /*
     * Certaines créatures peuvent
     * lancer automatiquement leur
     * narration à la fin du WebM.
     *
     * Pour l'instant :
     * uniquement la Gardienne.
     */
    if (
      creature.autoNarrationAfterVideo
      && creature.narration
    ) {
      const storyButton =
        entry.querySelector(
          '.story-btn'
        );

      const storyProgressFill =
        entry.querySelector(
          '.story-progress-fill'
        );

      const storyTime =
        entry.querySelector(
          '.story-time'
        );

      activeNarrationCreature =
        creature;

      activeStoryButton =
        storyButton;

      activeStoryProgressFill =
        storyProgressFill;

      activeStoryTime =
        storyTime;

      /*
       * Petite attente pour laisser
       * le fondu final revenir
       * complètement sur la carte fixe.
       */
      setTimeout(
        () => {
          if (
            token !== bestiaireMediaToken
            || openCreatureSlug
              !== creature.slug
          ) {
            return;
          }

          toggleBestiaireNarration(
            creature
          );
        },
        180
      );
    }
  };

      const onError =
        () => {
          if (
            token !== bestiaireMediaToken
            || openCreatureSlug
              !== creature.slug
          ) {
            return;
          }

          bestiaireVideoActive =
            false;

          syncAmbientVolume();

          stage.classList.remove(
            'is-playing'
          );

          stage.classList.add(
            'is-loading'
          );

          loader.textContent =
            'Animation indisponible.';

          setTimeout(
            () => {
              if (
                openCreatureSlug
                === creature.slug
              ) {
                stage.classList
                  .remove(
                    'is-loading'
                  );
              }
            },
            2600
          );
        };

      video.onplaying =
        onPlaying;

      video.ontimeupdate =
        onTimeUpdate;

      video.onended =
        onEnded;

      video.onerror =
        onError;

      await video.play();
    }

    catch (_) {
      if (
        token !== bestiaireMediaToken
        || openCreatureSlug
          !== creature.slug
      ) {
        return;
      }

      bestiaireVideoActive =
        false;

      syncAmbientVolume();

      stage.classList.remove(
        'is-playing'
      );

      stage.classList.add(
        'is-loading'
      );

      loader.textContent =
        navigator.onLine
          ? 'Animation indisponible.'
          : 'Animation non disponible hors connexion.';

      setTimeout(
        () => {
          if (
            openCreatureSlug
            === creature.slug
          ) {
            stage.classList
              .remove(
                'is-loading'
              );
          }
        },
        3000
      );
    }
  }

  function resetNarrationUI() {
  bestiaireNarrationActive =
    false;

  activeNarrationCreature =
    null;

  if (activeStoryButton) {
    activeStoryButton.textContent =
      '▶ ÉCOUTER SON HISTOIRE';

    activeStoryButton.disabled =
      false;
  }

  if (activeStoryProgressFill) {
    activeStoryProgressFill.style.width =
      '0%';
  }

  if (activeStoryTime) {
    activeStoryTime.textContent =
      '0:00 / --:--';
  }

  activeStoryButton =
    null;

  activeStoryProgressFill =
    null;

  activeStoryTime =
    null;

  narrationLoadedUrl =
    null;

  els.bestiaireNarration.pause();

  els.bestiaireNarration
    .removeAttribute('src');

  try {
    els.bestiaireNarration.load();
  }

  catch (_) {}

  syncAmbientVolume();
}

function openDossier(
  creature
) {
  if (openCreatureEntry) {
    const video =
      openCreatureEntry
        .querySelector(
          '.creature-video'
        );

    const stage =
      openCreatureEntry
        .querySelector(
          '.creature-media-stage'
        );

    const replayButton =
      openCreatureEntry
        .querySelector(
          '.replay-btn'
        );

    if (
      video
      && !video.paused
    ) {
      video.pause();

      stage?.classList.remove(
        'is-loading',
        'is-playing',
        'is-ending'
      );

      replayButton
        ?.classList
        .remove('hidden');

      bestiaireVideoActive =
        false;

      syncAmbientVolume();
    }
  }

  els.dossierTitle.textContent =
    creature.name;

  els.dossierLore.textContent =
    creature.lore
    || 'Aucune donnée disponible.';

  els.dossierModal
    .classList
    .add('show');

  els.dossierModal
    .setAttribute(
      'aria-hidden',
      'false'
    );

  document.body
    .classList
    .add('dossier-open');

  els.dossierClose.focus();
}

function closeDossier() {
  if (!els.dossierModal) {
    return;
  }

  els.dossierModal
    .classList
    .remove('show');

  els.dossierModal
    .setAttribute(
      'aria-hidden',
      'true'
    );

  document.body
    .classList
    .remove('dossier-open');
}

async function toggleBestiaireNarration(
  creature
) {
  if (!creature?.narration) {
    return;
  }

  activeNarrationCreature =
    creature;

  const audio =
    els.bestiaireNarration;

  const audioUrl =
    bestiaireAsset(
      'audio',
      creature.narration
    );

  if (
    narrationLoadedUrl === audioUrl
    && !audio.paused
  ) {
    audio.pause();

    bestiaireNarrationActive =
      false;

    if (activeStoryButton) {
      activeStoryButton.textContent =
        '▶ REPRENDRE';

      activeStoryButton.disabled =
        false;
    }

    syncAmbientVolume();

    return;
  }

  try {
    if (
      narrationLoadedUrl
      !== audioUrl
    ) {
      if (activeStoryButton) {
        activeStoryButton.textContent =
          '… CHARGEMENT…';

        activeStoryButton.disabled =
          true;
      }

      await ensureRuntimeAsset(
        audioUrl
      );

      if (
        activeNarrationCreature
        !== creature
      ) {
        return;
      }

      narrationLoadedUrl =
        audioUrl;

      audio.src =
        audioUrl;

      audio.preload =
        'auto';

      audio.load();
    }

    stopSpecialAudio(
      els.ritualAudio
    );

    stopSpecialAudio(
      els.campAudio
    );

    specialAudioActive =
      false;

    if (
      audio.ended
      || (
        Number.isFinite(
          audio.duration
        )
        && audio.currentTime
          >= audio.duration
      )
    ) {
      audio.currentTime =
        0;
    }

    bestiaireNarrationActive =
      true;

    if (activeStoryButton) {
      activeStoryButton.textContent =
        '⏸ PAUSE';

      activeStoryButton.disabled =
        false;
    }

    syncAmbientVolume();

    await audio.play();
  }

  catch (_) {
    bestiaireNarrationActive =
      false;

    if (activeStoryButton) {
      activeStoryButton.textContent =
        '▶ RÉESSAYER';

      activeStoryButton.disabled =
        false;
    }

    syncAmbientVolume();
  }
}

function updateNarrationProgress() {
  if (
    !activeStoryProgressFill
    || !activeStoryTime
  ) {
    return;
  }

  const audio =
    els.bestiaireNarration;

  const duration =
    Number.isFinite(
      audio.duration
    )
      ? audio.duration
      : 0;

  const current =
    Number.isFinite(
      audio.currentTime
    )
      ? audio.currentTime
      : 0;

  const progress =
    duration > 0
      ? clamp(
          (current / duration) * 100,
          0,
          100
        )
      : 0;

  activeStoryProgressFill
    .style.width =
      `${progress}%`;

  activeStoryTime.textContent =
    `${formatTime(current)} / ${
      duration
        ? formatTime(duration)
        : '--:--'
    }`;
}

function setupBestiaire() {
  if (
    !els.bestiaireList
    || !els.bestiaireSearch
  ) {
    return;
  }

  renderBestiaire('');

  els.btnRecenser.addEventListener('click', () => {
    const showing = els.recensementPanel.classList.contains('hidden');
    els.recensementPanel.classList.toggle('hidden', !showing);
    els.btnRecenser.setAttribute('aria-expanded', String(showing));
    els.recensementError.textContent = '';
    if (showing) els.recensementInput.focus();
  });

  els.btnBestiaireHelp.addEventListener('click', () => {
    showInfo(
      'Fonctionnement du Bestiaire',
      'Toutes les créatures sont initialement verrouillées.\n\n' +
      'Lorsqu’une créature apparaît pendant votre partie, appuyez sur « RECENSER UNE CRÉATURE » puis saisissez son nom complet.\n\n' +
      'Les accents, la casse et la ponctuation n’ont pas d’importance. Une petite faute peut nécessiter une confirmation.\n\n' +
      'Les créatures recensées restent accessibles, y compris lorsque vous démarrez une nouvelle partie. Votre progression est sauvegardée sur cet appareil. Elle peut être perdue si vous effacez les données de l’application ou du site.'
    );
  });

  els.recensementForm.addEventListener('submit', submitRecensement);
  els.recensementInput.addEventListener('input', () => {
    els.recensementError.textContent = '';
  });

  els.bestiaireSearch
    .addEventListener(
      'input',
      () => {
        renderBestiaire(
          els.bestiaireSearch.value
        );
      }
    );

  els.dossierClose
    .addEventListener(
      'click',
      closeDossier
    );

  els.dossierModal
    .addEventListener(
      'click',
      event => {
        if (
          event.target
          === els.dossierModal
        ) {
          closeDossier();
        }
      }
    );

  els.bestiaireNarration
    .addEventListener(
      'loadedmetadata',
      updateNarrationProgress
    );

  els.bestiaireNarration
    .addEventListener(
      'durationchange',
      updateNarrationProgress
    );

  els.bestiaireNarration
    .addEventListener(
      'timeupdate',
      updateNarrationProgress
    );

  els.bestiaireNarration
    .addEventListener(
      'play',
      () => {
        bestiaireNarrationActive =
          true;

        if (activeStoryButton) {
          activeStoryButton
            .textContent =
              '⏸ PAUSE';

          activeStoryButton.disabled =
            false;
        }

        syncAmbientVolume();
      }
    );

  els.bestiaireNarration
    .addEventListener(
      'pause',
      () => {
        if (
          els.bestiaireNarration
            .ended
        ) {
          return;
        }

        bestiaireNarrationActive =
          false;

        if (activeStoryButton) {
          activeStoryButton
            .textContent =
              '▶ REPRENDRE';

          activeStoryButton.disabled =
            false;
        }

        syncAmbientVolume();
      }
    );

  els.bestiaireNarration
    .addEventListener(
      'ended',
      () => {
        bestiaireNarrationActive =
          false;

        if (activeStoryButton) {
          activeStoryButton
            .textContent =
              '↻ RÉÉCOUTER';

          activeStoryButton.disabled =
            false;
        }

        updateNarrationProgress();
        syncAmbientVolume();
      }
    );

  els.bestiaireNarration
    .addEventListener(
      'error',
      () => {
        bestiaireNarrationActive =
          false;

        if (activeStoryButton) {
          activeStoryButton
            .textContent =
              '▶ RÉESSAYER';

          activeStoryButton.disabled =
            false;
        }

        syncAmbientVolume();
      }
    );
}
  // =========================================================
  // PROFANATION / CAMP / NOUVELLE PARTIE
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

    if (result.gameOver) {
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

  function requestNewGame() {
    showConfirm(
      'Nouvelle partie',

`Démarrer une nouvelle partie ?

L’Instabilité, le Camp de fortune, la Profanation de la chair, le Journal, les interventions audio et l’état des quatre joueurs seront réinitialisés.`,

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

    closeDossier();
    closeOpenCreature();

    specialAudioActive =
      false;

    bestiaireNarrationActive =
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

    resetAudioEventSession();
    syncAmbientVolume();

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

    resetNarrationUI();

    stopSpecialAudio(
      els.ritualAudio
    );

    stopSpecialAudio(
      els.campAudio
    );

    specialAudioActive =
      true;

    syncAmbientVolume();

    audio.volume =
      volume;

    const restore =
      () => {
        specialAudioActive =
          false;

        syncAmbientVolume();
      };

    audio.onended =
      restore;

    audio.onerror =
      restore;

    audio
      .play()
      .catch(
        restore
      );
  }

async function syncMusicForActiveTab() {
  const token = ++musicSyncToken;
  const isCurrent = () => token === musicSyncToken;

  if (!state.musicOn) {
    musicPlayBlocked = false;
    // La pause intervient après la transition, mais pas après un nouveau
    // clic qui aurait réactivé la musique entre-temps.
    const fade = Promise.all([
      fadeAudioVolume(els.ambient, 0, AUDIO_SWITCH_FADE_MS),
      fadeAudioVolume(els.bestiaireAmbient, 0, AUDIO_SWITCH_FADE_MS)
    ]);
    await fade;
    if (!isCurrent() || state.musicOn) return;
    els.ambient.pause();
    els.bestiaireAmbient.pause();
    return;
  }

  const active = isBestiaireTabActive()
    && !useOfflineBestiaireMusicFallback()
      ? els.bestiaireAmbient
      : els.ambient;
  const inactive = active === els.ambient
    ? els.bestiaireAmbient
    : els.ambient;
  const targetVolume = isBestiaireTabActive()
    ? getBestiaireAmbientTargetVolume()
    : (specialAudioActive ? DUCK_VOLUME : AMBIENT_VOLUME);

  // IMPORTANT : sur mobile, play() doit être appelé directement depuis
  // le clic de l'utilisateur, AVANT tout await, sinon le geste peut
  // expirer et la lecture est refusée.
  let playAttempt = null;
  if (active.paused) {
    active.volume = 0;
    try {
      playAttempt = active.play();
    } catch (_) {
      playAttempt = Promise.reject(new Error('Lecture musicale impossible'));
    }
  }

  fadeAudioVolume(inactive, 0, AUDIO_SWITCH_FADE_MS).then(() => {
    if (isCurrent()) inactive.pause();
  });

  try {
    if (playAttempt) await playAttempt;
    if (!isCurrent() || !state.musicOn) return;
    musicPlayBlocked = false;
    fadeAudioVolume(active, targetVolume);
    render();
  } catch (_) {
    if (!isCurrent()) return;
    musicPlayBlocked = true;
    render();
  }
}

async function setMusic(
  on
) {
  state.musicOn =
    on;

  save();
  render(); // La touche réagit immédiatement, même si l'audio charge.
  await syncMusicForActiveTab();
}

function unlockAmbientOnce() {
  if (state.musicOn) {
    syncMusicForActiveTab();
  }
}

window.addEventListener(
  'offline',
  () => {
    if (appStarted) {
      syncMusicForActiveTab();
    }
  }
);

window.addEventListener(
  'online',
  () => {
    if (appStarted) {
      syncMusicForActiveTab();
    }
  }
);

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
    !isPartieTabActive()
    || specialAudioActive
    || bestiaireNarrationActive
    || bestiaireVideoActive
    || Math.random()
      >= HAUNT.perClickProb
  ) {
    return;
  }

    hauntVisual();

    if (
      Math.random() < 0.85
    ) {
      playRandomHauntSfx();
    }
  }

  function schedulePassiveHaunt() {
    clearTimeout(passiveTimer);

    passiveTimer =
      setTimeout(
        () => {
          if (
  isPartieTabActive()
  && !specialAudioActive
  && !bestiaireNarrationActive
  && !bestiaireVideoActive
  && !anyBlockingModalOpen()
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

    stopAudioEventsForGameOver();

    if (!gameOverShown) {
      gameOverShown =
        true;

      closeDossier();
      closeOpenCreature();
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

    resetNarrationUI();

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
  // PLEIN ÉCRAN / WAKE LOCK
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
        .getElementById(
          'tab-partie'
        )
        ?.classList
        .contains('active')
      ?? true
    );
  }

  function isBestiaireTabActive() {
  return (
    document
      .getElementById(
        'tab-bestiaire'
      )
      ?.classList
      .contains('active')
    ?? false
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

          if (
            target
            !== 'bestiaire'
          ) {
            closeDossier();
            closeOpenCreature();
          }

          for (
            const item
            of buttons
          ) {
            const active =
              item === btn;

            item.classList.toggle(
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
  panel.classList.toggle(
    'active',
    panel.id
      === `tab-${target}`
  );
}

syncMusicForActiveTab();
          updateAudioEventClock();
        }
      );
    }
  }

  // =========================================================
  // GATE
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
  // INSTALLATION PWA / SERVICE WORKER
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
  // INTERVENTIONS AUDIO — v1 / LE COLLECTIONNEUR
  // =========================================================

  function readAudioEventSession() {
    const defaults = {
      active: false,
      introPlayed: false,
      alive: [true, true, true, true],
      played: [],
      remainingMs: null
    };

    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_EVENT_STORAGE) || 'null');
      if (!saved || typeof saved !== 'object') return defaults;

      let remaining = Number.isFinite(saved.remainingMs)
        ? Math.max(0, saved.remainingMs)
        : null;

      // Une actualisation accidentelle conserve l'échéance du tirage.
      // On n'essaie jamais de rejouer plusieurs événements manqués.
      if (saved.active && Number.isFinite(saved.dueAt)) {
        remaining = Math.max(15000, saved.dueAt - Date.now());
      }

      return {
        active: saved.active === true,
        introPlayed: saved.introPlayed === true,
        alive: Array.isArray(saved.alive) && saved.alive.length === 4
          ? saved.alive.map(value => value === true)
          : defaults.alive,
        played: Array.isArray(saved.played)
          ? saved.played.filter(id => typeof id === 'string')
          : [],
        remainingMs: remaining
      };
    } catch (_) {
      return defaults;
    }
  }

  function saveAudioEventSession() {
    try {
      localStorage.setItem(AUDIO_EVENT_STORAGE, JSON.stringify({
        ...eventSession,
        remainingMs: eventDueAt === null
          ? eventSession.remainingMs
          : Math.max(0, eventDueAt - Date.now()),
        dueAt: eventDueAt
      }));
    } catch (_) {
      // L'application reste utilisable sans stockage local.
    }
  }

  function unusedAudioEvents() {
    return AUDIO_EVENTS.filter(item => !eventSession.played.includes(item.id));
  }

  function eligibleAudioEvents() {
    return unusedAudioEvents().filter(item =>
      state.value >= (item.minInstability || 0)
    );
  }

  function livingPlayerNumbers() {
    return eventSession.alive.reduce((list, alive, index) => {
      if (alive) list.push(index + 1);
      return list;
    }, []);
  }

  function renderEventControls() {
    const alive = livingPlayerNumbers().length;
    els.btnPlayers.textContent = 'JOUEURS · ' + alive + '/4';
    // Le panneau de démarrage disparaît ensuite : priorité aux actions spéciales.
    els.eventGameCard.classList.toggle('hidden', eventSession.active);
    els.btnStartEvents.disabled = eventSession.active || state.value >= 100;
    els.btnStartEvents.textContent = 'COMMENCER LA PARTIE';
    els.eventGameStatus.textContent = 'Lancez la partie lorsque tout le monde est prêt.';

    // Les interventions déjà jouées ne sont jamais révélées aux joueurs.
    const showDebug = EVENT_TEST_MODE && eventSession.active;
    els.btnTestMaskEvent.classList.toggle('hidden', !showDebug);
    els.testMaskEventSelect.classList.toggle('hidden', !showDebug);
    const testEvent = AUDIO_EVENTS.find(item =>
      item.id === els.testMaskEventSelect.value
    ) || AUDIO_EVENTS[0];
    const locked = state.value < (testEvent.minInstability || 0);
    els.btnTestMaskEvent.textContent = locked
      ? 'TEST : MINIMUM ' + testEvent.minInstability + '%'
      : 'TESTER LE MASQUE';
    els.btnTestMaskEvent.disabled = !eventSession.active || currentMaskEvent !== null
      || alive === 0 || state.value >= 100 || locked;
  }

  function renderPlayerStatuses() {
    els.eventPlayersList.replaceChildren();

    eventSession.alive.forEach((alive, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'event-player-row';
      button.setAttribute('aria-pressed', String(!alive));
      button.setAttribute('aria-label', 'Joueur ' + (index + 1) + ' : ' + (alive ? 'vivant' : 'mort'));
      const name = document.createElement('span');
      name.textContent = 'JOUEUR ' + (index + 1);
      const label = document.createElement('span');
      label.className = 'event-player-state';
      label.textContent = alive ? '● VIVANT' : '✕ MORT';
      button.append(name, label);
      button.addEventListener('click', () => {
        eventSession.alive[index] = !eventSession.alive[index];
        saveAudioEventSession();
        renderPlayerStatuses();
        renderEventControls();
        updateAudioEventClock();
      });
      els.eventPlayersList.appendChild(button);
    });
  }

  function openPlayersModal() {
    if (currentMaskEvent) return;
    renderPlayerStatuses();
    els.playersModal.classList.add('show');
    els.playersClose.focus();
  }

  function closePlayersModal() {
    els.playersModal.classList.remove('show');
    updateAudioEventClock();
  }

  function pauseAudioEventClock() {
    if (eventTimer !== null) {
      clearTimeout(eventTimer);
      eventTimer = null;
      eventSession.remainingMs = Math.max(0, eventDueAt - Date.now());
      eventDueAt = null;
      saveAudioEventSession();
    }
  }

  function audioEventClockAllowed() {
    return appStarted
      && eventSession.active
      && !gameOverShown
      && state.value < 100
      && document.visibilityState === 'visible'
      && isPartieTabActive()
      && currentMaskEvent === null
      && livingPlayerNumbers().length > 0
      && eligibleAudioEvents().length > 0;
  }

  function updateAudioEventClock() {
    if (!audioEventClockAllowed()) {
      pauseAudioEventClock();
      return;
    }

    if (eventTimer !== null) return;

    if (eventSession.remainingMs === null) {
      eventSession.remainingMs = randomBetween(...EVENT_NEXT_DELAY);
    }

    const delay = Math.max(1000, eventSession.remainingMs);
    eventDueAt = Date.now() + delay;
    eventTimer = setTimeout(onAudioEventDue, delay);
    saveAudioEventSession();
  }

  function onAudioEventDue() {
    eventTimer = null;
    eventDueAt = null;
    eventSession.remainingMs = null;
    saveAudioEventSession();

    if (!audioEventClockAllowed()) {
      eventSession.remainingMs = EVENT_RETRY_DELAY;
      saveAudioEventSession();
      updateAudioEventClock();
      return;
    }

    // Priorité au rituel, au camp, aux transitions et aux fenêtres ouvertes.
    // Un seul événement peut être reporté ; aucune file ne s'accumule.
    if (specialAudioActive || bestiaireNarrationActive
      || bestiaireVideoActive || anyBlockingModalOpen()) {
      eventSession.remainingMs = EVENT_RETRY_DELAY;
      updateAudioEventClock();
      return;
    }

    const candidates = eligibleAudioEvents().filter(
      item => item.type === 'masque'
    );
    if (candidates.length === 0) return;
    const item = candidates[randomBetween(0, candidates.length - 1)];

    if (!beginMaskEvent(item, false)) {
      eventSession.remainingMs = EVENT_RETRY_DELAY;
      updateAudioEventClock();
    }
  }

  function startAudioEvents() {
    if (eventSession.active || state.value >= 100
      || document.visibilityState !== 'visible' || !isPartieTabActive()
      || specialAudioActive || anyBlockingModalOpen()) return;

    eventSession.active = true;
    // L'introduction est marquée comme jouée avant la lecture : F5 ne la rejoue pas.
    eventSession.introPlayed = true;
    eventSession.played = [];
    eventSession.remainingMs = randomBetween(...EVENT_FIRST_DELAY);
    saveAudioEventSession();
    renderEventControls();

    // Lecture immédiatement sur le geste de l'utilisateur (Android).
    // Le chronomètre du premier événement attend la FIN de l'introduction.
    if (!beginMaskIntroduction()) updateAudioEventClock();
  }

  function beginMaskIntroduction() {
    if (!eventSession.active || currentMaskEvent || state.value >= 100
      || !isPartieTabActive() || document.visibilityState !== 'visible'
      || specialAudioActive || anyBlockingModalOpen()) return false;

    const token = ++maskEventToken;
    const audio = new Audio(MASK_INTRO_AUDIO);
    audio.preload = 'auto';
    audio.volume = 1;
    currentMaskEvent = {
      token, intro: true, audios: [audio],
      activeAudio: null, segment: 0, pendingSegment: null
    };

    els.maskEventTitle.textContent = 'Le Masque';
    els.maskEventPortrait.src = getMaskState(state.value).src;
    els.maskEventStatus.textContent = 'Le Masque vous accueille…';
    clearTimeout(maskClosingTimer);
    maskClosingTimer = null;
    els.maskEventOverlay.classList.remove('closing', 'has-result');
    els.maskEventPlay.classList.add('hidden');
    els.maskIntroSkip.classList.add('hidden');
    els.maskEventResult.classList.add('hidden');
    els.maskEventOverlay.classList.add('show');
    els.maskEventOverlay.setAttribute('aria-hidden', 'false');

    specialAudioActive = true;
    syncAmbientVolume();
    renderEventControls();
    playMaskEventSegment(0, token);
    return true;
  }

  function finishMaskIntroduction(immediate = false) {
    const running = currentMaskEvent;
    if (!running || !running.intro) return;
    const token = running.token;
    const finish = () => {
      if (!currentMaskEvent || currentMaskEvent.token !== token) return;
      dismissMaskEvent();
      renderEventControls();
      updateAudioEventClock();
    };
    if (immediate) return finish();
    clearTimeout(eventAudioGapTimer);
    eventAudioGapTimer = setTimeout(() => {
      eventAudioGapTimer = null;
      finish();
    }, 850);
  }

  function dismissMaskEvent(immediate = false) {
    maskEventToken += 1;
    clearTimeout(eventAudioGapTimer);
    eventAudioGapTimer = null;
    clearTimeout(maskClosingTimer);
    maskClosingTimer = null;

    if (currentMaskEvent) {
      currentMaskEvent.audios.forEach(audio => {
        audio.pause();
        audio.onended = null;
        audio.onerror = null;
      });
    }

    currentMaskEvent = null;
    const overlay = els.maskEventOverlay;

    // Le Masque s'efface en douceur, au lieu de disparaître d'un coup.
    // Les resets et les fins de partie peuvent le fermer immédiatement.
    if (immediate || !overlay.classList.contains('show')) {
      overlay.classList.remove('show', 'closing', 'has-result');
    } else {
      overlay.classList.add('closing');
      overlay.classList.remove('show');
      maskClosingTimer = setTimeout(() => {
        maskClosingTimer = null;
        overlay.classList.remove('closing', 'has-result');
      }, REDUCED_MOTION ? 0 : 740);
    }

    overlay.setAttribute('aria-hidden', 'true');
    els.maskEventPlay.classList.add('hidden');
    els.maskIntroSkip.classList.add('hidden');
    els.maskEventResult.classList.add('hidden');
    specialAudioActive = false;
    syncAmbientVolume();
  }

  function resetAudioEventSession() {
    clearTimeout(maskDeferredOutcomeTimer);
    maskDeferredOutcomeTimer = null;
    pauseAudioEventClock();
    dismissMaskEvent(true);
    eventSession.active = false;
    eventSession.introPlayed = false;
    eventSession.alive = [true, true, true, true];
    eventSession.played = [];
    eventSession.remainingMs = null;
    saveAudioEventSession();
    renderEventControls();
  }

  function stopAudioEventsForGameOver() {
    clearTimeout(maskDeferredOutcomeTimer);
    maskDeferredOutcomeTimer = null;
    if (!eventSession.active && !currentMaskEvent) return;
    pauseAudioEventClock();
    dismissMaskEvent(true);
    eventSession.active = false;
    eventSession.remainingMs = null;
    saveAudioEventSession();
    renderEventControls();
  }

  function beginMaskEvent(item, preview) {
    if (!eventSession.active || currentMaskEvent || state.value >= 100
      || document.visibilityState !== 'visible' || !isPartieTabActive()
      || specialAudioActive || anyBlockingModalOpen()) return false;

    const possibleTargets = livingPlayerNumbers();
    if (possibleTargets.length === 0) return false;

    pauseAudioEventClock();
    const savedPreviewDelay = eventSession.remainingMs;
    const player = possibleTargets[randomBetween(0, possibleTargets.length - 1)];
    const token = ++maskEventToken;

    currentMaskEvent = {
      token,
      item,
      player,
      preview,
      savedPreviewDelay,
      segment: 0,
      pendingSegment: null,
      activeAudio: null,
      audios: [
        new Audio('audio/events/masque/designations/joueur-' + player + '.mp3'),
        new Audio(item.audio)
      ]
    };

    currentMaskEvent.audios.forEach(audio => {
      audio.preload = 'auto';
      audio.volume = 1;
      audio.load();
    });

    if (!preview) {
      eventSession.played.push(item.id);
      eventSession.remainingMs = null;
    }
    saveAudioEventSession();

    els.maskEventTitle.textContent = 'Le Masque';
    els.maskEventPortrait.src = getMaskState(state.value).src;
    els.maskEventStatus.textContent = 'Le Masque prend la parole…';
    clearTimeout(maskClosingTimer);
    maskClosingTimer = null;
    els.maskEventOverlay.classList.remove('closing', 'has-result');
    els.maskIntroSkip.classList.add('hidden');
    els.maskEventPlay.classList.add('hidden');
    els.maskEventResult.classList.add('hidden');
    els.maskEventOverlay.classList.add('show');
    els.maskEventOverlay.setAttribute('aria-hidden', 'false');

    specialAudioActive = true;
    syncAmbientVolume();
    renderEventControls();
    playMaskEventSegment(0, token);
    return true;
  }

  function showMaskEventResult(token, audioUnavailable = false) {
    if (!currentMaskEvent || currentMaskEvent.token !== token
      || currentMaskEvent.intro) return;

    const running = currentMaskEvent;
    const player = running.player;
    els.maskEventStatus.textContent = audioUnavailable
      ? 'Audio indisponible — appliquez la conséquence ci-dessous.'
      : 'Le Masque a prononcé sa sentence.';
    els.maskEventPlay.classList.add('hidden');
    els.maskEventInventoryLabel.classList.toggle(
      'hidden', running.item.id !== 'masque-001'
    );
    els.maskEventChoices.classList.add('hidden');
    els.maskEventDone.classList.remove('hidden');

    if (running.item.id === 'masque-002') {
      // La baisse est automatique à la fin du discours.
      // Le franchissement du seuil de 50% sera annoncé APRÈS
      // la fermeture du Masque, jamais par-dessus sa voix.
      if (!running.effectApplied) {
        running.effectApplied = true;
        const before = state.value;
        const effect = applyInstabilityDelta(-5, {
          source: 'Le Masque — Un élan de générosité',
          deferThreshold: true,
          deferGameOver: true
        });
        running.deferredThreshold = [before, state.value];
        running.actualChange = effect.actual;
      }
      const before = running.deferredThreshold[0];
      const after = running.deferredThreshold[1];
      els.maskEventEffect.textContent =
        'Le Masque a réduit l’Instabilité mentale collective de 5 points.\n\n'
        + before + '% → ' + after + ' %. Aucun bouton à utiliser.';
    } else if (running.item.id === 'masque-003') {
      els.maskEventEffect.textContent =
        'Joueur ' + player + ', à toi de décider.\n\n'
        + '1. Subis 1 blessure ET passe ton prochain tour.\n'
        + '2. Évite ces pénalités, mais inflige +15 points d’Instabilité au groupe.';
      els.maskEventChoices.classList.remove('hidden');
      els.maskEventDone.classList.add('hidden');
    } else {
      els.maskEventEffect.textContent =
        'Joueur ' + player
        + ' : mélange face cachée toutes les cartes rangées dans tes emplacements '
        + 'de sac à dos et défausse-en une au hasard.\n\n'
        + 'Ton arme et ton armure équipées ne sont pas concernées. '
        + 'Si ton sac est vide, aucun effet.';
    }

    els.maskEventResult.classList.remove('hidden');
    els.maskEventOverlay.classList.add('has-result');
    if (running.item.id === 'masque-003') {
      els.maskChoiceSelf.focus();
    } else {
      els.maskEventDone.focus();
    }
  }

  function chooseMaskSacrifice(option) {
    const running = currentMaskEvent;
    if (!running || running.intro || running.item.id !== 'masque-003'
      || running.choiceMade || !['self', 'group'].includes(option)) return;

    running.choiceMade = option;
    els.maskEventChoices.classList.add('hidden');
    els.maskEventDone.classList.remove('hidden');

    if (option === 'self') {
      els.maskEventEffect.textContent =
        'Joueur ' + running.player + ' : tu te sacrifies.\n\n'
        + 'Subis 1 blessure et passe ton prochain tour. '
        + 'Appliquez ces deux conséquences sur le plateau.\n\n'
        + 'L’Instabilité collective ne change pas.';
    } else {
      const before = state.value;
      const effect = applyInstabilityDelta(15, {
        source: 'Le Masque — Le Prix du sacrifice (groupe)',
        deferThreshold: true,
        deferGameOver: true
      });
      running.deferredThreshold = [before, state.value];
      running.deferredGameOver = effect.gameOver;
      els.maskEventEffect.textContent =
        'Joueur ' + running.player + ' : le groupe paie.\n\n'
        + 'Instabilité collective : ' + before + '% → ' + state.value
        + '% (+' + effect.actual + ' points).\n\n'
        + (effect.gameOver
          ? 'Le seuil de 100 % est atteint : la fin de partie sera déclenchée '
            + 'après la fermeture de cette fenêtre.'
          : 'Aucune blessure ni perte de tour pour le joueur désigné.');
    }

    els.maskEventDone.focus();
  }

  function playMaskEventSegment(segment, token) {
    if (!currentMaskEvent || currentMaskEvent.token !== token) return;
    const running = currentMaskEvent;
    running.segment = segment;
    running.pendingSegment = null;

    if (document.visibilityState !== 'visible') {
      running.pendingSegment = segment;
      els.maskEventStatus.textContent = 'Intervention suspendue.';
      els.maskEventPlay.textContent = 'REPRENDRE L’INTERVENTION';
      els.maskEventPlay.classList.remove('hidden');
      return;
    }

    const audio = running.audios[segment];
    running.activeAudio = audio;
    els.maskEventPlay.classList.add('hidden');
    els.maskEventStatus.textContent = running.intro
      ? 'Le Masque vous accueille…'
      : segment === 0
        ? 'Le Masque choisit sa victime…'
        : 'Le Masque dicte sa loi…';

    audio.onended = () => {
      if (!currentMaskEvent || currentMaskEvent.token !== token) return;
      running.activeAudio = null;
      if (running.intro) {
        finishMaskIntroduction();
      } else if (segment === 0) {
        eventAudioGapTimer = setTimeout(() => {
          eventAudioGapTimer = null;
          playMaskEventSegment(1, token);
        }, 320);
      } else {
        showMaskEventResult(token);
      }
    };

    audio.onerror = () => {
      if (!currentMaskEvent || currentMaskEvent.token !== token) return;
      if (running.intro) {
        els.maskEventStatus.textContent =
          'Introduction indisponible. Vous pouvez poursuivre la partie.';
        els.maskEventPlay.classList.add('hidden');
        els.maskIntroSkip.classList.remove('hidden');
      } else {
        showMaskEventResult(token, true);
      }
    };

    audio.play().catch(() => {
      if (!currentMaskEvent || currentMaskEvent.token !== token) return;
      // Certains Android exigent un geste explicite avant l'autoplay.
      els.maskEventStatus.textContent = 'Touchez pour écouter l’intervention.';
      els.maskEventPlay.textContent = 'ÉCOUTER LE MASQUE';
      els.maskEventPlay.classList.remove('hidden');
      if (running.intro) els.maskIntroSkip.classList.remove('hidden');
    });
  }

  function resumeMaskEventAudio() {
    if (!currentMaskEvent) return;
    const running = currentMaskEvent;
    els.maskEventPlay.classList.add('hidden');

    if (running.pendingSegment !== null) {
      playMaskEventSegment(running.pendingSegment, running.token);
      return;
    }

    if (!running.activeAudio) return;
    running.activeAudio.play().then(() => {
      els.maskEventStatus.textContent = running.intro
        ? 'Le Masque vous accueille…'
        : 'Le Masque dicte sa loi…';
      els.maskIntroSkip.classList.add('hidden');
    }).catch(() => {
      els.maskEventStatus.textContent = 'Lecture refusée. Réessayez.';
      els.maskEventPlay.classList.remove('hidden');
      if (running.intro) els.maskIntroSkip.classList.remove('hidden');
    });
  }

  function completeMaskEvent() {
    if (!currentMaskEvent || currentMaskEvent.intro
      || (currentMaskEvent.item.id === 'masque-003'
        && !currentMaskEvent.choiceMade)) return;

    const finished = currentMaskEvent;
    const delay = finished.preview
      ? finished.savedPreviewDelay
      : randomBetween(...EVENT_NEXT_DELAY);
    const deferredTransition = finished.deferredThreshold;
    const deferredGameOver = finished.deferredGameOver;

    dismissMaskEvent();
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();

    // L'alerte et sa voix sont déclenchées APRES le fondu du Masque,
    // pas pendant son discours ni derrière sa fenêtre.
    if (deferredTransition || deferredGameOver) {
      clearTimeout(maskDeferredOutcomeTimer);
      maskDeferredOutcomeTimer = setTimeout(() => {
        maskDeferredOutcomeTimer = null;
        if (deferredTransition && state.value === deferredTransition[1]
          && !deferredGameOver) {
          handleThresholdTransition(
            deferredTransition[0], deferredTransition[1]
          );
        }
        if (deferredGameOver) checkGameOver();
      }, REDUCED_MOTION ? 0 : 790);
    }
  }

  function handleAudioEventVisibility() {
    updateAudioEventClock();
    if (!currentMaskEvent || document.visibilityState !== 'hidden') return;
    const running = currentMaskEvent;
    if (running.activeAudio && !running.activeAudio.paused) {
      running.activeAudio.pause();
      els.maskEventStatus.textContent = 'Intervention suspendue.';
      els.maskEventPlay.textContent = 'REPRENDRE L’AUDIO';
      els.maskEventPlay.classList.remove('hidden');
    }
  }

  // =========================================================
  // DÉMARRAGE / ÉVÉNEMENTS
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

    scheduleMaskDisturbance();

    updateAudioEventClock();

    if (
      state.musicOn
    ) {
      setMusic(true);
    }

    if (
      state.value >= 100
    ) {
      checkGameOver();
    }
  }

  function bindEvents() {
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

    els.btnNew
      .addEventListener(
        'click',
        requestNewGame
      );

    els.btnStartEvents.addEventListener('click', startAudioEvents);
    els.btnPlayers.addEventListener('click', openPlayersModal);
    els.playersClose.addEventListener('click', closePlayersModal);
    els.testMaskEventSelect.addEventListener('change', renderEventControls);
    els.btnTestMaskEvent.addEventListener('click', () => {
      // Disponible uniquement avec ?test-events=1, sur la branche de test.
      if (!EVENT_TEST_MODE) return;
      const selected = AUDIO_EVENTS.find(item =>
        item.id === els.testMaskEventSelect.value
      );
      if (!selected || state.value < (selected.minInstability || 0)) return;
      beginMaskEvent(selected, true);
    });
    els.maskEventPlay.addEventListener('click', resumeMaskEventAudio);
    els.maskIntroSkip.addEventListener('click', () => finishMaskIntroduction(true));
    els.maskChoiceSelf.addEventListener('click', () => chooseMaskSacrifice('self'));
    els.maskChoiceGroup.addEventListener('click', () => chooseMaskSacrifice('group'));
    els.maskEventDone.addEventListener('click', completeMaskEvent);


    els.audioToggle
      .addEventListener(
        'click',
        () => {
          // Si le navigateur a refusé l'autoplay initial, le clic lance
          // la musique au lieu de la désactiver involontairement.
          if (state.musicOn && musicPlayBlocked) {
            syncMusicForActiveTab();
          } else {
            setMusic(!state.musicOn);
          }
        }
      );

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
          if (document.visibilityState === 'visible') {
            requestWakeLock();
          }
          handleAudioEventVisibility();
        }
      );

    window.addEventListener('pagehide', pauseAudioEventClock);

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

          if (els.playersModal.classList.contains('show')) {
            closePlayersModal();
            return;
          }

          if (
            els.dossierModal
              .classList
              .contains('show')
          ) {
            closeDossier();
          }

          else if (
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

  function init() {
    preloadMasks();

    buildInstabilityButtons();

    setupTabs();

    setupBestiaire();

    bindEvents();

    setupInstallBanner();

    els.version.textContent =
      VERSION;

    renderEventControls();

    syncAmbientVolume();

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
