(() => {
  'use strict';

  // =========================================================
  // CONFIGURATION
  // =========================================================

  const STEPS = [5, 10, 15, 20];
  const THRESHOLD = 50;
  const VERSION = 'v1.1.3 Masque 004 (test)';
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
    radioMissionTab: $('radioMissionTab'),
    radioMissionToggle: $('radioMissionToggle'),
    radioMissionPanel: $('radioMissionPanel'),
    radioMissionTitle: $('radioMissionTitle'),
    radioMissionText: $('radioMissionText'),
    radioMissionArrived: $('radioMissionArrived'),
    radioMissionAbandon: $('radioMissionAbandon'),
    radioEventOverlay: $('radioEventOverlay'),
    radioEventHeading: $('radioEventHeading'),
    radioEventStatus: $('radioEventStatus'),
    radioEventPlay: $('radioEventPlay'),
    radioEventSkip: $('radioEventSkip'),
    radioEventAccept: $('radioEventAccept'),
    radioEventIgnore: $('radioEventIgnore'),
    radioEventDone: $('radioEventDone'),
    weatherEventOverlay: $('weatherEventOverlay'),
    weatherEventSymbol: $('weatherEventSymbol'),
    weatherEventHeading: $('weatherEventHeading'),
    weatherEventStatus: $('weatherEventStatus'),
    weatherEventPlay: $('weatherEventPlay'),
    weatherEventSkip: $('weatherEventSkip'),
    weatherEventResult: $('weatherEventResult'),
    weatherEventEffect: $('weatherEventEffect'),
    weatherEventChange: $('weatherEventChange'),
    weatherEventValues: $('weatherEventValues'),
    weatherEventDone: $('weatherEventDone'),
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
    maskDuelPanel: $('maskDuelPanel'),
    maskDuelPlayer1: $('maskDuelPlayer1'),
    maskDuelPlayer2: $('maskDuelPlayer2'),
    maskDuelHelp: $('maskDuelHelp'),
    maskDuelClock: $('maskDuelClock'),
    maskDuelTrack: $('maskDuelTrack'),
    maskDuelProgress: $('maskDuelProgress'),
    maskDuelStart: $('maskDuelStart'),
    maskDuelLoss1: $('maskDuelLoss1'),
    maskDuelLoss2: $('maskDuelLoss2'),
    maskDuelSuccess: $('maskDuelSuccess'),
    maskDuelSkipAudio: $('maskDuelSkipAudio'),

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
  const activeHauntSounds = new Set();
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
  const WEATHER_MIN_GAP_MS = 45 * 60000;
  const WEATHER_MAX_PER_GAME = 4;
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
    },
    {
      id: 'masque-004',
      type: 'masque',
      title: 'LE REGARD DU VICE',
      audio: 'audio/events/masque/interventions/masque-004-regard-du-vice-intro.mp3',
      duelAudio: 'audio/events/masque/interventions/masque-004-regard-du-vice-epreuve.mp3',
      lossAudio: 'audio/events/masque/interventions/masque-004-regard-du-vice-perdant.mp3',
      successAudio: 'audio/events/masque/interventions/masque-004-regard-du-vice-reussite.mp3',
      target: 'deux-joueurs-vivants'
    },
    {
      id: 'radio-001',
      type: 'radio',
      title: 'DERRIÈRE LA PORTE',
      destination: 'Station de pompage — Quartier 2',
      audio: 'audio/events/radio/radio-001-derriere-la-porte.MP3',
      resolutionAudio: 'audio/events/radio/radio-001-resolution-local-vide.mp3'
    },
    {
      id: 'meteo-001', type: 'meteo', title: 'LA PRESSION FANTÔME', icon: '🌫️',
      audio: 'audio/events/meteo/meteo-001-pression-fantome.mp3', delta: 5
    },
    {
      id: 'meteo-002', type: 'meteo', title: 'LA PLUIE À REBOURS', icon: '🌧️',
      audio: 'audio/events/meteo/meteo-002-pluie-a-rebours.mp3', delta: 5
    }
  ];
  const eventSession = readAudioEventSession();
  let eventTimer = null;
  let eventDueAt = null;
  let currentMaskEvent = null;
  let currentRadioEvent = null;
  let radioEventToken = 0;
  let currentWeatherEvent = null;
  let weatherEventToken = 0;
  let weatherReadyTimer = null;
  let weatherClosingTimer = null;
  let weatherDeferredOutcomeTimer = null;
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
      || els.radioEventOverlay.classList.contains('show')
      || els.weatherEventOverlay.classList.contains('show')
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
    // Les manifestations ne peuvent pas démarrer sous une intervention.
    if (specialAudioActive || currentMaskEvent) return;

    const src = HAUNT.sfx[
      Math.floor(Math.random() * HAUNT.sfx.length)
    ];
    const audio = playOneShot(src, HAUNT.volume);
    activeHauntSounds.add(audio);

    const release = () => activeHauntSounds.delete(audio);
    audio.addEventListener('ended', release, { once: true });
    audio.addEventListener('error', release, { once: true });
  }

  function silenceHauntSounds() {
    // Un corbeau ayant commencé 50 ms AVANT l'intervention doit
    // aussi s'effacer, pas seulement les sons futurs.
    for (const audio of activeHauntSounds) {
      if (audio.paused || audio.ended) {
        activeHauntSounds.delete(audio);
        continue;
      }
      fadeAudioVolume(audio, 0, 150).then(() => {
        audio.pause();
        activeHauntSounds.delete(audio);
      });
    }
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
          renderRadioMission();
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
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./service-worker.js')
      .then(async registration => {
        // Le cache léger de l'interface s'installe d'abord. Les médias lourds
        // sont préparés ensuite, sans bloquer le fonctionnement hors ligne.
        registration.update().catch(() => {});
        const ready = await navigator.serviceWorker.ready;
        if (navigator.onLine !== false) {
          ready.active?.postMessage({ type: 'rdv-cache-offline-media' });
        }
      })
      .catch(() => {});
  }


  // =========================================================
  // INTERVENTIONS AUDIO — v1 / LE COLLECTIONNEUR
  // =========================================================

  function readAudioEventSession() {
    const defaults = {
      active: false,
      introPlayed: false,
      radioMission: null,
      lastEventType: null,
      weatherCount: 0,
      nextWeatherEligibleAt: 0,
      pendingWeather: null,
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
        radioMission: saved.radioMission
          && typeof saved.radioMission.id === 'string'
          && ['travel', 'resolving', 'reward'].includes(saved.radioMission.stage)
            ? {
                id: saved.radioMission.id,
                stage: saved.radioMission.stage,
                recipients: Array.isArray(saved.radioMission.recipients)
                  ? saved.radioMission.recipients.filter(n =>
                    Number.isInteger(n) && n >= 1 && n <= 4
                  ) : []
              }
            : null,
        lastEventType: ['masque', 'radio', 'meteo'].includes(saved.lastEventType)
          ? saved.lastEventType : null,
        weatherCount: Number.isInteger(saved.weatherCount)
          ? Math.max(0, Math.min(WEATHER_MAX_PER_GAME, saved.weatherCount)) : 0,
        nextWeatherEligibleAt: Number.isFinite(saved.nextWeatherEligibleAt)
          ? Math.max(0, saved.nextWeatherEligibleAt) : 0,
        pendingWeather: saved.pendingWeather && typeof saved.pendingWeather.id === 'string'
          && ['playing', 'result'].includes(saved.pendingWeather.stage)
          ? {
              id: saved.pendingWeather.id,
              stage: saved.pendingWeather.stage,
              before: Number.isFinite(saved.pendingWeather.before)
                ? saved.pendingWeather.before : null,
              after: Number.isFinite(saved.pendingWeather.after)
                ? saved.pendingWeather.after : null,
              gameOver: saved.pendingWeather.gameOver === true
            } : null,
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
      && (item.id !== 'masque-004' || livingPlayerNumbers().length >= 2)
      && !(eventSession.radioMission
        && eventSession.radioMission.stage !== 'travel'
        && item.type === 'radio')
      && (item.type !== 'meteo'
        || (eventSession.weatherCount < WEATHER_MAX_PER_GAME
          && !eventSession.pendingWeather
          && Date.now() >= eventSession.nextWeatherEligibleAt))
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
    const insufficientDuelPlayers = testEvent.id === 'masque-004' && alive < 2;
    const locked = state.value < (testEvent.minInstability || 0);
    els.btnTestMaskEvent.textContent = insufficientDuelPlayers
      ? 'TEST : 2 VIVANTS MINIMUM'
      : locked
      ? 'TEST : MINIMUM ' + testEvent.minInstability + '%'
      : testEvent.type === 'radio' ? 'TESTER LA RADIO'
        : testEvent.type === 'meteo' ? 'TESTER LA MÉTÉO'
        : 'TESTER LE MASQUE';
    els.btnTestMaskEvent.disabled = !eventSession.active || currentMaskEvent !== null
      || currentRadioEvent !== null || currentWeatherEvent !== null
      || eventSession.pendingWeather !== null || alive === 0
      || state.value >= 100 || locked || insufficientDuelPlayers
      || (testEvent.type === 'radio' && eventSession.radioMission
          && eventSession.radioMission.stage !== 'travel');
    renderRadioMission();
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

  function scheduleWeatherUnlockWake() {
    clearTimeout(weatherReadyTimer);
    weatherReadyTimer = null;
    const hasUnplayedWeather = unusedAudioEvents().some(item => item.type === 'meteo');
    if (!appStarted || !eventSession.active || gameOverShown
      || state.value >= 100 || eventSession.pendingWeather
      || eventSession.weatherCount >= WEATHER_MAX_PER_GAME
      || !hasUnplayedWeather) return;

    const remaining = eventSession.nextWeatherEligibleAt - Date.now();
    if (remaining <= 0) return;
    weatherReadyTimer = setTimeout(() => {
      weatherReadyTimer = null;
      updateAudioEventClock();
    }, Math.max(1000, remaining + 50));
  }

  function audioEventClockAllowed() {
    return appStarted
      && eventSession.active
      && !gameOverShown
      && state.value < 100
      && document.visibilityState === 'visible'
      && isPartieTabActive()
      && currentMaskEvent === null
      && currentRadioEvent === null
      && currentWeatherEvent === null
      && !eventSession.pendingWeather
      && !(eventSession.radioMission
        && eventSession.radioMission.stage !== 'travel')
      && livingPlayerNumbers().length > 0
      && eligibleAudioEvents().length > 0;
  }

  function updateAudioEventClock() {
    scheduleWeatherUnlockWake();
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

    let candidates = eligibleAudioEvents();
    if (candidates.length === 0) return;
    // Des types différents se succèdent dès que la pioche le permet.
    const otherType = candidates.filter(
      item => item.type !== eventSession.lastEventType
    );
    if (otherType.length) candidates = otherType;
    const item = candidates[randomBetween(0, candidates.length - 1)];
    const started = item.type === 'radio'
      ? beginRadioEvent(item, false)
      : item.type === 'meteo'
        ? beginWeatherEvent(item, false)
        : beginMaskEvent(item, false);
    if (started) {
      eventSession.lastEventType = item.type;
      saveAudioEventSession();
    } else {
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
    eventSession.weatherCount = 0;
    eventSession.nextWeatherEligibleAt = 0;
    eventSession.pendingWeather = null;
    eventSession.played = [];
    eventSession.remainingMs = randomBetween(...EVENT_FIRST_DELAY);
    saveAudioEventSession();
    renderEventControls();

    // Lecture immédiatement sur le geste de l'utilisateur (Android).
    // Le chronomètre du premier événement attend la FIN de l'introduction.
    if (!beginMaskIntroduction()) updateAudioEventClock();
  }

  function beginMaskIntroduction() {
    if (!eventSession.active || currentMaskEvent || currentRadioEvent || currentWeatherEvent || state.value >= 100
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
    els.maskEventOverlay.classList.remove('closing', 'has-result', 'has-choices', 'has-generosity');
    els.maskEventPlay.classList.add('hidden');
    els.maskIntroSkip.classList.add('hidden');
    els.maskEventResult.classList.add('hidden');
    els.maskEventOverlay.classList.add('show');
    els.maskEventOverlay.setAttribute('aria-hidden', 'false');

    specialAudioActive = true;
    silenceHauntSounds();
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

    if (currentMaskEvent?.duelTimer !== null && currentMaskEvent?.duelTimer !== undefined) {
      clearInterval(currentMaskEvent.duelTimer);
    }

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
      overlay.classList.remove('show', 'closing', 'has-result', 'has-choices', 'has-generosity');
    } else {
      overlay.classList.add('closing');
      overlay.classList.remove('show');
      maskClosingTimer = setTimeout(() => {
        maskClosingTimer = null;
        overlay.classList.remove('closing', 'has-result', 'has-choices', 'has-generosity');
      }, REDUCED_MOTION ? 0 : 740);
    }

    overlay.setAttribute('aria-hidden', 'true');
    els.maskEventPlay.classList.add('hidden');
    els.maskIntroSkip.classList.add('hidden');
    els.maskDuelPanel.classList.add('hidden');
    els.maskDuelSkipAudio.classList.add('hidden');
    overlay.classList.remove('has-duel');
    els.maskEventResult.classList.add('hidden');
    specialAudioActive = false;
    syncAmbientVolume();
  }

  function resetAudioEventSession() {
    clearTimeout(maskDeferredOutcomeTimer);
    maskDeferredOutcomeTimer = null;
    pauseAudioEventClock();
    dismissMaskEvent(true);
    dismissRadioEvent(true);
    dismissWeatherEvent(true);
    clearTimeout(weatherReadyTimer);
    weatherReadyTimer = null;
    clearTimeout(weatherDeferredOutcomeTimer);
    weatherDeferredOutcomeTimer = null;
    eventSession.active = false;
    eventSession.introPlayed = false;
    eventSession.radioMission = null;
    eventSession.lastEventType = null;
    eventSession.weatherCount = 0;
    eventSession.nextWeatherEligibleAt = 0;
    eventSession.pendingWeather = null;
    eventSession.alive = [true, true, true, true];
    eventSession.played = [];
    eventSession.remainingMs = null;
    saveAudioEventSession();
    renderEventControls();
  }

  function stopAudioEventsForGameOver() {
    clearTimeout(maskDeferredOutcomeTimer);
    maskDeferredOutcomeTimer = null;
    if (!eventSession.active && !currentMaskEvent && !currentRadioEvent
      && !currentWeatherEvent && !eventSession.pendingWeather) return;
    pauseAudioEventClock();
    dismissMaskEvent(true);
    dismissRadioEvent(true);
    dismissWeatherEvent(true);
    clearTimeout(weatherReadyTimer);
    weatherReadyTimer = null;
    clearTimeout(weatherDeferredOutcomeTimer);
    weatherDeferredOutcomeTimer = null;
    eventSession.active = false;
    eventSession.radioMission = null;
    eventSession.pendingWeather = null;
    eventSession.remainingMs = null;
    saveAudioEventSession();
    renderEventControls();
  }

  function beginMaskEvent(item, preview) {
    if (!eventSession.active || currentMaskEvent || currentRadioEvent || currentWeatherEvent || state.value >= 100
      || document.visibilityState !== 'visible' || !isPartieTabActive()
      || specialAudioActive || anyBlockingModalOpen()) return false;

    const possibleTargets = livingPlayerNumbers();
    if (possibleTargets.length === 0
      || (item.id === 'masque-004' && possibleTargets.length < 2)) return false;

    pauseAudioEventClock();
    const savedPreviewDelay = eventSession.remainingMs;
    const player = possibleTargets[randomBetween(0, possibleTargets.length - 1)];
    const otherPlayers = possibleTargets.filter(number => number !== player);
    const opponent = item.id === 'masque-004'
      ? otherPlayers[randomBetween(0, otherPlayers.length - 1)]
      : null;
    const token = ++maskEventToken;

    const audios = [
      new Audio('audio/events/masque/designations/joueur-' + player + '.mp3')
    ];
    if (opponent !== null) {
      audios.push(new Audio('audio/events/masque/designations/joueur-' + opponent + '.mp3'));
    }
    audios.push(new Audio(item.audio));
    if (item.id === 'masque-004') audios.push(new Audio(item.duelAudio));

    currentMaskEvent = {
      token,
      item,
      player,
      opponent,
      preview,
      savedPreviewDelay,
      segment: 0,
      pendingSegment: null,
      activeAudio: null,
      duelAudio: item.id === 'masque-004' ? audios[3] : null,
      duelStage: null,
      duelTimer: null,
      duelRemainingMs: 30000,
      duelDeadline: null,
      audios
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
    els.maskEventOverlay.classList.remove('closing', 'has-result', 'has-choices', 'has-generosity', 'has-duel');
    els.maskIntroSkip.classList.add('hidden');
    els.maskEventPlay.classList.add('hidden');
    els.maskDuelPanel.classList.add('hidden');
    els.maskDuelSkipAudio.classList.add('hidden');
    els.maskEventResult.classList.add('hidden');
    els.maskEventOverlay.classList.add('show');
    els.maskEventOverlay.setAttribute('aria-hidden', 'false');

    specialAudioActive = true;
    silenceHauntSounds();
    syncAmbientVolume();
    renderEventControls();
    playMaskEventSegment(0, token);
    return true;
  }

  function showMaskEventResult(token, audioUnavailable = false) {
    if (!currentMaskEvent || currentMaskEvent.token !== token
      || currentMaskEvent.intro) return;

    const running = currentMaskEvent;
    if (running.item.id === 'masque-004') {
      showMaskDuelReward(token, audioUnavailable);
      return;
    }
    const player = running.player;
    els.maskEventStatus.textContent = audioUnavailable
      ? 'Audio indisponible — appliquez la conséquence ci-dessous.'
      : 'Le Masque a prononcé sa sentence.';
    els.maskEventPlay.classList.add('hidden');
    els.maskEventInventoryLabel.classList.toggle(
      'hidden', running.item.id !== 'masque-001'
    );
    els.maskEventOverlay.classList.toggle(
      'has-choices', running.item.id === 'masque-003'
    );
    els.maskEventOverlay.classList.toggle(
      'has-generosity', running.item.id === 'masque-002'
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
        'Le Masque a réduit l’Instabilité mentale de 5 %.\n\n'
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
        + 'L’Instabilité mentale ne change pas.';
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
        + 'Instabilité mentale : ' + before + '% → ' + state.value
        + '% (+' + effect.actual + ' points).\n\n'
        + (effect.gameOver
          ? 'Le seuil de 100 % est atteint : la fin de partie sera déclenchée '
            + 'après la fermeture de cette fenêtre.'
          : 'Aucune blessure ni perte de tour pour le joueur désigné.');
    }

    els.maskEventDone.focus();
  }


  // =========================================================
  // MASQUE 004 — LE REGARD DU VICE : DUEL EN TEMPS RÉEL
  // =========================================================

  function renderMaskDuelCountdown(running) {
    const remaining = Math.max(0, running.duelRemainingMs);
    const seconds = Math.ceil(remaining / 1000);
    els.maskDuelClock.textContent = '00:' + String(seconds).padStart(2, '0');
    els.maskDuelProgress.style.width = (remaining / 30000 * 100).toFixed(2) + '%';
    els.maskDuelTrack.setAttribute('aria-valuenow', String(seconds));
  }

  function showMaskDuelReady(token) {
    const running = currentMaskEvent;
    if (!running || running.token !== token || running.item.id !== 'masque-004') return;

    running.activeAudio = null;
    running.duelStage = 'ready';
    running.duelRemainingMs = 30000;
    els.maskEventStatus.textContent = 'Deux regards. Un arbitre. Trente secondes.';
    els.maskEventPlay.classList.add('hidden');
    els.maskEventOverlay.classList.add('has-duel');
    els.maskDuelPlayer1.textContent = 'JOUEUR ' + running.player;
    els.maskDuelPlayer2.textContent = 'JOUEUR ' + running.opponent;
    els.maskDuelHelp.textContent = livingPlayerNumbers().length > 2
      ? 'Confiez le téléphone à un témoin. Le premier à détourner les yeux perd.'
      : 'Confiez le téléphone à un témoin disponible. Sinon, confirmez honnêtement le résultat après le duel.';
    els.maskDuelLoss1.textContent = 'JOUEUR ' + running.player + ' A DÉTOURNÉ LE REGARD';
    els.maskDuelLoss2.textContent = 'JOUEUR ' + running.opponent + ' A DÉTOURNÉ LE REGARD';
    els.maskDuelLoss1.disabled = true;
    els.maskDuelLoss2.disabled = true;
    els.maskDuelSuccess.disabled = true;
    els.maskDuelStart.textContent = 'COMMENCER L’ÉPREUVE';
    els.maskDuelStart.classList.remove('hidden');
    renderMaskDuelCountdown(running);
    els.maskDuelPanel.classList.remove('hidden');
    els.maskDuelStart.focus();
  }

  function tickMaskDuel(token) {
    const running = currentMaskEvent;
    if (!running || running.token !== token || running.duelStage !== 'running') return;
    running.duelRemainingMs = Math.max(0, running.duelDeadline - performance.now());
    renderMaskDuelCountdown(running);
    if (running.duelRemainingMs !== 0) return;
    clearInterval(running.duelTimer);
    running.duelTimer = null;
    running.duelStage = 'awaiting-verdict';
    els.maskDuelSuccess.disabled = false;
    els.maskEventStatus.textContent = 'Temps écoulé. L’arbitre confirme le résultat.';
    els.maskDuelHelp.textContent =
      'Les deux ont-ils tenu ? Si quelqu’un a cédé, indiquez lequel.';
  }

  function startMaskDuel() {
    const running = currentMaskEvent;
    if (!running || running.item.id !== 'masque-004'
      || !['ready', 'paused'].includes(running.duelStage)) return;

    const isResume = running.duelStage === 'paused';
    running.duelStage = 'running';
    running.duelDeadline = performance.now() + running.duelRemainingMs;
    els.maskDuelStart.classList.add('hidden');
    els.maskDuelLoss1.disabled = false;
    els.maskDuelLoss2.disabled = false;
    els.maskDuelSuccess.disabled = true;
    els.maskEventStatus.textContent = 'Ne détournez pas les yeux.';
    els.maskDuelHelp.textContent = 'L’arbitre interrompt immédiatement le duel au premier regard détourné.';
    running.duelAudio.play().catch(() => {
      if (currentMaskEvent !== running || running.duelStage !== 'running') return;
      els.maskDuelHelp.textContent =
        'Audio indisponible. Le chronomètre continue ; l’arbitre surveille les regards.';
    });
    running.duelTimer = setInterval(() => tickMaskDuel(running.token), 100);
    tickMaskDuel(running.token);
  }

  function pauseMaskDuel() {
    const running = currentMaskEvent;
    if (!running || running.item.id !== 'masque-004' || running.duelStage !== 'running') return;
    running.duelRemainingMs = Math.max(0, running.duelDeadline - performance.now());
    clearInterval(running.duelTimer);
    running.duelTimer = null;
    running.duelAudio.pause();
    running.duelStage = 'paused';
    renderMaskDuelCountdown(running);
    els.maskDuelLoss1.disabled = true;
    els.maskDuelLoss2.disabled = true;
    els.maskDuelStart.textContent = 'REPRENDRE L’ÉPREUVE';
    els.maskDuelStart.classList.remove('hidden');
    els.maskEventStatus.textContent = 'Épreuve suspendue. Reprenez lorsque les joueurs sont prêts.';
  }

  function resolveMaskDuel(outcome) {
    const running = currentMaskEvent;
    if (!running || running.item.id !== 'masque-004'
      || !['running', 'awaiting-verdict'].includes(running.duelStage)) return;
    if (outcome === 'both' && running.duelStage !== 'awaiting-verdict') return;
    if (!['first', 'second', 'both'].includes(outcome)) return;

    running.duelOutcome = outcome;
    running.duelStage = 'reaction';
    clearInterval(running.duelTimer);
    running.duelTimer = null;
    running.duelAudio.pause();
    running.activeAudio = null;
    els.maskDuelLoss1.disabled = true;
    els.maskDuelLoss2.disabled = true;
    els.maskDuelSuccess.disabled = true;
    els.maskDuelPanel.classList.add('hidden');
    els.maskEventOverlay.classList.remove('has-duel');
    els.maskEventStatus.textContent = 'Le Masque réagit à votre choix…';

    const reaction = new Audio(
      outcome === 'both' ? running.item.successAudio : running.item.lossAudio
    );
    reaction.volume = 1;
    reaction.preload = 'auto';
    running.audios.push(reaction);
    running.activeAudio = reaction;
    const token = running.token;
    reaction.onended = () => showMaskDuelReward(token);
    reaction.onerror = () => showMaskDuelReward(token, true);
    reaction.play().catch(() => {
      if (currentMaskEvent !== running || running.duelStage !== 'reaction') return;
      els.maskEventStatus.textContent = 'Touchez pour écouter le verdict.';
      els.maskEventPlay.textContent = 'ÉCOUTER LE VERDICT';
      els.maskEventPlay.classList.remove('hidden');
      els.maskDuelSkipAudio.classList.remove('hidden');
    });
  }

  function showMaskDuelReward(token, audioUnavailable = false) {
    const running = currentMaskEvent;
    if (!running || running.token !== token || running.item.id !== 'masque-004'
      || running.duelStage !== 'reaction') return;
    running.duelStage = 'done';
    running.activeAudio = null;
    els.maskEventPlay.classList.add('hidden');
    els.maskDuelSkipAudio.classList.add('hidden');
    els.maskEventStatus.textContent = audioUnavailable
      ? 'Verdict audio indisponible — appliquez la récompense.'
      : 'Le Masque a rendu son verdict.';
    els.maskEventInventoryLabel.classList.add('hidden');
    els.maskEventChoices.classList.add('hidden');
    els.maskEventDone.classList.remove('hidden');
    if (running.duelOutcome === 'both') {
      els.maskEventEffect.textContent =
        'Les joueurs ' + running.player + ' et ' + running.opponent
        + ' ont tenu 30 secondes.\\n\\n'
        + 'Chacun pioche 1 carte Objet (2 cartes au total).';
    } else {
      const loser = running.duelOutcome === 'first' ? running.player : running.opponent;
      els.maskEventEffect.textContent =
        'Joueur ' + loser + ' a détourné le regard.\\n\\n'
        + 'Le Masque le prend en pitié : ce joueur pioche 1 carte Objet. '
        + 'L’autre ne reçoit rien.';
    }
    els.maskEventResult.classList.remove('hidden');
    els.maskEventOverlay.classList.add('has-result');
    els.maskEventDone.focus();
  }

  function skipMaskDuelReaction() {
    const running = currentMaskEvent;
    if (!running || running.item.id !== 'masque-004' || running.duelStage !== 'reaction') return;
    running.activeAudio?.pause();
    showMaskDuelReward(running.token, true);
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
      } else if (running.item.id === 'masque-004') {
        if (segment < 2) {
          eventAudioGapTimer = setTimeout(() => {
            eventAudioGapTimer = null;
            playMaskEventSegment(segment + 1, token);
          }, 320);
        } else {
          showMaskDuelReady(token);
        }
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
      } else if (running.item.id === 'masque-004') {
        // Même si une désignation ou l'introduction est introuvable,
        // l'épreuve physique reste jouable.
        if (segment < 2) playMaskEventSegment(segment + 1, token);
        else showMaskDuelReady(token);
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
        : running.item?.id === 'masque-004' && running.duelStage === 'reaction'
          ? 'Le Masque rend son verdict…'
          : 'Le Masque dicte sa loi…';
      els.maskDuelSkipAudio.classList.add('hidden');
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
        && !currentMaskEvent.choiceMade)
      || (currentMaskEvent.item.id === 'masque-004'
        && currentMaskEvent.duelStage !== 'done')) return;

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
    if (currentWeatherEvent && document.visibilityState === 'hidden'
      && currentWeatherEvent.audio && !currentWeatherEvent.audio.paused) {
      currentWeatherEvent.audio.pause();
      showWeatherAudioFallback('Narration suspendue. Touchez pour reprendre.');
    }
    if (currentRadioEvent && document.visibilityState === 'hidden'
      && currentRadioEvent.audio
      && !currentRadioEvent.audio.paused) {
      currentRadioEvent.audio.pause();
      showRadioAudioFallback();
    }
    if (!currentMaskEvent || document.visibilityState !== 'hidden') return;
    const running = currentMaskEvent;
    if (running.item?.id === 'masque-004' && running.duelStage === 'running') {
      pauseMaskDuel();
      return;
    }
    if (running.activeAudio && !running.activeAudio.paused) {
      running.activeAudio.pause();
      els.maskEventStatus.textContent = 'Intervention suspendue.';
      els.maskEventPlay.textContent = 'REPRENDRE L’AUDIO';
      els.maskEventPlay.classList.remove('hidden');
    }
  }


  // =========================================================
  // RADIO : APPEL, DÉPLACEMENT IMMÉDIAT, RÉSOLUTION
  // =========================================================

  function getRadioItem(id) {
    return AUDIO_EVENTS.find(item => item.type === 'radio' && item.id === id);
  }

  function renderRadioMission() {
    const mission = eventSession.radioMission;
    const show = Boolean(eventSession.active && mission && isPartieTabActive()
      && !currentRadioEvent && !gameOverShown && state.value < 100);
    els.radioMissionTab.classList.toggle('hidden', !show);
    if (!show) return;

    const item = getRadioItem(mission.id);
    els.radioMissionTitle.textContent = mission.stage === 'travel'
      ? 'APPEL EN COURS — ' + (item ? item.destination : 'Lieu inconnu')
      : 'TRANSMISSION — RÉSOLUTION EN ATTENTE';
    els.radioMissionText.textContent = mission.stage === 'travel'
      ? 'Rejoignez immédiatement le bâtiment indiqué. Appliquez les pénalités '
        + 'habituelles de déplacement avant de confirmer votre arrivée.'
      : mission.stage === 'resolving'
        ? 'Vous êtes arrivés sur place. Écoutez le récit du narrateur pour '
          + 'découvrir ce que vous avez trouvé.'
        : 'La découverte a déjà eu lieu. Retrouvez la récompense et confirmez '
          + 'sa distribution sans piocher deux fois.';
    els.radioMissionArrived.textContent = mission.stage === 'travel'
      ? 'NOUS Y SOMMES !'
      : mission.stage === 'resolving'
        ? 'ÉCOUTER LA RÉSOLUTION'
        : 'VOIR LA RÉCOMPENSE';
    els.radioMissionAbandon.textContent = mission.stage === 'travel'
      ? 'ABANDONNER L’APPEL'
      : 'ANNULER LA MISSION';
  }

  function closeRadioMissionPanel() {
    els.radioMissionTab.classList.remove('is-open');
    els.radioMissionPanel.classList.add('hidden');
    els.radioMissionToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleRadioMissionPanel() {
    if (!eventSession.radioMission || currentRadioEvent) return;
    const isOpen = !els.radioMissionTab.classList.contains('is-open');
    els.radioMissionTab.classList.toggle('is-open', isOpen);
    els.radioMissionPanel.classList.toggle('hidden', !isOpen);
    els.radioMissionToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function dismissRadioEvent() {
    radioEventToken += 1;
    if (currentRadioEvent && currentRadioEvent.audio) {
      const audio = currentRadioEvent.audio;
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
    }
    currentRadioEvent = null;
    els.radioEventOverlay.classList.remove('show', 'is-speaking', 'is-resolution');
    els.radioEventOverlay.setAttribute('aria-hidden', 'true');
    els.radioEventPlay.classList.add('hidden');
    els.radioEventSkip.classList.add('hidden');
    els.radioEventAccept.classList.add('hidden');
    els.radioEventIgnore.classList.add('hidden');
    els.radioEventDone.classList.add('hidden');
    specialAudioActive = false;
    syncAmbientVolume();
    renderEventControls();
  }

  function showRadioAudioFallback() {
    const event = currentRadioEvent;
    if (!event) return;
    els.radioEventOverlay.classList.remove('is-speaking');
    els.radioEventStatus.textContent =
      'La lecture a été interrompue. Vous pouvez réessayer ou continuer sans audio.';
    els.radioEventPlay.textContent = 'ÉCOUTER LA TRANSMISSION';
    els.radioEventPlay.classList.remove('hidden');
    els.radioEventSkip.classList.remove('hidden');
  }

  function playRadioEventAudio() {
    const event = currentRadioEvent;
    if (!event || !event.audio) return;
    const token = event.token;
    const audio = event.audio;
    els.radioEventPlay.classList.add('hidden');
    els.radioEventSkip.classList.add('hidden');
    els.radioEventOverlay.classList.add('is-speaking');
    els.radioEventStatus.textContent = event.phase === 'call'
      ? 'Une voix traverse les parasites de la fréquence…'
      : 'Vous découvrez enfin ce qui se cache derrière cet appel…';

    audio.onended = () => {
      if (!currentRadioEvent || currentRadioEvent.token !== token) return;
      els.radioEventOverlay.classList.remove('is-speaking');
      if (event.phase === 'call') {
        showRadioCallChoices();
      } else {
        showRadioReward();
      }
    };
    audio.onerror = () => {
      if (currentRadioEvent && currentRadioEvent.token === token) {
        showRadioAudioFallback();
      }
    };
    try {
      audio.play().catch(() => {
        if (currentRadioEvent && currentRadioEvent.token === token) {
          showRadioAudioFallback();
        }
      });
    } catch (_) {
      showRadioAudioFallback();
    }
  }

  function beginRadioEvent(item, preview) {
    if (!item || item.type !== 'radio' || !eventSession.active
      || currentMaskEvent || currentRadioEvent || currentWeatherEvent
      || specialAudioActive || anyBlockingModalOpen()
      || document.visibilityState !== 'visible'
      || !isPartieTabActive() || state.value >= 100
      || (eventSession.radioMission
        && eventSession.radioMission.stage !== 'travel')) return false;

    pauseAudioEventClock();
    const savedPreviewDelay = eventSession.remainingMs;

    // Un appel entrant remplace définitivement la mission radio non terminée.
    if (eventSession.radioMission) eventSession.radioMission = null;
    closeRadioMissionPanel();
    const token = ++radioEventToken;
    const audio = new Audio(item.audio);
    audio.preload = 'auto';
    audio.volume = 1;
    currentRadioEvent = {
      token, item, audio, preview,
      phase: 'call', savedPreviewDelay
    };

    if (!preview) {
      eventSession.played.push(item.id);
      eventSession.remainingMs = null;
    }
    saveAudioEventSession();

    els.radioEventHeading.textContent = 'TRANSMISSION INTERCEPTÉE';
    els.radioEventStatus.textContent = 'Une fréquence inconnue s’active…';
    els.radioEventPlay.classList.add('hidden');
    els.radioEventSkip.classList.add('hidden');
    els.radioEventAccept.classList.add('hidden');
    els.radioEventIgnore.classList.add('hidden');
    els.radioEventDone.classList.add('hidden');
    els.radioEventOverlay.classList.remove('is-resolution');
    els.radioEventOverlay.classList.add('show');
    els.radioEventOverlay.setAttribute('aria-hidden', 'false');

    specialAudioActive = true;
    silenceHauntSounds();
    syncAmbientVolume();
    renderEventControls();
    playRadioEventAudio();
    return true;
  }

  function showRadioCallChoices() {
    if (!currentRadioEvent || currentRadioEvent.phase !== 'call') return;
    els.radioEventStatus.textContent =
      'Une voix demande de l’aide depuis la station de pompage.\n'
      + 'Répondre impose un déplacement immédiat jusqu’au bâtiment indiqué.';
    els.radioEventPlay.classList.add('hidden');
    els.radioEventSkip.classList.add('hidden');
    els.radioEventAccept.classList.remove('hidden');
    els.radioEventIgnore.classList.remove('hidden');
    els.radioEventAccept.focus();
  }

  function answerRadioCall(accept) {
    const event = currentRadioEvent;
    if (!event || event.phase !== 'call' || event.answered) return;
    event.answered = true;

    if (accept) {
      eventSession.radioMission = {
        id: event.item.id, stage: 'travel', recipients: []
      };
    }
    // Ignorer ne provoque aucune sanction : le groupe poursuit sa partie.
    const delay = event.preview
      ? event.savedPreviewDelay
      : randomBetween(...EVENT_NEXT_DELAY);
    dismissRadioEvent();
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();
  }

  function beginRadioResolution() {
    const mission = eventSession.radioMission;
    if (!mission || !eventSession.active
      || !['resolving', 'reward'].includes(mission.stage)
      || currentMaskEvent || currentRadioEvent || currentWeatherEvent
      || specialAudioActive || anyBlockingModalOpen()
      || document.visibilityState !== 'visible' || !isPartieTabActive()) {
      return false;
    }
    const item = getRadioItem(mission.id);
    if (!item) return false;

    closeRadioMissionPanel();
    const token = ++radioEventToken;
    const audio = mission.stage === 'resolving'
      ? new Audio(item.resolutionAudio) : null;
    if (audio) {
      audio.preload = 'auto';
      audio.volume = 1;
    }
    currentRadioEvent = {
      token, item, audio, phase: audio ? 'resolution' : 'reward'
    };
    els.radioEventHeading.textContent = 'LOCAL DE MAINTENANCE';
    els.radioEventPlay.classList.add('hidden');
    els.radioEventSkip.classList.add('hidden');
    els.radioEventAccept.classList.add('hidden');
    els.radioEventIgnore.classList.add('hidden');
    els.radioEventDone.classList.add('hidden');
    els.radioEventOverlay.classList.add('show', 'is-resolution');
    els.radioEventOverlay.setAttribute('aria-hidden', 'false');

    specialAudioActive = true;
    silenceHauntSounds();
    syncAmbientVolume();
    renderEventControls();

    if (audio) playRadioEventAudio();
    else showRadioReward();
    return true;
  }

  function radioMissionArrived() {
    const mission = eventSession.radioMission;
    if (!mission) return;
    if (mission.stage === 'travel') {
      mission.stage = 'resolving';
      saveAudioEventSession();
      renderRadioMission();
    }
    beginRadioResolution();
  }

  function showRadioReward() {
    const event = currentRadioEvent;
    const mission = eventSession.radioMission;
    if (!event || !mission || mission.id !== event.item.id
      || !['resolving', 'reward'].includes(mission.stage)) return;

    // Le bénéficiaire est tiré une seule fois, même si la PWA est rechargée.
    if (mission.stage !== 'reward') {
      const pool = livingPlayerNumbers();
      const chosen = [];
      while (chosen.length < 2 && pool.length) {
        chosen.push(pool.splice(randomBetween(0, pool.length - 1), 1)[0]);
      }
      mission.recipients = chosen;
      mission.stage = 'reward';
      saveAudioEventSession();
    }

    const recipients = mission.recipients;
    els.radioEventOverlay.classList.remove('is-speaking');
    els.radioEventStatus.textContent = recipients.length >= 2
      ? 'Le local est vide… mais les affaires promises sont bien là.\n\n'
        + 'JOUEUR ' + recipients[0] + ' et JOUEUR ' + recipients[1]
        + ' : piochez chacun UNE carte Objet.\n\n'
        + 'Les deux bénéficiaires ont été tirés au hasard.'
      : recipients.length === 1
        ? 'Le local est vide… mais le matériel est toujours là.\n\n'
          + 'JOUEUR ' + recipients[0] + ' : pioche UNE carte Objet.'
        : 'Le local est vide. Aucun survivant ne peut recevoir la récompense.';
    els.radioEventPlay.classList.add('hidden');
    els.radioEventSkip.classList.add('hidden');
    els.radioEventDone.classList.remove('hidden');
    els.radioEventDone.focus();
  }

  function finishRadioResolution() {
    if (!currentRadioEvent || currentRadioEvent.phase === 'call') return;
    const mission = eventSession.radioMission;
    if (!mission || mission.stage !== 'reward') return;
    eventSession.radioMission = null;
    saveAudioEventSession();
    dismissRadioEvent();
    updateAudioEventClock();
  }

  function skipRadioAudio() {
    const event = currentRadioEvent;
    if (!event) return;
    if (event.audio) {
      event.audio.pause();
      event.audio.onended = null;
      event.audio.onerror = null;
    }
    els.radioEventOverlay.classList.remove('is-speaking');
    if (event.phase === 'call') showRadioCallChoices();
    else showRadioReward();
  }

  function abandonRadioMission() {
    const mission = eventSession.radioMission;
    if (!mission || currentRadioEvent) return;
    eventSession.radioMission = null;
    closeRadioMissionPanel();
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();
  }

  // =========================================================
  // MÉTÉO : NARRATION DU MONDE ET CONSÉQUENCE AUTOMATIQUE
  // =========================================================

  function getWeatherItem(id) {
    return AUDIO_EVENTS.find(item => item.type === 'meteo' && item.id === id);
  }

  function dismissWeatherEvent(immediate = false) {
    weatherEventToken += 1;
    if (currentWeatherEvent?.audio) {
      currentWeatherEvent.audio.pause();
      currentWeatherEvent.audio.onended = null;
      currentWeatherEvent.audio.onerror = null;
    }
    currentWeatherEvent = null;
    clearTimeout(weatherClosingTimer);
    weatherClosingTimer = null;
    const overlay = els.weatherEventOverlay;
    overlay.classList.remove('is-speaking');
    if (immediate || !overlay.classList.contains('show')) {
      overlay.classList.remove('show', 'closing');
    } else {
      overlay.classList.remove('show');
      overlay.classList.add('closing');
      weatherClosingTimer = setTimeout(() => {
        weatherClosingTimer = null;
        overlay.classList.remove('closing');
      }, REDUCED_MOTION ? 0 : 740);
    }
    overlay.setAttribute('aria-hidden', 'true');
    els.weatherEventPlay.classList.add('hidden');
    els.weatherEventSkip.classList.add('hidden');
    els.weatherEventResult.classList.add('hidden');
    els.weatherEventDone.classList.add('hidden');
    specialAudioActive = false;
    syncAmbientVolume();
  }

  function showWeatherAudioFallback(message) {
    if (!currentWeatherEvent || currentWeatherEvent.completed) return;
    els.weatherEventOverlay.classList.remove('is-speaking');
    els.weatherEventStatus.textContent = message
      || 'La narration est interrompue. Touchez pour écouter ou continuer.';
    els.weatherEventPlay.textContent = 'ÉCOUTER LE NARRATEUR';
    els.weatherEventPlay.classList.remove('hidden');
    els.weatherEventSkip.classList.remove('hidden');
  }

  function playWeatherNarration() {
    const running = currentWeatherEvent;
    if (!running || running.completed || !running.audio
      || document.visibilityState !== 'visible') return;
    const token = running.token;
    els.weatherEventPlay.classList.add('hidden');
    els.weatherEventSkip.classList.add('hidden');
    els.weatherEventStatus.textContent = 'Une anomalie traverse la ville…';
    els.weatherEventOverlay.classList.add('is-speaking');
    running.audio.onended = () => {
      if (currentWeatherEvent?.token === token) finishWeatherNarration(false);
    };
    running.audio.onerror = () => {
      if (currentWeatherEvent?.token === token) showWeatherAudioFallback();
    };
    try {
      running.audio.play().catch(() => {
        if (currentWeatherEvent?.token === token) showWeatherAudioFallback();
      });
    } catch (_) {
      showWeatherAudioFallback();
    }
  }

  function beginWeatherEvent(item, preview, restoring = false) {
    if (!item || item.type !== 'meteo' || !eventSession.active
      || currentMaskEvent || currentRadioEvent || currentWeatherEvent
      || specialAudioActive || anyBlockingModalOpen()
      || !isPartieTabActive() || document.visibilityState !== 'visible'
      || (state.value >= 100 && !(restoring
        && eventSession.pendingWeather?.stage === 'result'))
      || livingPlayerNumbers().length === 0) return false;

    if (restoring) {
      if (!eventSession.pendingWeather
        || eventSession.pendingWeather.id !== item.id) return false;
    } else if (!preview && (eventSession.pendingWeather
      || eventSession.played.includes(item.id)
      || eventSession.weatherCount >= WEATHER_MAX_PER_GAME
      || Date.now() < eventSession.nextWeatherEligibleAt)) {
      return false;
    } else if (preview && eventSession.pendingWeather) {
      return false;
    }

    pauseAudioEventClock();
    const token = ++weatherEventToken;
    const audio = new Audio(item.audio);
    audio.preload = 'auto';
    audio.volume = 1;
    currentWeatherEvent = {
      item, preview, restoring, token, audio, completed: false,
      savedPreviewDelay: eventSession.remainingMs,
      deferredTransition: null, deferredGameOver: false
    };

    if (!preview && !restoring) {
      eventSession.played.push(item.id);
      eventSession.weatherCount = Math.min(
        WEATHER_MAX_PER_GAME, eventSession.weatherCount + 1
      );
      eventSession.pendingWeather = {
        id: item.id, stage: 'playing', before: null, after: null,
        gameOver: false
      };
      eventSession.remainingMs = null;
    }
    saveAudioEventSession();

    // Aucun nom ni pictogramme propre au phénomène avant la narration.
    // Le nom technique reste réservé aux contrôles du mode test.
    els.weatherEventSymbol.textContent = '◇';
    els.weatherEventHeading.textContent = 'PERTURBATION ATMOSPHÉRIQUE';
    els.weatherEventStatus.textContent = 'L’atmosphère semble se déformer…';
    els.weatherEventPlay.classList.add('hidden');
    els.weatherEventSkip.classList.add('hidden');
    els.weatherEventResult.classList.add('hidden');
    els.weatherEventDone.classList.add('hidden');
    els.weatherEventOverlay.classList.remove('closing', 'is-speaking');
    els.weatherEventOverlay.classList.add('show');
    els.weatherEventOverlay.setAttribute('aria-hidden', 'false');
    specialAudioActive = true;
    silenceHauntSounds();
    syncAmbientVolume();
    renderEventControls();

    if (restoring) {
      const pending = eventSession.pendingWeather;
      if (pending.stage === 'result') {
        // Une actualisation juste avant la mise à jour de la jauge ne doit
        // ni annuler ni appliquer deux fois la conséquence.
        if (state.value === pending.before) {
          applyInstabilityDelta(item.delta, {
            source: 'Météo — ' + item.title,
            deferThreshold: true,
            deferGameOver: true
          });
        }
        currentWeatherEvent.completed = true;
        currentWeatherEvent.deferredTransition = [pending.before, pending.after];
        currentWeatherEvent.deferredGameOver = pending.gameOver;
        displayWeatherResult(pending.before, pending.after);
      } else {
        showWeatherAudioFallback('Narration interrompue : reprenez le récit de l’anomalie.');
      }
    } else {
      playWeatherNarration();
    }
    return true;
  }

  function displayWeatherResult(before, after) {
    const running = currentWeatherEvent;
    if (!running) return;
    els.weatherEventOverlay.classList.remove('is-speaking');
    const actual = after - before;
    const change = actual > 0 ? '+' + actual : String(actual);
    els.weatherEventStatus.textContent =
      'Le phénomène se dissipe, mais son empreinte demeure.';
    els.weatherEventEffect.textContent = 'Instabilité mentale';
    els.weatherEventChange.textContent = change + ' %';
    els.weatherEventValues.textContent = before + ' % → ' + after + ' %'
      + (Math.abs(actual) !== Math.abs(running.item.delta)
        ? ' (limite de la jauge atteinte)' : '');
    els.weatherEventPlay.classList.add('hidden');
    els.weatherEventSkip.classList.add('hidden');
    els.weatherEventResult.classList.remove('hidden');
    els.weatherEventDone.classList.remove('hidden');
    els.weatherEventDone.focus();
  }

  function finishWeatherNarration(skipped = false) {
    const running = currentWeatherEvent;
    if (!running || running.completed) return;
    running.completed = true;
    running.audio.pause();
    running.audio.onended = null;
    running.audio.onerror = null;
    const before = state.value;
    const after = clamp(before + running.item.delta, 0, 100);

    if (!running.preview) {
      // L'intention de modifier la jauge est enregistrée avant l'application.
      // Une reprise ne peut donc pas donner deux fois les points.
      eventSession.pendingWeather = {
        id: running.item.id, stage: 'result', before, after,
        gameOver: after >= 100
      };
      eventSession.nextWeatherEligibleAt = Date.now() + WEATHER_MIN_GAP_MS;
      saveAudioEventSession();
    }

    const effect = applyInstabilityDelta(running.item.delta, {
      source: 'Météo — ' + running.item.title,
      deferThreshold: true,
      deferGameOver: true
    });
    running.deferredTransition = [before, state.value];
    running.deferredGameOver = effect.gameOver;
    displayWeatherResult(before, state.value);
  }

  function completeWeatherEvent() {
    const finished = currentWeatherEvent;
    if (!finished || !finished.completed) return;
    const delay = finished.preview
      ? finished.savedPreviewDelay
      : randomBetween(...EVENT_NEXT_DELAY);
    const transition = finished.deferredTransition;
    const over = finished.deferredGameOver;
    dismissWeatherEvent();
    if (!finished.preview) eventSession.pendingWeather = null;
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();

    // La voix de franchissement de 50 % ou la fin de partie ne se superposent
    // jamais à la narration météorologique.
    if (transition || over) {
      clearTimeout(weatherDeferredOutcomeTimer);
      weatherDeferredOutcomeTimer = setTimeout(() => {
        weatherDeferredOutcomeTimer = null;
        if (transition && state.value === transition[1] && !over) {
          handleThresholdTransition(transition[0], transition[1]);
        }
        if (over) checkGameOver();
      }, REDUCED_MOTION ? 0 : 790);
    }
  }

  function resumePendingWeatherIfPossible() {
    const pending = eventSession.pendingWeather;
    if (!pending || !eventSession.active || gameOverShown
      || (state.value >= 100 && pending.stage !== 'result')
      || document.visibilityState !== 'visible') {
      return false;
    }
    const item = getWeatherItem(pending.id);
    if (!item) {
      // Anciens états devenus incompatibles : ne jamais bloquer la partie.
      eventSession.pendingWeather = null;
      saveAudioEventSession();
      return false;
    }
    return beginWeatherEvent(item, false, true);
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

    if (!resumePendingWeatherIfPossible()) {
      updateAudioEventClock();
    }

    if (
      state.musicOn
    ) {
      setMusic(true);
    }

    if (
      state.value >= 100 && !currentWeatherEvent
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
      if (selected.type === 'radio') {
        beginRadioEvent(selected, true);
      } else if (selected.type === 'meteo') {
        beginWeatherEvent(selected, true);
      } else {
        beginMaskEvent(selected, true);
      }
    });
    els.maskEventPlay.addEventListener('click', resumeMaskEventAudio);
    els.maskIntroSkip.addEventListener('click', () => finishMaskIntroduction(true));
    els.maskChoiceSelf.addEventListener('click', () => chooseMaskSacrifice('self'));
    els.maskChoiceGroup.addEventListener('click', () => chooseMaskSacrifice('group'));
    els.maskEventDone.addEventListener('click', completeMaskEvent);
    els.maskDuelStart.addEventListener('click', startMaskDuel);
    els.maskDuelLoss1.addEventListener('click', () => resolveMaskDuel('first'));
    els.maskDuelLoss2.addEventListener('click', () => resolveMaskDuel('second'));
    els.maskDuelSuccess.addEventListener('click', () => resolveMaskDuel('both'));
    els.maskDuelSkipAudio.addEventListener('click', skipMaskDuelReaction);

    els.radioMissionToggle.addEventListener('click', toggleRadioMissionPanel);
    els.radioMissionArrived.addEventListener('click', radioMissionArrived);
    els.radioMissionAbandon.addEventListener('click', abandonRadioMission);
    els.radioEventPlay.addEventListener('click', playRadioEventAudio);
    els.radioEventSkip.addEventListener('click', skipRadioAudio);
    els.radioEventAccept.addEventListener('click', () => answerRadioCall(true));
    els.radioEventIgnore.addEventListener('click', () => answerRadioCall(false));
    els.radioEventDone.addEventListener('click', finishRadioResolution);
    els.weatherEventPlay.addEventListener('click', playWeatherNarration);
    els.weatherEventSkip.addEventListener('click', () => finishWeatherNarration(true));
    els.weatherEventDone.addEventListener('click', completeWeatherEvent);


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
