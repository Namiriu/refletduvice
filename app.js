(() => {
  'use strict';

  // =========================================================
  // CONFIGURATION
  // =========================================================

  const STEPS = [5, 10, 15, 20];
  const THRESHOLD = 50;
  const VERSION = 'v1.5.22 — Cadence validée et panneau administrateur';
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
    playersConfirm: $('playersConfirm'),
    btnPlayers: $('btnPlayers'),
    btnAdmin: $('btnAdmin'),
    adminModal: $('adminModal'),
    adminClose: $('adminClose'),
    adminAuth: $('adminAuth'),
    adminPassword: $('adminPassword'),
    adminUnlock: $('adminUnlock'),
    adminGateError: $('adminGateError'),
    adminPanel: $('adminPanel'),
    adminFirstMin: $('adminFirstMin'),
    adminFirstMax: $('adminFirstMax'),
    adminNextMin: $('adminNextMin'),
    adminNextMax: $('adminNextMax'),
    adminWeightMask: $('adminWeightMask'),
    adminWeightRadio: $('adminWeightRadio'),
    adminWeightWeather: $('adminWeightWeather'),
    adminSave: $('adminSave'),
    adminDefaults: $('adminDefaults'),
    adminStatus: $('adminStatus'),
    adminForceStatus: $('adminForceStatus'),
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
    radio02Overlay: $('radio02Overlay'),
    radio02Heading: $('radio02Heading'),
    radio02Status: $('radio02Status'),
    radio02Choices: $('radio02Choices'),
    radio02Clock: $('radio02Clock'),
    radio02Track: $('radio02Track'),
    radio02Progress: $('radio02Progress'),
    radio02Answer: $('radio02Answer'),
    radio02Cut: $('radio02Cut'),
    radio02Reward: $('radio02Reward'),
    radio02Play: $('radio02Play'),
    radio02Skip: $('radio02Skip'),
    radio02Done: $('radio02Done'),
    radio03Overlay: $('radio03Overlay'),
    radio03Heading: $('radio03Heading'),
    radio03MaskImage: $('radio03MaskImage'),
    radio03Status: $('radio03Status'),
    radio03Clock: $('radio03Clock'),
    radio03Track: $('radio03Track'),
    radio03Progress: $('radio03Progress'),
    radio03Challenge: $('radio03Challenge'),
    radio03Slots: $('radio03Slots'),
    radio03Palette: $('radio03Palette'),
    radio03Undo: $('radio03Undo'),
    radio03Confirm: $('radio03Confirm'),
    radio03Reward: $('radio03Reward'),
    radio03Play: $('radio03Play'),
    radio03Cancel: $('radio03Cancel'),
    radio03Done: $('radio03Done'),
    radio04Overlay: $('radio04Overlay'),
    weather04Overlay: $('weather04Overlay'),
    weather04Stage: $('weather04Stage'),
    weather04Video: $('weather04Video'),
    weather04Backdrop: $('weather04Backdrop'),
    weather04Panel: $('weather04Panel'),
    weather04Surface: $('weather04Surface'),
    weather04Status: $('weather04Status'),
    weather04Choices: $('weather04Choices'),
    weather04Clock: $('weather04Clock'),
    weather04Track: $('weather04Track'),
    weather04Progress: $('weather04Progress'),
    weather04Resist: $('weather04Resist'),
    weather04Cede: $('weather04Cede'),
    weather04Sound: $('weather04Sound'),
    weather04Play: $('weather04Play'),
    weather04Skip: $('weather04Skip'),
    weather04Result: $('weather04Result'),
    weather04Done: $('weather04Done'),
    weather04Burn: $('weather04Burn'),
    weather04VideoActions: $('weather04VideoActions'),
    weather04VideoPlay: $('weather04VideoPlay'),
    weather04VideoSkip: $('weather04VideoSkip'),
    btnEffects: $('btnEffects'),
    effectsBanner: $('effectsBanner'),
    effectsBannerList: $('effectsBannerList'),
    effectsFeedback: $('effectsFeedback'),
    effectsAdvance: $('effectsAdvance'),
    effectsModal: $('effectsModal'),
    effectsList: $('effectsList'),
    effectsPreset: $('effectsPreset'),
    effectsCoin: $('effectsCoin'),
    effectsForm: $('effectsForm'),
    effectsName: $('effectsName'),
    effectsDuration: $('effectsDuration'),
    effectsUndo: $('effectsUndo'),
    effectsClose: $('effectsClose'),
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
    playersModal: $('playersModal'),
    playersIntroHeader: $('playersIntroHeader'),
    playersClose: $('playersClose'),
    eventPlayersList: $('eventPlayersList'),
    maskEventOverlay: $('maskEventOverlay'),
    mask05CancelNotice: $('mask05CancelNotice'),
    mask05CancelText: $('mask05CancelText'),
    mask05Banner: $('mask05Banner'),
    mask05BannerClock: $('mask05BannerClock'),
    mask05BannerProgress: $('mask05BannerProgress'),
    mask05Overlay: $('mask05Overlay'),
    mask05Portrait: $('mask05Portrait'),
    mask05Heading: $('mask05Heading'),
    mask05Status: $('mask05Status'),
    mask05Hint: $('mask05Hint'),
    mask05Outcome: $('mask05Outcome'),
    mask05Private: $('mask05Private'),
    mask05Start: $('mask05Start'),
    mask05Success: $('mask05Success'),
    mask05Failure: $('mask05Failure'),
    mask05Play: $('mask05Play'),
    mask05Skip: $('mask05Skip'),
    mask05Done: $('mask05Done'),
    mask06Overlay: $('mask06Overlay'),
    mask06Portrait: $('mask06Portrait'),
    mask06Status: $('mask06Status'),
    mask06Choices: $('mask06Choices'),
    mask06Yes: $('mask06Yes'),
    mask06No: $('mask06No'),
    mask06Result: $('mask06Result'),
    mask06Play: $('mask06Play'),
    mask06Skip: $('mask06Skip'),
    mask06Done: $('mask06Done'),
    mask07Overlay: $('mask07Overlay'),
    mask07Portrait: $('mask07Portrait'),
    mask07Status: $('mask07Status'),
    mask07Detail: $('mask07Detail'),
    mask07Pair: $('mask07Pair'),
    mask07Primary: $('mask07Primary'),
    mask07Secondary: $('mask07Secondary'),
    mask07Confirm: $('mask07Confirm'),
    mask07Play: $('mask07Play'),
    mask07Skip: $('mask07Skip'),
    coinOverlay: $('coinOverlay'),
    coinDisc: $('coinDisc'),
    coinFrontImg: $('coinFrontImg'),
    coinBackImg: $('coinBackImg'),
    coinStatus: $('coinStatus'),
    coinStart: $('coinStart'),
    coinDone: $('coinDone'),
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
  let wakeLockRequest = null;
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
  // Cadence approuvée : première intervention 10–13 min, puis 15–20 min.
  // L'intervalle normal entre interventions dépasse ainsi 12 min.
  // Le panneau admin peut abréger les délais uniquement pour les playtests.
  const EVENT_DEFAULT_DELAYS = Object.freeze({
    firstMin: 10, firstMax: 13, nextMin: 15, nextMax: 20
  });
  const EVENT_DEFAULT_WEIGHTS = Object.freeze({masque:45, radio:40, meteo:15});
  const ADMIN_CONFIG_KEY = LSK('audio_admin_schedule_v1');
  const MASK_INTRO_AUDIO = 'audio/events/masque/introduction/masque-000-presentation.mp3';
  function readAudioDelays() {
    try {
      const obj = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || 'null');
      if (!obj || typeof obj !== 'object') return {...EVENT_DEFAULT_DELAYS};
      const keys = ['firstMin','firstMax','nextMin','nextMax'];
      if (!keys.every(k => Number.isInteger(obj[k]) && obj[k] >= 1 && obj[k] <= 120)
        || obj.firstMin > obj.firstMax || obj.nextMin > obj.nextMax) {
        return {...EVENT_DEFAULT_DELAYS};
      }
      return Object.fromEntries(keys.map(k => [k, obj[k]]));
    } catch (_) { return {...EVENT_DEFAULT_DELAYS}; }
  }
  function readAudioWeights() {
    try {
      const obj = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || 'null');
      const weights = obj?.weights;
      const types = ['masque', 'radio', 'meteo'];
      if (!weights || !types.every(type =>
        Number.isInteger(weights[type]) && weights[type] >= 0 && weights[type] <= 100)
        || types.every(type => weights[type] === 0)) {
        return {...EVENT_DEFAULT_WEIGHTS};
      }
      return Object.fromEntries(types.map(type => [type, weights[type]]));
    } catch (_) { return {...EVENT_DEFAULT_WEIGHTS}; }
  }
  let audioDelays = readAudioDelays();
  let audioWeights = readAudioWeights();
  function randomAudioDelay(first = false) {
    const a = first ? audioDelays.firstMin : audioDelays.nextMin;
    const b = first ? audioDelays.firstMax : audioDelays.nextMax;
    return randomBetween(a, b) * 60000;
  }
  function resetAudioAdminForNewGame() {
    audioDelays = {...EVENT_DEFAULT_DELAYS};
    audioWeights = {...EVENT_DEFAULT_WEIGHTS};
    try { localStorage.removeItem(ADMIN_CONFIG_KEY); } catch (_) {}
  }
  let adminUnlocked = false;
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
      id: 'masque-005', type: 'masque', title: 'LA CONFIDENCE EMPOISONNÉE',
      introAudio: 'audio/events/masque/interventions/masque-005-confidence-intro.mp3',
      cibleAudio: 'audio/events/masque/interventions/masque-005-confidence-cible.mp3',
      transfertAudio: 'audio/events/masque/interventions/masque-005-confidence-transfert.mp3',
      secretAudio: 'audio/events/masque/interventions/masque-005-confidence-secrete.mp3',
      verdictAudio: 'audio/events/masque/interventions/masque-005-confidence-verdict.mp3',
      successAudio: 'audio/events/masque/interventions/masque-005-confidence-reussite.mp3',
      failureAudio: 'audio/events/masque/interventions/masque-005-confidence-echec.mp3',
      gongAudio: 'audio/events/sfx/gong-fin-chronometre.mp3',
      target: 'deux-joueurs-vivants'
    },
    {
      id: 'masque-006', type: 'masque', title: 'LA COMPTINE DES OUBLIÉS',
      introAudio: 'audio/events/masque/interventions/masque-006-intro.mp3',
      songAudio: 'audio/events/masque/interventions/masque-006-comptine.MP3',
      questionAudio: 'audio/events/masque/interventions/masque-006-question.mp3',
      yesAudio: 'audio/events/masque/interventions/masque-006-oui.mp3',
      noAudio: 'audio/events/masque/interventions/masque-006-non.mp3'
    },
    {
      id: 'masque-007', type: 'masque', title: 'UNE PREUVE D’AMITIÉ',
      audioRoot: 'audio/events/masque/interventions/masque-007-'
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
      id: 'radio-002', type: 'radio', title: 'LE RAPPORT IMPOSSIBLE',
      audio: 'audio/events/radio/radio-002-rapport-impossible.mp3',
      responses: {
        answer: 'audio/events/radio/radio-002-repondre.mp3',
        cut: 'audio/events/radio/radio-002-couper.mp3',
        silence: 'audio/events/radio/radio-002-silence.mp3'
      }
    },
    {
      id:'radio-003',type:'radio',title:'VOUS ÉCOUTIEZ ?',
      transmission:'audio/events/radio/radio-003-transmission.mp3',
      ambience:'audio/events/radio/radio-003-ambiance-sanctuaire.mp3',
      glitch:'audio/events/radio/radio-003-brouillage.mp3',
      maskIntro:'audio/events/radio/radio-003-masque-intro.mp3',
      maskChallenge:'audio/events/radio/radio-003-masque-epreuve.mp3',
      success:'audio/events/radio/radio-003-masque-reussite.mp3',
      failure:'audio/events/radio/radio-003-masque-echec.mp3'
    },
    {
      id: 'radio-004', type: 'radio', title: 'LA FRÉQUENCE INTERDITE',
      audioRoot: 'audio/events/radio/radio-004-'
    },
    { id:'radio-005',type:'radio',title:'RADIO DU VICE',
      audioRoot:'audio/events/radio/radio-005-' },
    {
      id: 'meteo-001', type: 'meteo', title: 'LA PRESSION FANTÔME', icon: '🌫️',
      audio: 'audio/events/meteo/meteo-001-pression-fantome.mp3', delta: 5
    },
    {
      id: 'meteo-002', type: 'meteo', title: 'LA PLUIE À REBOURS', icon: '🌧️',
      audio: 'audio/events/meteo/meteo-002-pluie-a-rebours.mp3', delta: 5
    },
    {
      id: 'meteo-003', type: 'meteo', title: 'LA FRACTURE DU RÉEL', icon: '◇',
      audioNormal: 'audio/events/meteo/meteo-003-fracture-du-reel-normal-vers-reflet.mp3',
      audioReflet: 'audio/events/meteo/meteo-003-fracture-du-reel-reflet-vers-normal.mp3'
    },
    {
      id: 'meteo-004', type: 'meteo', title: 'LE DERNIER BATTEMENT', icon: '◈',
      introAudio: 'audio/events/meteo/meteo-004-dernier-battement-intro.mp3',
      choiceAudio: 'audio/events/meteo/meteo-004-dernier-battement-choix.mp3',
      resistAudio: 'audio/events/meteo/meteo-004-dernier-battement-resister.mp3',
      cedeAudio: 'audio/events/meteo/meteo-004-dernier-battement-ceder.mp3'
    }
  ];
  // Les constantes de RADIO-003 doivent exister AVANT la lecture du stockage.
  const RADIO03_COLORS = ['rouge','bleu','vert','jaune'];
  const RADIO03_CHOICE_MS = 30000;
  const RADIO03_COLOR_DELAY = 5; // HTMLMediaElement.currentTime est en secondes.
  const RADIO03_COLOR_GAP = 330;
  const RADIO03_CYCLE_GAP = 2800;
  const RADIO03_GONG_DELAY_MS = 10500; // Même réglage que MASQUE-005.
  const eventSession = readAudioEventSession();
  let eventTimer = null;
  let eventDueAt = null;
  let currentMaskEvent = null;
  let currentMask05 = null;
  let mask05Token = 0;
  let currentMask06 = null;
  let mask06Token = 0;
  let mask06DeferredOutcomeTimer = null;
  let currentMask07 = null;
  let mask07Token = 0;
  let currentCoin = null;
  let coinToken = 0;
  let mask05CancelNoticeTimer = null;
  const MASK05_MISSION_MS = 5 * 60000;
  let currentRadioEvent = null;
  let radioEventToken = 0;
  let currentRadio02 = null;
  let radio02Token = 0;
  let currentRadio03 = null;
  let radio03Token = 0;
  let radio03DeferredOutcomeTimer = null;
  let currentRadio04 = null;
  let radio04Engine = null;
  let currentRadio05 = null;
  let radio05Engine = null;
  let radio02DeferredOutcomeTimer = null;
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
      ? (currentWeatherEvent?.isWeather04 ? 0 : DUCK_VOLUME)
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


  // =========================================================
  // EFFETS TEMPORAIRES — une manche = un tour de table complet
  // =========================================================
  const EFFECTS_KEY = LSK('effets_temporaires_v1');
  function readTemporaryEffects() {
    try {
      const data=JSON.parse(localStorage.getItem(EFFECTS_KEY)||'{}');
      const clean=arr=>Array.isArray(arr)?arr.filter(e=>e
        && typeof e.id==='string' && typeof e.label==='string'
        && Number.isInteger(e.turns) && e.turns>0 && e.turns<=30)
        .slice(0,12).map(e=>({id:e.id.slice(0,90),
          label:e.label.slice(0,80),turns:e.turns})):[];
      return {items:clean(data.items),previous:Array.isArray(data.previous)
        ?clean(data.previous):null};
    } catch (_) { return {items:[],previous:null}; }
  }
  const effects=readTemporaryEffects();
  let effectsFeedbackTimer=null;
  const saveEffects=()=>{try{
    localStorage.setItem(EFFECTS_KEY,JSON.stringify(effects));
  }catch(_){}};
  function effectsMessage(message) {
    clearTimeout(effectsFeedbackTimer);
    els.effectsFeedback.textContent=message;
    els.effectsFeedback.classList.remove('hidden');
    effectsFeedbackTimer=setTimeout(()=>els.effectsFeedback.classList.add('hidden'),5500);
  }
  function renderTemporaryEffects() {
    els.effectsBanner.classList.toggle('hidden',effects.items.length===0);
    els.btnEffects.textContent=effects.items.length
      ?'⏳ EFFETS · '+effects.items.length:'⏳ EFFETS';
    els.effectsBannerList.replaceChildren();
    els.effectsList.replaceChildren();
    if(!effects.items.length) {
      const p=document.createElement('p');
      p.textContent='Aucun effet temporaire en cours.';
      els.effectsList.appendChild(p);
    }
    for(const e of effects.items) {
      const row=document.createElement('div');row.className='effects-banner-row';
      const title=document.createElement('span');title.textContent=e.label;
      const count=document.createElement('b');
      count.textContent=e.turns+(e.turns===1?' manche':' manches');
      row.append(title,count);els.effectsBannerList.appendChild(row);
      const line=document.createElement('div');line.className='effects-line';
      const label=document.createElement('span');
      label.textContent=e.label+' — '+count.textContent;
      const del=document.createElement('button');del.type='button';del.textContent='✕';
      del.setAttribute('aria-label','Retirer '+e.label);
      del.addEventListener('click',()=>{
        effects.previous=effects.items.map(x=>({...x}));
        effects.items=effects.items.filter(x=>x.id!==e.id);
        saveEffects();renderTemporaryEffects();
      });
      line.append(label,del);els.effectsList.appendChild(line);
    }
    els.effectsUndo.disabled=!effects.previous;
  }
  function setTemporaryEffect(id,label,turns) {
    const old=effects.items.find(x=>x.id===id);
    effects.previous=effects.items.map(x=>({...x}));
    if(old) old.turns=turns; // Réinitialisation, sans cumul.
    else if(effects.items.length<12) effects.items.push({id,label,turns});
    else {effectsMessage('12 effets au maximum.');return false;}
    saveEffects();renderTemporaryEffects();return true;
  }
  function advanceTemporaryEffects() {
    if(!effects.items.length) return;
    effects.previous=effects.items.map(x=>({...x}));
    const ended=effects.items.filter(e=>e.turns===1).map(e=>e.label);
    effects.items=effects.items.map(e=>({...e,turns:e.turns-1}))
      .filter(e=>e.turns>0);
    saveEffects();renderTemporaryEffects();
    effectsMessage(ended.length
      ?'Manche terminée. Effet(s) terminé(s) : '+ended.join(', ')
      :'Une manche complète a été comptabilisée.');
  }
  function undoTemporaryEffects() {
    if(!effects.previous)return;
    effects.items=effects.previous.map(e=>({...e}));
    effects.previous=null;saveEffects();renderTemporaryEffects();
    effectsMessage('Dernière modification annulée.');
  }
  function resetTemporaryEffects() {
    effects.items=[];effects.previous=null;saveEffects();renderTemporaryEffects();
    clearTimeout(effectsFeedbackTimer);
    els.effectsFeedback.classList.add('hidden');
  }
  function openEffectsModal() {
    renderTemporaryEffects();els.effectsModal.classList.add('show');
    els.effectsModal.setAttribute('aria-hidden','false');
    els.effectsClose.focus();
  }
  function closeEffectsModal() {
    els.effectsModal.classList.remove('show');
    els.effectsModal.setAttribute('aria-hidden','true');
  }
  function addManualEffect() {
    const label=els.effectsName.value.trim();
    const turns=Number(els.effectsDuration.value);
    if(!label || !Number.isInteger(turns)||turns<1||turns>30) {
      effectsMessage('Nom et durée entre 1 et 30 manches requis.');return;
    }
    const id='manuel-'+Date.now()+'-'+Math.random().toString(36).slice(2);
    if(setTemporaryEffect(id,label,turns)) {
      els.effectsName.value='';effectsMessage('Effet ajouté : '+label);
    }
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
      els.adminModal.classList.contains('show')
      || els.gate
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
      || els.mask05Overlay.classList.contains('show')
      || els.mask06Overlay.classList.contains('show')
      || els.mask07Overlay.classList.contains('show')
      || els.coinOverlay.classList.contains('show')
      || els.radioEventOverlay.classList.contains('show')
      || els.radio02Overlay.classList.contains('show')
      || els.radio03Overlay.classList.contains('show')
      || els.radio04Overlay.classList.contains('show')
      || els.weatherEventOverlay.classList.contains('show')
      || els.weather04Overlay.classList.contains('show')
      || els.effectsModal.classList.contains('show')
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

    resetAudioAdminForNewGame();
    resetAudioEventSession();
    resetTemporaryEffects();
    closeEffectsModal();
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
    : (specialAudioActive
      ? (currentWeatherEvent?.isWeather04 ? 0 : DUCK_VOLUME)
      : AMBIENT_VOLUME);

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
    // Le Screen Wake Lock reste soumis au navigateur / système d'exploitation.
    // Éviter les demandes concurrentes et réacquérir après perte/veille.
    if (!('wakeLock' in navigator)
      || document.visibilityState !== 'visible'
      || (wakeLock && !wakeLock.released)) return;
    if (wakeLockRequest) return wakeLockRequest;
    wakeLockRequest = (async () => {
      try {
        const acquired = await navigator.wakeLock.request('screen');
        if (document.visibilityState !== 'visible') {
          await acquired.release();
          return;
        }
        wakeLock = acquired;
        acquired.addEventListener?.('release', () => {
          if (wakeLock === acquired) wakeLock = null;
        });
      } catch (_) {
        wakeLock = null;
      }
    })();
    try { await wakeLockRequest; }
    finally { wakeLockRequest = null; }
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
          // Après une navigation hors de PARTIE, reprendre les présentations
          // qui attendaient l'affichage de cette page (ex. après F5).
          if (target === 'partie' && eventSession.introPhase
            && !currentMaskEvent && !playersIntroMode) {
            resumePendingMaskIntroIfPossible();
          }
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
          prefetchCurrentNames();
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
      introPhase: null,
      radioMission: null,
      pendingRadio002: null,
      pendingRadio003: null,
      pendingRadio004: null,
      pendingRadio005: null,
      pendingMask005: null,
      pendingMask006: null,
      pendingMask007: null,
      lastEventType: null,
      weatherCount: 0,
      nextWeatherEligibleAt: 0,
      pendingWeather: null,
      alive: [true, true, true, true],
      playerNames: ['', '', '', ''],
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
        introPhase: saved.active === true
          && ['presentation','request','names','reaction','anonymous'].includes(saved.introPhase)
          ? saved.introPhase : null,
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
        pendingRadio002: saved.pendingRadio002
          && saved.pendingRadio002.id === 'radio-002'
          && ['intro', 'choices', 'branch', 'result'].includes(saved.pendingRadio002.stage)
          && [null, 'answer', 'cut', 'silence'].includes(saved.pendingRadio002.choice)
          ? {
              id: 'radio-002',
              stage: saved.pendingRadio002.stage,
              choice: saved.pendingRadio002.choice,
              before: Number.isFinite(saved.pendingRadio002.before)
                ? saved.pendingRadio002.before : null,
              after: Number.isFinite(saved.pendingRadio002.after)
                ? saved.pendingRadio002.after : null,
              gameOver: saved.pendingRadio002.gameOver === true
            } : null,
        pendingRadio004: saved.pendingRadio004?.id === 'radio-004'
          && ['intro','scan','alert','ready','countdown','challenge',
              'resultvoice','result'].includes(saved.pendingRadio004.stage)
          ? {
              id:'radio-004',
              stage:saved.pendingRadio004.stage,
              index:Number.isInteger(saved.pendingRadio004.index)
                ? clamp(saved.pendingRadio004.index,0,2):0,
              scanElapsed:Number.isFinite(saved.pendingRadio004.scanElapsed)
                ? clamp(saved.pendingRadio004.scanElapsed,0,3600000):0,
              outcome:['success','failure'].includes(saved.pendingRadio004.outcome)
                ? saved.pendingRadio004.outcome:null,
              before:Number.isFinite(saved.pendingRadio004.before)
                ? saved.pendingRadio004.before:null,
              after:Number.isFinite(saved.pendingRadio004.after)
                ? saved.pendingRadio004.after:null,
              gameOver:saved.pendingRadio004.gameOver===true
            }:null,
        pendingRadio005: saved.pendingRadio005?.id === 'radio-005'
          && ['opening','intro','pubj','pub','fanfare','game','draw',
              'winner','question','decision','reaction','acceptj','accept',
              'refuse','publicIntro','crowd','anger','impact','pause',
              'returnj','outro','endj','result'].includes(saved.pendingRadio005.phase)
          ? {
              id:'radio-005',
              phase:saved.pendingRadio005.phase,
              winner:Number.isInteger(saved.pendingRadio005.winner)
                && saved.pendingRadio005.winner>=1
                && saved.pendingRadio005.winner<=4?saved.pendingRadio005.winner:null,
              choice:['accept','refuse'].includes(saved.pendingRadio005.choice)
                ?saved.pendingRadio005.choice:null,
              applied:saved.pendingRadio005.applied===true,
              before:Number.isFinite(saved.pendingRadio005.before)
                ?saved.pendingRadio005.before:null,
              after:Number.isFinite(saved.pendingRadio005.after)
                ?saved.pendingRadio005.after:null,
              over:saved.pendingRadio005.over===true
            }:null,
        pendingRadio003: saved.pendingRadio003?.id === 'radio-003'
          && ['transmission','glitch','maskintro','designation','maskepreuve',
            'choices','gong','reaction','result','cancelled'].includes(saved.pendingRadio003.stage)
          && Array.isArray(saved.pendingRadio003.sequence)
          && saved.pendingRadio003.sequence.length === 5
          && saved.pendingRadio003.sequence.every(c=>RADIO03_COLORS.includes(c))
          ? {
              id:'radio-003',stage:saved.pendingRadio003.stage,
              sequence:saved.pendingRadio003.sequence.slice(),
              target:Number.isInteger(saved.pendingRadio003.target)
                && saved.pendingRadio003.target>=1&&saved.pendingRadio003.target<=4
                  ? saved.pendingRadio003.target : null,
              guess:Array.isArray(saved.pendingRadio003.guess)
                ? saved.pendingRadio003.guess.filter(c=>RADIO03_COLORS.includes(c)).slice(0,5):[],
              outcome:['success','failure','timeout'].includes(saved.pendingRadio003.outcome)
                ? saved.pendingRadio003.outcome : null,
              remainingMs:Number.isFinite(saved.pendingRadio003.remainingMs)
                ? clamp(saved.pendingRadio003.remainingMs,0,RADIO03_CHOICE_MS):RADIO03_CHOICE_MS,
              deadline:Number.isFinite(saved.pendingRadio003.deadline)
                ? Math.max(0,saved.pendingRadio003.deadline):0,
              before:Number.isFinite(saved.pendingRadio003.before)
                ? saved.pendingRadio003.before:null,
              after:Number.isFinite(saved.pendingRadio003.after)
                ? saved.pendingRadio003.after:null,
              gameOver:saved.pendingRadio003.gameOver===true
            }:null,
        pendingMask005: saved.pendingMask005?.id === 'masque-005'
          && ['public','private-ready','secret','start-ready','mission',
            'gong','verdict','decision','reaction','result'].includes(saved.pendingMask005.stage)
          && Number.isInteger(saved.pendingMask005.target)
          && Number.isInteger(saved.pendingMask005.accomplice)
          && saved.pendingMask005.target >= 1 && saved.pendingMask005.target <= 4
          && saved.pendingMask005.accomplice >= 1 && saved.pendingMask005.accomplice <= 4
          && saved.pendingMask005.target !== saved.pendingMask005.accomplice
          && [null,'success','failure'].includes(saved.pendingMask005.outcome ?? null)
          ? {
              id: 'masque-005',
              stage: saved.pendingMask005.stage,
              target: saved.pendingMask005.target,
              accomplice: saved.pendingMask005.accomplice,
              deadline: Number.isFinite(saved.pendingMask005.deadline)
                ? Math.max(0, saved.pendingMask005.deadline) : 0,
              outcome: saved.pendingMask005.outcome ?? null
            } : null,
        pendingMask006: saved.pendingMask006?.id === 'masque-006'
          && ['intro','song','question','choices','reaction','result'].includes(saved.pendingMask006.stage)
          && [null,'yes','no'].includes(saved.pendingMask006.choice ?? null)
          && (!['reaction','result'].includes(saved.pendingMask006.stage)
            || ['yes','no'].includes(saved.pendingMask006.choice))
          ? {
              id: 'masque-006',
              stage: saved.pendingMask006.stage,
              choice: saved.pendingMask006.choice ?? null,
              before: Number.isFinite(saved.pendingMask006.before)
                ? saved.pendingMask006.before : null,
              after: Number.isFinite(saved.pendingMask006.after)
                ? saved.pendingMask006.after : null,
              gameOver: saved.pendingMask006.gameOver === true
            } : null,
        pendingMask007: saved.pendingMask007?.id === 'masque-007'
          && [
            'intro','aggressor-before','aggressor-number','aggressor-after',
            'victim-before','victim-number','victim-after','revelation',
            'coin-intro','coin-ready','coin-spinning','coin-reveal',
            'success-audio','hp-choice','injury-audio','danger-audio',
            'sacrifice-choice','death-confirm','sacrifice-audio',
            'death-audio','outcome'
          ].includes(saved.pendingMask007.stage)
          && Number.isInteger(saved.pendingMask007.aggressor)
          && Number.isInteger(saved.pendingMask007.victim)
          && saved.pendingMask007.aggressor >= 1 && saved.pendingMask007.aggressor <= 4
          && saved.pendingMask007.victim >= 1 && saved.pendingMask007.victim <= 4
          && saved.pendingMask007.aggressor !== saved.pendingMask007.victim
          && [null,'success','fail'].includes(saved.pendingMask007.coinOutcome ?? null)
          && [null,'injury','sacrifice','death'].includes(saved.pendingMask007.penalty ?? null)
          ? {
              id: 'masque-007',
              stage: saved.pendingMask007.stage,
              aggressor: saved.pendingMask007.aggressor,
              victim: saved.pendingMask007.victim,
              coinOutcome: saved.pendingMask007.coinOutcome ?? null,
              penalty: saved.pendingMask007.penalty ?? null,
              deathApplied: saved.pendingMask007.deathApplied === true
            } : null,
        lastEventType: ['masque', 'radio', 'meteo'].includes(saved.lastEventType)
          ? saved.lastEventType : null,
        weatherCount: Number.isInteger(saved.weatherCount)
          ? Math.max(0, Math.min(WEATHER_MAX_PER_GAME, saved.weatherCount)) : 0,
        nextWeatherEligibleAt: Number.isFinite(saved.nextWeatherEligibleAt)
          ? Math.max(0, saved.nextWeatherEligibleAt) : 0,
        pendingWeather: saved.pendingWeather && typeof saved.pendingWeather.id === 'string'
          && (saved.pendingWeather.id === 'meteo-004'
            ? ['intro', 'choices', 'branch', 'reveal', 'result'].includes(saved.pendingWeather.stage)
            : ['playing', 'result'].includes(saved.pendingWeather.stage))
          ? {
              id: saved.pendingWeather.id,
              stage: saved.pendingWeather.stage,
              before: Number.isFinite(saved.pendingWeather.before)
                ? saved.pendingWeather.before : null,
              after: Number.isFinite(saved.pendingWeather.after)
                ? saved.pendingWeather.after : null,
              fromReflet: typeof saved.pendingWeather.fromReflet === 'boolean'
                ? saved.pendingWeather.fromReflet : null,
              gameOver: saved.pendingWeather.gameOver === true,
              choice: ['resist','cede'].includes(saved.pendingWeather.choice)
                ? saved.pendingWeather.choice : null,
              remainingMs: Number.isFinite(saved.pendingWeather.remainingMs)
                ? clamp(saved.pendingWeather.remainingMs,0,15000) : null,
              rewardApplied: saved.pendingWeather.rewardApplied === true
            } : null,
        playerNames: Array.isArray(saved.playerNames) && saved.playerNames.length === 4
          ? saved.playerNames.map(value =>
              typeof value === 'string' ? value.trim().slice(0,32) : '')
          : defaults.playerNames,
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
      && (!['masque-004','masque-005','masque-007'].includes(item.id)
        || livingPlayerNumbers().length >= 2)
      && !(eventSession.radioMission
        && eventSession.radioMission.stage !== 'travel'
        && item.type === 'radio')
      && !eventSession.pendingRadio002
      && !eventSession.pendingRadio003
      && !eventSession.pendingRadio004
      && !eventSession.pendingRadio005
      && !eventSession.pendingMask005
      && !eventSession.pendingMask006
      && (item.type !== 'meteo'
        || (eventSession.weatherCount < WEATHER_MAX_PER_GAME
          && !eventSession.pendingWeather
          && Date.now() >= eventSession.nextWeatherEligibleAt))
    );
  }


  // =========================================================
  // ADMIN LOCAL — paramètres de cadence et déclenchement de démonstrations
  // =========================================================
  // Cette protection locale limite les manipulations accidentelles pendant
  // un playtest ; ce n'est pas une authentification serveur sécurisée.
  function openAdminModal() {
    if (anyBlockingModalOpen()) return;
    adminUnlocked = false;
    els.adminPassword.value = '';
    els.adminGateError.textContent = '';
    els.adminStatus.textContent = '';
    els.adminForceStatus.textContent = '';
    els.adminAuth.classList.remove('hidden');
    els.adminPanel.classList.add('hidden');
    els.adminUnlock.textContent = 'DÉVERROUILLER';
    els.adminModal.classList.add('show');
    els.adminModal.setAttribute('aria-hidden', 'false');
    pauseAudioEventClock();
    renderEventControls();
    els.adminPassword.focus();
  }

  function closeAdminModal() {
    if (!els.adminModal.classList.contains('show')) return;
    adminUnlocked = false;
    els.adminPassword.value = '';
    els.adminModal.classList.remove('show');
    els.adminModal.setAttribute('aria-hidden', 'true');
    renderEventControls();
    updateAudioEventClock();
    els.btnAdmin.focus();
  }

  function unlockAdmin() {
    if (!els.adminModal.classList.contains('show')
      || els.adminUnlock.disabled) return;
    if (els.adminPassword.value !== 'namiriu') {
      els.adminGateError.textContent = 'Code incorrect.';
      els.adminPassword.select();
      return;
    }
    adminUnlocked = true;
    els.adminPassword.value = '';
    els.adminGateError.textContent = '';
    els.adminAuth.classList.add('hidden');
    els.adminPanel.classList.remove('hidden');
    populateAdminDelays();
    populateAdminWeights();
    renderEventControls();
    els.adminFirstMin.focus();
  }

  function populateAdminDelays(values = audioDelays) {
    els.adminFirstMin.value = String(values.firstMin);
    els.adminFirstMax.value = String(values.firstMax);
    els.adminNextMin.value = String(values.nextMin);
    els.adminNextMax.value = String(values.nextMax);
    els.adminStatus.textContent =
      'Réglages locaux à cet appareil. Les délais déjà lancés ne seront pas modifiés.';
  }

  function populateAdminWeights(values = audioWeights) {
    els.adminWeightMask.value = String(values.masque);
    els.adminWeightRadio.value = String(values.radio);
    els.adminWeightWeather.value = String(values.meteo);
  }

  function restoreAdminDefaults() {
    if (!adminUnlocked) return;
    populateAdminDelays(EVENT_DEFAULT_DELAYS);
    populateAdminWeights(EVENT_DEFAULT_WEIGHTS);
    els.adminStatus.textContent =
      'Délais et pondérations d’origine affichés. Cliquez sur ENREGISTRER pour les appliquer.';
  }

  function saveAdminConfig() {
    if (!adminUnlocked || !els.adminModal.classList.contains('show')) return;
    const fields = {
      firstMin: els.adminFirstMin, firstMax: els.adminFirstMax,
      nextMin: els.adminNextMin, nextMax: els.adminNextMax
    };
    const values = Object.fromEntries(
      Object.entries(fields).map(([key, element]) => [key, Number(element.value)])
    );
    if (!Object.keys(fields).every(key =>
      fields[key].value.trim() !== ''
      && Number.isInteger(values[key])
      && values[key] >= 1 && values[key] <= 120)) {
      els.adminStatus.textContent =
        'Entrez des minutes entières comprises entre 1 et 120.';
      return;
    }
    if (values.firstMin > values.firstMax || values.nextMin > values.nextMax) {
      els.adminStatus.textContent =
        'Le minimum ne peut pas être supérieur au maximum.';
      return;
    }
    const weightFields = {
      masque: els.adminWeightMask,
      radio: els.adminWeightRadio,
      meteo: els.adminWeightWeather
    };
    const weights = Object.fromEntries(
      Object.entries(weightFields).map(([type, element]) => [type, Number(element.value)])
    );
    if (!Object.keys(weightFields).every(type =>
      weightFields[type].value.trim() !== ''
      && Number.isInteger(weights[type])
      && weights[type] >= 0 && weights[type] <= 100)
      || Object.values(weights).every(weight => weight === 0)) {
      els.adminStatus.textContent =
        'Pondérations : nombres entiers de 0 à 100, avec au moins une catégorie positive.';
      return;
    }
    try {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify({...values, weights}));
      audioDelays = values;
      audioWeights = weights;
      els.adminStatus.textContent =
        '✓ Cadence et pondérations enregistrées pour cette partie. '
        + 'Les délais déjà lancés restent inchangés ; nouveaux paramètres aux prochains tirages.';
    } catch (_) {
      els.adminStatus.textContent =
        'Impossible de conserver les réglages sur cet appareil.';
    }
  }

  function forceAdminAudioEvent() {
    if (!adminUnlocked || !els.adminModal.classList.contains('show')
      || els.btnTestMaskEvent.disabled) return;
    const selected = AUDIO_EVENTS.find(item =>
      item.id === els.testMaskEventSelect.value);
    if (!selected) return;
    if (eventSession.played.includes(selected.id)) {
      els.adminForceStatus.textContent = 'Événement déjà joué pendant cette partie.';
      return;
    }
    // Aucun événement en cours, aucune pénalité appliquée deux fois :
    // les mêmes garde-fous que les tests manuels existants restent actifs.
    closeAdminModal();
    const started = selected.type === 'radio'
      ? beginRadioEvent(selected, true)
      : selected.type === 'meteo'
        ? beginWeatherEvent(selected, true)
        : beginMaskEvent(selected, true);
    if (!started) {
      showInfo('Événement indisponible',
        'Impossible de démarrer la démonstration dans l’état actuel de la partie.');
    } else {
      // Une démonstration lancée en pleine partie compte comme intervention
      // pour empêcher toute répétition, même via le panneau administrateur.
      eventSession.played.push(selected.id);
      eventSession.lastEventType = selected.type;
      saveAudioEventSession();
      renderEventControls();
    }
  }

  function livingPlayerNumbers() {
    return eventSession.alive.reduce((list, alive, index) => {
      if (alive) list.push(index + 1);
      return list;
    }, []);
  }

  // Les quatre places restent distinctes, même si plusieurs invités ont
  // renseigné le même prénom. Pas d'alias ni de phonétique à ce stade.
  function playerNameKey(name) {
    if (typeof name !== 'string') return '';
    return name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr-FR');
  }

  function playerHasDuplicateName(number) {
    const names = eventSession.playerNames || [];
    const key = playerNameKey(names[number - 1]);
    return Boolean(key && names.some((name, index) =>
      index !== number - 1 && playerNameKey(name) === key));
  }

  function playerLabel(number) {
    const name = eventSession.playerNames?.[number - 1];
    if (typeof name !== 'string' || !name.trim()) return 'Joueur ' + number;
    const label = name.trim();
    return playerHasDuplicateName(number) ? label + ' · J' + number : label;
  }

  function playerDesignation(number) {
    const name = eventSession.playerNames?.[number - 1] || '';
    return window.RdVPlayerNames?.audioPath(name, number)
      || 'audio/events/masque/designations/joueur-' + number + '.mp3';
  }

  function playerDesignationClips(number) {
    const nameAudio = playerDesignation(number);
    const numberAudio = 'audio/events/masque/designations/joueur-'
      + number + '.mp3';
    // Si le prénom n'existe pas dans la bibliothèque, la désignation
    // habituelle « Joueur X » suffit, même en présence d'un doublon.
    if (nameAudio === numberAudio || !playerHasDuplicateName(number)) {
      return [nameAudio];
    }
    // Un doublon réel : « Joueur X ! » PUIS le prénom.
    return [numberAudio, nameAudio];
  }

  // Préparer uniquement les prénoms effectivement inscrits, sur demande.
  let nameCacheTimer = null;
  function prefetchCurrentNames() {
    if (!('serviceWorker' in navigator) || !window.RdVPlayerNames
      || navigator.onLine === false) return;
    const paths = window.RdVPlayerNames.selectedPaths(eventSession.playerNames);
    if (!paths.length) return;
    navigator.serviceWorker.ready.then(reg => {
      reg.active?.postMessage({type:'rdv-cache-prenoms', paths});
    }).catch(() => {});
  }
  function scheduleNamePrefetch() {
    clearTimeout(nameCacheTimer);
    nameCacheTimer = setTimeout(() => {
      nameCacheTimer = null;
      prefetchCurrentNames();
    }, 500);
  }

  function renderEventControls() {
    const alive = livingPlayerNumbers().length;
    els.btnPlayers.textContent = 'JOUEURS · ' + alive + '/4';
    // Le panneau de démarrage disparaît ensuite : priorité aux actions spéciales.
    els.eventGameCard.classList.toggle('hidden', eventSession.active);
    els.btnStartEvents.disabled = eventSession.active || state.value >= 100;
    els.btnStartEvents.textContent = 'COMMENCER LA PARTIE';

    // Les interventions déjà jouées ne sont jamais révélées aux joueurs.
    const showDebug = adminUnlocked && eventSession.active;
    els.btnTestMaskEvent.classList.toggle('hidden', !showDebug);
    els.testMaskEventSelect.classList.toggle('hidden', !showDebug);
    const testEvent = AUDIO_EVENTS.find(item =>
      item.id === els.testMaskEventSelect.value
    ) || AUDIO_EVENTS[0];
    const insufficientDuelPlayers =
      ['masque-004','masque-005','masque-007'].includes(testEvent.id) && alive < 2;
    const locked = state.value < (testEvent.minInstability || 0);
    els.btnTestMaskEvent.textContent = eventSession.played.includes(testEvent.id)
      ? 'DÉJÀ JOUÉ CETTE PARTIE'
      : insufficientDuelPlayers
      ? 'TEST : 2 VIVANTS MINIMUM'
      : locked
      ? 'TEST : MINIMUM ' + testEvent.minInstability + '%'
      : testEvent.type === 'radio' ? 'TESTER LA RADIO'
        : testEvent.type === 'meteo' ? 'TESTER LA MÉTÉO'
        : 'TESTER LE MASQUE';
    els.btnTestMaskEvent.disabled = eventSession.played.includes(testEvent.id)
      || !eventSession.active || currentMaskEvent !== null
      || currentRadioEvent !== null || currentRadio02 !== null
      || currentRadio03 !== null
      || currentRadio04 !== null
      || currentRadio05 !== null
      || currentWeatherEvent !== null
      || currentMask05 !== null
      || currentMask06 !== null
      || currentMask07 !== null
      || currentCoin !== null
      || eventSession.pendingMask005 !== null
      || eventSession.pendingMask006 !== null
      || eventSession.pendingMask007 !== null
      || eventSession.pendingWeather !== null
      || eventSession.pendingRadio002 !== null
      || eventSession.pendingRadio003 !== null
      || eventSession.pendingRadio004 !== null
      || eventSession.pendingRadio005 !== null || alive === 0
      || state.value >= 100 || locked || insufficientDuelPlayers
      || (testEvent.type === 'radio' && eventSession.radioMission
          && eventSession.radioMission.stage !== 'travel');
    renderRadioMission();
  }

  function renderPlayerStatuses() {
    els.eventPlayersList.replaceChildren();

    eventSession.alive.forEach((alive, index) => {
      const slot = index + 1;
      const row = document.createElement('div');
      row.className = 'event-player-row';
      row.classList.toggle('is-dead', !alive);

      const identity = document.createElement('label');
      identity.className = 'event-player-identity';
      const number = document.createElement('span');
      number.className = 'event-player-number';
      number.textContent = 'JOUEUR ' + slot;
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'event-player-name';
      input.id = 'eventPlayerName' + slot;
      input.maxLength = 32;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.placeholder = 'Prénom (facultatif)';
      input.setAttribute('aria-label', 'Prénom du joueur ' + slot);
      input.value = eventSession.playerNames[index] || '';
      input.addEventListener('input', () => {
        eventSession.playerNames[index] = input.value.slice(0,32);
        saveAudioEventSession();
        scheduleNamePrefetch();
      });
      input.addEventListener('change', () => {
        eventSession.playerNames[index] = input.value.trim().slice(0,32);
        input.value = eventSession.playerNames[index];
        saveAudioEventSession();
        scheduleNamePrefetch();
      });
      identity.append(number, input);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'event-player-life';
      toggle.setAttribute('aria-pressed', String(!alive));
      toggle.setAttribute('aria-label', 'Statut de ' + playerLabel(slot)
        + ' : ' + (alive ? 'vivant' : 'mort') + '. Appuyer pour changer.');
      toggle.textContent = alive ? '● VIVANT' : '✕ MORT';
      toggle.addEventListener('click', () => {
        const wasAlive = eventSession.alive[index];
        eventSession.alive[index] = !wasAlive;
        if (wasAlive) cancelMask05IfParticipantDied(slot);
        saveAudioEventSession();
        renderPlayerStatuses();
        renderEventControls();
        updateAudioEventClock();
      });
      row.append(identity, toggle);
      els.eventPlayersList.appendChild(row);
    });
  }

  let playersIntroMode = false;
  function openPlayersModal(introduction = false) {
    if (currentMaskEvent) return;
    // While the Masque is collecting names, the form cannot be dismissed.
    playersIntroMode = introduction || eventSession.introPhase === 'names';
    els.playersModal.classList.toggle('is-intro', playersIntroMode);
    els.playersIntroHeader.classList.toggle('hidden', !playersIntroMode);
    els.playersConfirm.classList.toggle('hidden', !playersIntroMode);
    els.playersClose.classList.toggle('hidden', playersIntroMode);
    renderPlayerStatuses();
    els.playersModal.classList.add('show');
    if (playersIntroMode) els.eventPlayersList.querySelector('input')?.focus();
    else els.playersClose.focus();
  }

  function closePlayersModal(force = false) {
    if (playersIntroMode && !force) return;
    playersIntroMode = false;
    els.playersModal.classList.remove('show', 'is-intro');
    els.playersIntroHeader.classList.add('hidden');
    els.playersConfirm.classList.add('hidden');
    els.playersClose.classList.remove('hidden');
    updateAudioEventClock();
  }

  function confirmIntroNames() {
    if (!eventSession.active || eventSession.introPhase !== 'names'
      || !playersIntroMode) return;
    const hasAnyName = eventSession.playerNames.some(name => name.trim());
    const next = hasAnyName ? 'reaction' : 'anonymous';
    eventSession.introPhase = next;
    saveAudioEventSession();
    prefetchCurrentNames();
    closePlayersModal(true);
    beginMaskIntroduction(next);
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
      && !eventSession.introPhase
      && !gameOverShown
      && state.value < 100
      && document.visibilityState === 'visible'
      && isPartieTabActive()
      && currentMaskEvent === null
      && currentMask05 === null
      && currentMask06 === null
      && currentMask07 === null
      && currentCoin === null
      && currentRadioEvent === null
      && currentRadio02 === null
      && currentRadio03 === null
      && currentRadio04 === null
      && currentWeatherEvent === null
      && !eventSession.pendingWeather
      && !eventSession.pendingMask005
      && !eventSession.pendingMask006
      && !eventSession.pendingMask007
      && !eventSession.pendingRadio002
      && !eventSession.pendingRadio003
      && !eventSession.pendingRadio004
      && !eventSession.pendingRadio005
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
      eventSession.remainingMs = randomAudioDelay();
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

    let candidates = eligibleAudioEvents().filter(item => audioWeights[item.type] > 0);
    if (candidates.length === 0) return;
    // Alterner les catégories si possible ; choisir d'abord une catégorie,
    // puis une carte. Évite qu'une famille plus fournie monopolise la pioche.
    const otherType = candidates.filter(
      item => item.type !== eventSession.lastEventType
    );
    if (otherType.length) candidates = otherType;
    const categories = [...new Set(candidates.map(item => item.type))];
    const totalWeight = categories.reduce(
      (sum, type) => sum + audioWeights[type], 0
    );
    let draw = randomBetween(1, totalWeight);
    const chosenType = categories.find(type => {
      draw -= audioWeights[type];
      return draw <= 0;
    }) || categories[0];
    const sameType = candidates.filter(item => item.type === chosenType);
    const item = sameType[randomBetween(0, sameType.length - 1)];
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
    // Chaque étape de l'accueil est sauvée pour reprendre après F5.
    eventSession.introPlayed = false;
    eventSession.introPhase = 'presentation';
    eventSession.weatherCount = 0;
    eventSession.nextWeatherEligibleAt = 0;
    eventSession.pendingWeather = null;
    eventSession.pendingRadio002 = null;
    eventSession.pendingRadio003 = null;
    eventSession.pendingRadio004 = null;
    eventSession.pendingRadio005 = null;
    eventSession.pendingMask005 = null;
    eventSession.pendingMask006 = null;
    eventSession.pendingMask007 = null;
    eventSession.played = [];
    eventSession.remainingMs = randomAudioDelay(true);
    saveAudioEventSession();
    prefetchCurrentNames();
    renderEventControls();

    // Lecture sur le geste de l'utilisateur (Android).
    // Aucun tirage d'événement avant le dernier mot du Masque.
    if (!beginMaskIntroduction('presentation')) {
      // Un blocage temporaire de lecture ne débloque jamais le minuteur.
      eventSession.introPhase = 'presentation';
      saveAudioEventSession();
    }
  }

  // Présentation en trois actes : narration → demande → formulaire → réponse.
  // La surprise est conservée : aucune désignation de prénom à ce stade.
  const MASK_INTRO_STAGES = Object.freeze({
    presentation: MASK_INTRO_AUDIO,
    request: 'audio/events/masque/introduction/masque-000-demande-prenoms.mp3',
    reaction: 'audio/events/masque/introduction/masque-000-reaction-prenoms.mp3',
    anonymous: 'audio/events/masque/introduction/masque-000-aucun-prenom.mp3'
  });

  function beginMaskIntroduction(stage = eventSession.introPhase || 'presentation') {
    if (!eventSession.active || currentMaskEvent || currentRadioEvent || currentWeatherEvent
      || state.value >= 100 || !isPartieTabActive()
      || document.visibilityState !== 'visible' || specialAudioActive
      || anyBlockingModalOpen()) return false;
    if (stage !== 'names' && !MASK_INTRO_STAGES[stage]) return false;

    eventSession.introPhase = stage;
    saveAudioEventSession();
    if (stage === 'names') {
      openPlayersModal(true);
      return true;
    }

    const token = ++maskEventToken;
    const audio = new Audio(MASK_INTRO_STAGES[stage]);
    audio.preload = 'auto';
    audio.volume = 1;
    currentMaskEvent = {
      token, intro: true, introStage: stage, audios: [audio],
      activeAudio: null, segment: 0, pendingSegment: null
    };

    els.maskEventTitle.textContent = 'Le Masque';
    els.maskEventPortrait.src = getMaskState(state.value).src;
    els.maskEventStatus.textContent = stage === 'presentation'
      ? 'Le Masque vous accueille…'
      : stage === 'request' ? 'Le Masque souhaite faire votre connaissance…'
      : 'Le Masque réagit aux présentations…';
    clearTimeout(maskClosingTimer);
    maskClosingTimer = null;
    els.maskEventOverlay.classList.remove('closing', 'has-result',
      'has-choices', 'has-generosity');
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

  function advanceMaskIntroduction() {
    const running = currentMaskEvent;
    if (!running?.intro) return;
    const stage = running.introStage;
    if (stage === 'reaction' || stage === 'anonymous') {
      finishMaskIntroduction();
      return;
    }
    const next = stage === 'presentation' ? 'request' : 'names';
    dismissMaskEvent(true);
    eventSession.introPhase = next;
    saveAudioEventSession();
    clearTimeout(eventAudioGapTimer);
    eventAudioGapTimer = setTimeout(() => {
      eventAudioGapTimer = null;
      if (eventSession.active && eventSession.introPhase === next
        && !playersIntroMode && !currentMaskEvent) {
        beginMaskIntroduction(next);
      }
    }, REDUCED_MOTION ? 0 : 430);
  }

  function resumePendingMaskIntroIfPossible() {
    if (!eventSession.active || !eventSession.introPhase
      || state.value >= 100 || !isPartieTabActive()
      || document.visibilityState !== 'visible'
      || currentMaskEvent || playersIntroMode) return false;
    return beginMaskIntroduction(eventSession.introPhase);
  }

  function finishMaskIntroduction(immediate = false) {
    const running = currentMaskEvent;
    if (!running || !running.intro) return;
    const token = running.token;
    const finish = () => {
      if (!currentMaskEvent || currentMaskEvent.token !== token) return;
      dismissMaskEvent();
      eventSession.introPhase = null;
      eventSession.introPlayed = true;
      saveAudioEventSession();
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
    clearTimeout(mask06DeferredOutcomeTimer);
    mask06DeferredOutcomeTimer = null;
    clearTimeout(radio03DeferredOutcomeTimer);
    radio03DeferredOutcomeTimer=null;
    hideMask05CancelNotice();
    clearTimeout(maskDeferredOutcomeTimer);
    maskDeferredOutcomeTimer = null;
    pauseAudioEventClock();
    dismissMaskEvent(true);
    dismissMask05();
    dismissMask06();
    dismissMask07();
    dismissCoin();
    dismissRadioEvent(true);
    dismissRadio02();
    dismissRadio03();
    dismissRadio04();
    dismissRadio05();
    dismissWeatherEvent(true);
    clearTimeout(weatherReadyTimer);
    weatherReadyTimer = null;
    clearTimeout(weatherDeferredOutcomeTimer);
    weatherDeferredOutcomeTimer = null;
    eventSession.active = false;
    eventSession.introPlayed = false;
    eventSession.introPhase = null;
    closePlayersModal(true);
    eventSession.radioMission = null;
    eventSession.lastEventType = null;
    eventSession.weatherCount = 0;
    eventSession.nextWeatherEligibleAt = 0;
    eventSession.pendingWeather = null;
    eventSession.pendingRadio002 = null;
    eventSession.pendingRadio003 = null;
    eventSession.pendingRadio004 = null;
    eventSession.pendingRadio005 = null;
    eventSession.pendingMask005 = null;
    eventSession.pendingMask006 = null;
    eventSession.pendingMask007 = null;
    eventSession.alive = [true, true, true, true];
    eventSession.playerNames = ['', '', '', ''];
    clearTimeout(nameCacheTimer);
    nameCacheTimer = null;
    eventSession.played = [];
    eventSession.remainingMs = null;
    saveAudioEventSession();
    renderEventControls();
  }

  function stopAudioEventsForGameOver() {
    clearTimeout(mask06DeferredOutcomeTimer);
    mask06DeferredOutcomeTimer = null;
    clearTimeout(radio03DeferredOutcomeTimer);
    radio03DeferredOutcomeTimer=null;
    hideMask05CancelNotice();
    clearTimeout(maskDeferredOutcomeTimer);
    maskDeferredOutcomeTimer = null;
    if (!eventSession.active && !currentMaskEvent && !currentMask05 && !currentMask06 && !currentMask07
      && !eventSession.pendingMask006 && !eventSession.pendingMask007 && !currentRadioEvent && !currentRadio02 && !currentRadio03 && !currentWeatherEvent
      && !eventSession.pendingWeather && !eventSession.pendingRadio002
      && !eventSession.pendingRadio003 && !eventSession.pendingRadio004 && !currentRadio04
      && !eventSession.pendingRadio005 && !currentRadio05) return;
    pauseAudioEventClock();
    dismissMaskEvent(true);
    dismissMask05();
    dismissMask06();
    dismissRadioEvent(true);
    dismissRadio02();
    dismissRadio03();
    dismissRadio04();
    dismissRadio05();
    dismissWeatherEvent(true);
    clearTimeout(weatherReadyTimer);
    weatherReadyTimer = null;
    clearTimeout(weatherDeferredOutcomeTimer);
    weatherDeferredOutcomeTimer = null;
    eventSession.active = false;
    eventSession.radioMission = null;
    eventSession.pendingWeather = null;
    eventSession.pendingRadio002 = null;
    eventSession.pendingRadio003 = null;
    eventSession.pendingRadio004 = null;
    eventSession.pendingRadio005 = null;
    eventSession.pendingMask005 = null;
    eventSession.pendingMask006 = null;
    eventSession.pendingMask007 = null;
    eventSession.remainingMs = null;
    saveAudioEventSession();
    renderEventControls();
  }

  function beginMaskEvent(item, preview) {
    if (item?.id === 'masque-005') return beginMask05(item, preview);
    if (item?.id === 'masque-006') return beginMask06(item, preview);
    if (item?.id === 'masque-007') return beginMask07(item, preview);
    if (!eventSession.active || currentMask05 || currentMaskEvent || currentRadioEvent || currentWeatherEvent || state.value >= 100
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

    const designationPaths = [
      ...playerDesignationClips(player),
      ...(opponent === null ? [] : playerDesignationClips(opponent))
    ];
    const audios = [
      ...designationPaths.map(src => new Audio(src)),
      new Audio(item.audio)
    ];
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
      designationClipCount: designationPaths.length,
      duelAudio: item.id === 'masque-004' ? audios[audios.length - 1] : null,
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
        playerLabel(player) + ', à toi de décider.\n\n'
        + '1. Subis 1 blessure ET passe ton prochain tour.\n'
        + '2. Évite ces pénalités, mais inflige +15 points d’Instabilité au groupe.';
      els.maskEventChoices.classList.remove('hidden');
      els.maskEventDone.classList.add('hidden');
    } else {
      els.maskEventEffect.textContent =
        playerLabel(player)
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
        playerLabel(running.player) + ' : tu te sacrifies.\n\n'
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
        playerLabel(running.player) + ' : le groupe paie.\n\n'
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
  // MASQUE 005 — LA CONFIDENCE EMPOISONNÉE
  // =========================================================

  function saveMask05Stage() {
    const r = currentMask05;
    if (!r || r.preview) return;
    eventSession.pendingMask005 = {
      id: r.item.id, stage: r.stage, target: r.target,
      accomplice: r.accomplice, deadline: r.deadline || 0,
      outcome: r.outcome || null
    };
    saveAudioEventSession();
  }

  function hideMask05CancelNotice() {
    clearTimeout(mask05CancelNoticeTimer);
    mask05CancelNoticeTimer = null;
    els.mask05CancelNotice.classList.add('hidden');
  }

  function mask05Controls() {
    for (const name of ['Private','Start','Success','Failure','Play','Skip','Done']) {
      els['mask05' + name].classList.add('hidden');
    }
    els.mask05Hint.classList.add('hidden');
    els.mask05Outcome.classList.add('hidden');
  }

  function showMask05Overlay() {
    els.mask05Banner.classList.add('hidden');
    els.mask05Overlay.classList.add('show');
    els.mask05Overlay.classList.toggle('is-interactive',
      ['private-ready','start-ready','decision','result'].includes(currentMask05?.stage));
    els.mask05Overlay.setAttribute('aria-hidden', 'false');
    specialAudioActive = true;
    syncAmbientVolume();
    mask05Controls();
  }

  function dismissMask05() {
    mask05Token++;
    const r = currentMask05;
    if (r) {
      clearInterval(r.tickTimer);
      clearTimeout(r.gapTimer);
      clearTimeout(r.gongTimer);
      if (r.audio) {
        r.audio.pause();
        r.audio.onended = null;
        r.audio.onerror = null;
      }
    }
    currentMask05 = null;
    els.mask05Banner.classList.add('hidden');
    els.mask05Overlay.classList.remove('show', 'is-interactive');
    els.mask05Overlay.setAttribute('aria-hidden', 'true');
    mask05Controls();
    specialAudioActive = false;
    syncAmbientVolume();
  }

  function beginMask05(item, preview, restoring = false) {
    if (!item || item.id !== 'masque-005' || !eventSession.active
      || currentMaskEvent || currentMask05 || currentRadioEvent
      || currentRadio02 || currentWeatherEvent || specialAudioActive
      || anyBlockingModalOpen() || !isPartieTabActive()
      || document.visibilityState !== 'visible' || state.value >= 100) return false;

    const pending = restoring ? eventSession.pendingMask005 : null;
    if (restoring && (!pending || pending.id !== item.id)) return false;
    const pool = livingPlayerNumbers();
    if (!restoring && pool.length < 2) return false;
    const target = restoring ? pending.target : pool[randomBetween(0, pool.length - 1)];
    const remaining = pool.filter(p => p !== target);
    const accomplice = restoring ? pending.accomplice
      : remaining[randomBetween(0, remaining.length - 1)];
    if (target === accomplice) return false;

    hideMask05CancelNotice();
    pauseAudioEventClock();
    const previousDelay = eventSession.remainingMs;
    currentMask05 = {
      item, preview, token: ++mask05Token, target, accomplice,
      stage: restoring ? pending.stage : 'public',
      savedPreviewDelay: previousDelay, deadline: pending?.deadline || 0,
      outcome: pending?.outcome || null,
      audio: null, afterAudio: null, publicIndex: 0,
      tickTimer: null, gapTimer: null, gongTimer: null
    };
    if (!preview && !restoring) {
      eventSession.played.push(item.id);
      eventSession.remainingMs = null;
      saveMask05Stage();
    }

    els.mask05Portrait.src = getMaskState(state.value).src;
    els.mask05Heading.textContent = 'INTERVENTION DU MASQUE';
    showMask05Overlay();
    silenceHauntSounds();
    renderEventControls();

    const r = currentMask05;
    // Après un rechargement, la confidence ne repart JAMAIS en lecture automatique.
    if (r.stage === 'public') playMask05PublicPart(0);
    else if (r.stage === 'private-ready' || r.stage === 'secret') showMask05PrivateReady();
    else if (r.stage === 'start-ready') showMask05StartReady();
    else if (r.stage === 'mission') restoreMask05Mission();
    else if (r.stage === 'gong' || r.stage === 'verdict') playMask05Verdict();
    else if (r.stage === 'decision') showMask05Decision();
    else if (r.stage === 'reaction') playMask05Reaction();
    else if (r.stage === 'result') showMask05Result();
    return true;
  }

  function playMask05Audio(src, status, onEnd, volume = 1) {
    const r = currentMask05;
    if (!r) return;
    if (r.audio) {
      r.audio.pause();
      r.audio.onended = null;
      r.audio.onerror = null;
    }
    const sound = new Audio(src);
    sound.preload = 'auto';
    sound.volume = volume;
    r.audio = sound;
    r.afterAudio = onEnd;
    els.mask05Status.textContent = status;
    els.mask05Play.classList.add('hidden');
    els.mask05Skip.classList.add('hidden');

    const token = r.token;
    sound.onended = () => {
      if (currentMask05?.token !== token || r.audio !== sound) return;
      r.afterAudio = null;
      onEnd();
    };
    sound.onerror = () => {
      if (currentMask05?.token === token && r.audio === sound)
        showMask05AudioFallback();
    };
    if (document.visibilityState === 'visible') resumeMask05Audio();
    else showMask05AudioFallback();
  }

  function showMask05AudioFallback() {
    const r = currentMask05;
    if (!r || !r.audio) return;
    els.mask05Play.textContent = 'REPRENDRE L’ENREGISTREMENT';
    els.mask05Play.classList.remove('hidden');
    els.mask05Skip.classList.remove('hidden');
    els.mask05Status.textContent = 'Lecture suspendue. Touchez pour reprendre.';
  }

  function resumeMask05Audio() {
    const r = currentMask05;
    if (!r || !r.audio || document.visibilityState !== 'visible') return;
    els.mask05Play.classList.add('hidden');
    els.mask05Skip.classList.add('hidden');
    r.audio.play().catch(() => {
      if (currentMask05 === r) showMask05AudioFallback();
    });
  }

  function skipMask05Audio() {
    const r = currentMask05;
    if (!r || !r.audio || !r.afterAudio) return;
    const end = r.afterAudio;
    r.afterAudio = null;
    r.audio.pause();
    r.audio.onended = null;
    r.audio.onerror = null;
    els.mask05Play.classList.add('hidden');
    els.mask05Skip.classList.add('hidden');
    // En cas d'échec audio, le texte de la mission doit rester accessible
    // au SEUL confident, sans lequel il ne pourrait pas accomplir le défi.
    if (r.stage === 'secret') showMask05StartReady(true);
    else end();
  }

  function playMask05PublicPart(index) {
    const r = currentMask05;
    if (!r || r.stage !== 'public') return;
    clearTimeout(r.gapTimer);
    const targetClips = playerDesignationClips(r.target);
    const accompliceClips = playerDesignationClips(r.accomplice);
    const clips = [
      r.item.introAudio,
      ...targetClips,
      r.item.cibleAudio,
      ...accompliceClips,
      r.item.transfertAudio
    ];
    if (index >= clips.length) {
      showMask05PrivateReady();
      return;
    }
    r.publicIndex = index;
    playMask05Audio(
      clips[index],
      index >= 1 && index <= targetClips.length
        ? 'Le Masque désigne un survivant…'
        : index >= targetClips.length + 2
          && index <= targetClips.length + accompliceClips.length + 1
          ? 'Le Masque choisit son confident…'
          : 'Le Masque s’adresse au groupe…',
      () => {
        if (currentMask05 !== r || r.stage !== 'public') return;
        r.gapTimer = setTimeout(() => {
          r.gapTimer = null;
          playMask05PublicPart(index + 1);
        }, 280);
      }
    );
  }

  function showMask05PrivateReady() {
    const r = currentMask05;
    if (!r) return;
    r.stage = 'private-ready';
    if (r.audio) r.audio.pause();
    r.audio = null;
    r.afterAudio = null;
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'TRANSMISSION CONFIDENTIELLE';
    els.mask05Status.textContent =
      playerLabel(r.accomplice).toLocaleUpperCase('fr-FR') + ' : prends le téléphone.\n'
      + 'Éloigne-toi légèrement des autres survivants.';
    els.mask05Hint.textContent =
      'Approche l’appareil de ton oreille et règle son volume au minimum audible. '
      + 'Le message ne doit être entendu que par toi.';
    els.mask05Hint.classList.remove('hidden');
    els.mask05Private.classList.remove('hidden');
    els.mask05Private.focus();
  }

  function startMask05Secret() {
    const r = currentMask05;
    if (!r || r.stage !== 'private-ready') return;
    r.stage = 'secret';
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'TRANSMISSION CONFIDENTIELLE';
    // Volume bas par défaut, sans promettre un vrai mode écouteur.
    playMask05Audio(r.item.secretAudio, '',
      () => showMask05StartReady(), 0.4);
  }

  function showMask05StartReady(audioUnavailable = false) {
    const r = currentMask05;
    if (!r) return;
    r.stage = 'start-ready';
    if (r.audio) r.audio.pause();
    r.audio = null;
    r.afterAudio = null;
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'TRANSMISSION CONFIDENTIELLE';
    els.mask05Status.textContent =
      playerLabel(r.accomplice).toLocaleUpperCase('fr-FR') + ' : retourne à la table.\n'
      + 'La mission commencera lorsque tu confirmeras être prêt.';
    if (audioUnavailable) {
      els.mask05Hint.textContent =
        'MISSION SECRÈTE (à lire seul) : Fais lever entièrement le joueur '
        + playerLabel(r.target) + ' de sa chaise dans les cinq prochaines minutes, '
        + 'sans dévoiler cet objectif ni employer la force. '
        + 'Un lever spontané compte également comme une réussite.';
      els.mask05Hint.classList.remove('hidden');
    }
    els.mask05Start.classList.remove('hidden');
    els.mask05Start.focus();
  }

  function showMask05MissionBanner() {
    const r = currentMask05;
    if (!r) return;
    els.mask05Overlay.classList.remove('show');
    els.mask05Overlay.setAttribute('aria-hidden', 'true');
    els.mask05Banner.classList.remove('hidden');
    specialAudioActive = false;
    syncAmbientVolume();
    updateMask05Countdown();
  }

  function startMask05Mission() {
    const r = currentMask05;
    if (!r || r.stage !== 'start-ready') return;
    r.stage = 'mission';
    r.deadline = Date.now() + MASK05_MISSION_MS;
    saveMask05Stage();
    showMask05MissionBanner();
    // Le clic sur « Commencer la mission » fournit un geste utilisateur :
    // si le navigateur a interrompu l'ambiance, reprendre le lecteur EXISTANT
    // sans remettre sa position à zéro.
    if (state.musicOn) syncMusicForActiveTab();
    runMask05MissionClock();
  }

  function restoreMask05Mission() {
    const r = currentMask05;
    if (!r || r.stage !== 'mission') return;
    // La durée réelle de la mission continue si l'appli passe en arrière-plan.
    // À la réouverture, le temps est recalculé à partir de l'échéance sauvegardée.
    if (!r.deadline) {
      r.deadline = Date.now() + MASK05_MISSION_MS;
      saveMask05Stage();
    }
    showMask05MissionBanner();
    runMask05MissionClock();
  }

  function updateMask05Countdown() {
    const r = currentMask05;
    if (!r || r.stage !== 'mission') return;
    const remaining = Math.max(0, r.deadline - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    els.mask05BannerClock.textContent = mm + ':' + ss;
    els.mask05BannerProgress.style.width =
      (remaining / MASK05_MISSION_MS * 100).toFixed(2) + '%';
    if (!remaining && document.visibilityState === 'visible') beginMask05Gong();
  }

  function runMask05MissionClock() {
    const r = currentMask05;
    if (!r || r.stage !== 'mission') return;
    clearInterval(r.tickTimer);
    r.tickTimer = setInterval(() => updateMask05Countdown(), 250);
    updateMask05Countdown();
  }

  function beginMask05Gong() {
    const r = currentMask05;
    if (!r || r.stage !== 'mission') return;
    r.stage = 'gong';
    clearInterval(r.tickTimer);
    r.tickTimer = null;
    saveMask05Stage();
    // Laisser retentir le gong avant de montrer le Masque.
    els.mask05Banner.classList.add('hidden');
    els.mask05Overlay.classList.remove('show');
    els.mask05Overlay.setAttribute('aria-hidden', 'true');
    specialAudioActive = true;
    syncAmbientVolume();
    const gong = new Audio(r.item.gongAudio);
    r.audio = gong;
    r.afterAudio = null;
    gong.volume = 1;
    gong.preload = 'auto';

    // Garder presque tout l'écho, sans attendre les dernières 1,5 s
    // silencieuses ou très faibles du MP3 de 12 secondes.
    // Démarrer le délai APRÈS que la lecture est effectivement autorisée.
    const finishGong = () => {
      if (currentMask05 !== r || r.stage !== 'gong') return;
      clearTimeout(r.gongTimer);
      r.gongTimer = null;
      playMask05Verdict();
    };
    gong.onended = finishGong;
    gong.onerror = finishGong;
    gong.play().then(() => {
      if (currentMask05 !== r || r.stage !== 'gong') return;
      r.gongTimer = setTimeout(finishGong, 10500);
    }).catch(finishGong);
  }

  function playMask05Verdict() {
    const r = currentMask05;
    if (!r) return;
    clearTimeout(r.gongTimer);
    r.gongTimer = null;
    r.stage = 'verdict';
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'LE VERDICT DU MASQUE';
    playMask05Audio(r.item.verdictAudio, 'Le Masque vous interroge…',
      () => showMask05Decision());
  }

  function showMask05Decision() {
    const r = currentMask05;
    if (!r) return;
    r.stage = 'decision';
    r.afterAudio = null;
    r.audio?.pause();
    r.audio = null;
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'LE VERDICT DU MASQUE';
    els.mask05Status.textContent =
      playerLabel(r.accomplice).toLocaleUpperCase('fr-FR') + ' : as-tu réussi à faire lever '
      + playerLabel(r.target) + ' dans le temps imparti ?';
    els.mask05Success.classList.remove('hidden');
    els.mask05Failure.classList.remove('hidden');
    els.mask05Success.focus();
  }

  function resolveMask05(outcome) {
    const r = currentMask05;
    if (!r || r.stage !== 'decision'
      || !['success','failure'].includes(outcome)) return;
    r.outcome = outcome;
    playMask05Reaction();
  }

  function playMask05Reaction() {
    const r = currentMask05;
    if (!r || !['success','failure'].includes(r.outcome)) return;
    r.stage = 'reaction';
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'LA SENTENCE DU MASQUE';
    playMask05Audio(
      r.outcome === 'success' ? r.item.successAudio : r.item.failureAudio,
      '',
      () => showMask05Result()
    );
  }

  function showMask05Result() {
    const r = currentMask05;
    if (!r || !['success','failure'].includes(r.outcome)) return;
    r.stage = 'result';
    r.audio?.pause();
    r.audio = null;
    r.afterAudio = null;
    saveMask05Stage();
    showMask05Overlay();
    els.mask05Heading.textContent = 'MISSION DU MASQUE TERMINÉE';
    els.mask05Status.textContent = 'Le Masque a rendu sa sentence.';
    if (r.outcome === 'success') {
      els.mask05Outcome.textContent =
        'MISSION ACCOMPLIE.\n\n'
        + playerLabel(r.accomplice).toLocaleUpperCase('fr-FR') + ' : récupère 1 PV.\n\n'
        + 'Si tu es déjà en pleine santé, tu peux offrir ce soin à '
        + 'un autre survivant vivant de ton choix. '
        + 'Si tout le monde est en pleine santé, aucun effet.\n\n'
        + 'Reportez le soin sur la feuille de personnage.';
    } else {
      els.mask05Outcome.textContent =
        playerLabel(r.accomplice).toLocaleUpperCase('fr-FR') + ' : passe ton prochain TOUR DE JEU.\n\n'
        + 'Tu ne réalises pas tes actions individuelles de ce tour, '
        + 'mais tu peux toujours participer aux COMBATS '
        + 'déclenchés par tes coéquipiers.\n\n'
        + 'Notez cette pénalité pour le prochain tour.';
    }
    els.mask05Outcome.classList.remove('hidden');
    els.mask05Done.classList.remove('hidden');
    els.mask05Done.focus();
  }

  function cancelMask05IfParticipantDied(player) {
    const r = currentMask05;
    // Aucun effet si la mission n'est pas en cours ou si le joueur
    // décédé n'est ni la cible ni le confident.
    if (!r || r.stage !== 'mission'
      || (player !== r.target && player !== r.accomplice)) return false;

    const delay = r.preview
      ? r.savedPreviewDelay
      : randomAudioDelay();
    dismissMask05();
    if (!r.preview) eventSession.pendingMask005 = null;
    eventSession.remainingMs = delay;
    saveAudioEventSession();

    // Petit message d'information, sans masquer le plateau ni demander
    // un clic supplémentaire. Il s'efface au bout de huit secondes.
    hideMask05CancelNotice();
    els.mask05CancelText.textContent =
      playerLabel(player).toLocaleUpperCase('fr-FR') + ' est mort. '
      + 'La mission est interrompue : ni récompense ni pénalité.';
    els.mask05CancelNotice.classList.remove('hidden');
    mask05CancelNoticeTimer = setTimeout(() => {
      mask05CancelNoticeTimer = null;
      els.mask05CancelNotice.classList.add('hidden');
    }, 8000);
    return true;
  }

  function completeMask05() {
    const r = currentMask05;
    if (!r || r.stage !== 'result') return;
    const delay = r.preview ? r.savedPreviewDelay : randomAudioDelay();
    dismissMask05();
    if (!r.preview) eventSession.pendingMask005 = null;
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    // Le clic sur « Continuer la partie » peut également réautoriser le son.
    if (state.musicOn) syncMusicForActiveTab();
    updateAudioEventClock();
  }

  function handleMask05Visibility() {
    const r = currentMask05;
    if (!r) return;
    if (r.stage === 'mission') {
      if (document.visibilityState === 'visible') updateMask05Countdown();
      return;
    }
    if (document.visibilityState === 'hidden') {
      if (r.stage === 'gong') {
        // Si l'appli est masquée au moment du gong, le verdict restera accessible.
        clearTimeout(r.gongTimer);
        r.gongTimer = null;
        r.audio?.pause();
        r.audio = null;
        r.stage = 'verdict';
        saveMask05Stage();
        showMask05Overlay();
        els.mask05Status.textContent = 'Verdict suspendu. Revenez à l’application.';
        return;
      }
      if (r.audio && !r.audio.paused) {
        r.audio.pause();
        showMask05AudioFallback();
      }
    } else if (r.stage === 'verdict' && !r.audio) {
      playMask05Verdict();
    }
  }

  function resumePendingMask05IfPossible() {
    const pending = eventSession.pendingMask005;
    if (!pending || !eventSession.active || gameOverShown
      || state.value >= 100 || document.visibilityState !== 'visible') return false;
    const item = AUDIO_EVENTS.find(entry => entry.id === pending.id);
    if (!item) {
      eventSession.pendingMask005 = null;
      saveAudioEventSession();
      return false;
    }
    return beginMask05(item, false, true);
  }



  // =========================================================
  // JETON DU MASQUE — pile ou face réutilisable, animation CSS/WAAPI
  // 50/50 : résultat fixé avant le mouvement, jamais par l'animation.
  // =========================================================


  // Les sons de rotation suivent la courbe CSS. Le verdict utilise l'audio
  // ElevenLabs d'origine et continue naturellement après fermeture du jeton.
  const COIN_SPIN_MS = 3500;
  const COIN_SPIN_EASING = 'cubic-bezier(.15,.67,.13,1)';
  const COIN_VERDICT_SFX = 'audio/events/sfx/jeton-verdict.mp3';
  const COIN_VERDICT_VOLUME = .52;
  let coinAudioContext = null;
  let coinNoiseBuffer = null;
  let coinVerdictBuffer = null;
  let coinVerdictLoad = null;

  function coinPrepareAudio() {
    const AudioContextClass = typeof window === 'undefined' ? null
      : (window.AudioContext || window.webkitAudioContext);
    if (!AudioContextClass) return null;
    try {
      if (!coinAudioContext || coinAudioContext.state === 'closed') {
        coinAudioContext = new AudioContextClass();
        coinNoiseBuffer = null;
        coinVerdictBuffer = null;
        coinVerdictLoad = null;
      }
      // Appel déclenché par le geste du joueur (jeton manuel ou MASQUE-007).
      if (coinAudioContext.state !== 'running') {
        const resumed = coinAudioContext.resume();
        resumed?.catch?.(() => {});
      }
      return coinAudioContext;
    } catch (_) { return null; } // Audio facultatif : l'esquive fonctionne toujours.
  }

  function coinPreloadVerdict() {
    const ctx = coinPrepareAudio();
    if (!ctx) return Promise.resolve(null);
    if (coinVerdictBuffer) return Promise.resolve(coinVerdictBuffer);
    if (!coinVerdictLoad) {
      coinVerdictLoad = fetch(COIN_VERDICT_SFX)
        .then(response => {
          if (!response.ok) throw new Error('Verdict introuvable : ' + response.status);
          return response.arrayBuffer();
        })
        .then(bytes => ctx.decodeAudioData(bytes))
        .then(buffer => {
          coinVerdictBuffer = buffer;
          return buffer;
        })
        .catch(() => {
          // Le verdict reste visuel si le média est indisponible hors ligne.
          coinVerdictLoad = null;
          return null;
        });
    }
    return coinVerdictLoad;
  }

  function coinPlayVerdict() {
    const ctx = coinPrepareAudio();
    if (!ctx) return;
    // Source indépendante du jeton : CONTINUER ne coupe jamais sa résonance.
    coinPreloadVerdict().then(buffer => {
      if (!buffer || ctx.state !== 'running') return;
      try {
        const source = ctx.createBufferSource();
        const volume = ctx.createGain();
        source.buffer = buffer;
        volume.gain.value = COIN_VERDICT_VOLUME;
        source.connect(volume);
        volume.connect(ctx.destination);
        source.onended = () => {
          try { source.disconnect(); } catch (_) {}
          try { volume.disconnect(); } catch (_) {}
        };
        source.start(); // Vitesse et durée d'origine : environ 3,5 secondes.
      } catch (_) { /* Le son facultatif ne bloque pas le résultat. */ }
    });
  }

  function coinCubic(t, p1, p2) {
    const u = 1 - t;
    return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
  }

  function coinElapsedForRotation(progress) {
    // Inverser la composante Y (angle) pour retrouver le temps X de la
    // même courbe CSS/WAAPI. Un frottement à chaque passage sur la tranche.
    let low = 0, high = 1;
    for (let i = 0; i < 28; i++) {
      const m = (low + high) / 2;
      if (coinCubic(m, .67, 1) < progress) low = m;
      else high = m;
    }
    return COIN_SPIN_MS / 1000 * coinCubic((low + high) / 2, .15, .13);
  }

  function coinStopAudio(c) {
    if (!c) return;
    for (const node of c.soundSources || []) {
      try { node.stop(); } catch (_) {}
    }
    c.soundSources = [];
    if (c.soundBus) {
      try { c.soundBus.disconnect(); } catch (_) {}
      c.soundBus = null;
    }
  }

  function coinScheduleSound(c, degrees) {
    const ctx = coinPrepareAudio();
    if (!ctx || ctx.state !== 'running' || !c) return;
    try {
      if (!coinNoiseBuffer || coinNoiseBuffer.sampleRate !== ctx.sampleRate) {
        const length = Math.ceil(ctx.sampleRate * .15);
        coinNoiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = coinNoiseBuffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
          // Un souffle voilé, jamais de clics de machine à sous.
          data[i] = (Math.random() * 2 - 1) * .65;
        }
      }

      c.soundSources = [];
      const bus = ctx.createGain();
      bus.gain.value = .72;
      bus.connect(ctx.destination);
      c.soundBus = bus;

      const begin = ctx.currentTime + .015;
      const times = [];
      for (let angle = 90; angle < degrees; angle += 180) {
        times.push(coinElapsedForRotation(angle / degrees));
      }

      for (let i = 0; i < times.length; i++) {
        const gapBefore = i === 0 ? times[0]
          : times[i] - times[i - 1];
        const speed = Math.min(1, .18 / Math.max(.025, gapBefore));
        const at = begin + times[i];
        const source = ctx.createBufferSource();
        source.buffer = coinNoiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 680 + speed * 400;
        filter.Q.value = .65;
        const vol = ctx.createGain();
        vol.gain.setValueAtTime(.0001, at);
        vol.gain.linearRampToValueAtTime((.085 + speed * .09), at + .012);
        vol.gain.exponentialRampToValueAtTime(.0001, at + .14);
        source.connect(filter);
        filter.connect(vol);
        vol.connect(bus);
        source.start(at);
        source.stop(at + .145);
        c.soundSources.push(source);

        // Une résonance grave discrète pour éloigner l'effet mécanique.
        const low = ctx.createOscillator();
        low.type = 'sine';
        low.frequency.setValueAtTime(240 + speed * 75, at);
        low.frequency.exponentialRampToValueAtTime(145, at + .13);
        const lowVol = ctx.createGain();
        lowVol.gain.setValueAtTime(.0001, at);
        lowVol.gain.linearRampToValueAtTime(.018 + speed * .011, at + .012);
        lowVol.gain.exponentialRampToValueAtTime(.0001, at + .13);
        low.connect(lowVol);
        lowVol.connect(bus);
        low.start(at);
        low.stop(at + .135);
        c.soundSources.push(low);
      }

      // Le bruitage final MP3 joue lors de revealCoin(), pas ici.
      // Il n'est pas relié à soundBus, coupé quand la fenêtre se ferme.

    } catch (_) {
      coinStopAudio(c); // Une API audio capricieuse ne bloque jamais le jeu.
    }
  }

  function drawCoinOutcome() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const bytes = new Uint32Array(1);
      crypto.getRandomValues(bytes);
      return (bytes[0] & 1) === 0 ? 'success' : 'fail';
    }
    return Math.random() < 0.5 ? 'success' : 'fail';
  }

  function coinFaceAngle(outcome) {
    return outcome === 'success' ? 0 : 180;
  }

  function openCoin({ mode, outcome = null, onDone = null }) {
    if (currentCoin || !['manual', 'masque-007'].includes(mode)) return false;
    currentCoin = {
      token: ++coinToken, mode, outcome, onDone,
      spinning: false, revealed: false, animation: null,
      timeout: null
    };
    els.coinFrontImg.src = 'img/jeton-masque-pile.png';
    els.coinBackImg.src = 'img/jeton-masque-face.png';
    coinPrepareAudio();
    // Précharger/décoder le verdict pendant les 3,5 secondes de rotation.
    void coinPreloadVerdict();
    els.coinDisc.style.transform = 'rotateY(0deg)';
    els.coinStatus.textContent = mode === 'manual'
      ? 'PILE OU FACE — Prêts à tenter le sort ?'
      : 'LE JETON DU MASQUE — Pile : esquive réussie. Face : esquive ratée.';
    els.coinStart.textContent = 'LANCER LE JETON';
    els.coinStart.classList.remove('hidden');
    els.coinDone.classList.add('hidden');
    // Sur certains mobiles, deux modales 3D superposées peuvent entrer
    // en conflit de composition graphique. Masquer la scène de MASQUE-007
    // pendant le lancer reproduit le fonctionnement fiable du lancer manuel.
    if (mode === 'masque-007') {
      els.mask07Overlay.classList.add('coin-behind');
      els.mask07Overlay.setAttribute('aria-hidden', 'true');
    }
    els.coinOverlay.classList.add('show');
    els.coinOverlay.setAttribute('aria-hidden', 'false');
    els.coinStart.focus();
    syncAmbientVolume();
    return true;
  }

  function openManualCoin() {
    if (!els.effectsModal.classList.contains('show') || currentMask07
      || currentCoin || specialAudioActive) return;
    closeEffectsModal();
    pauseAudioEventClock();
    openCoin({ mode: 'manual', onDone: () => {
      openEffectsModal();
      updateAudioEventClock();
    } });
  }

  function dismissCoin() {
    const c = currentCoin;
    coinToken++;
    if (c) {
      clearTimeout(c.timeout);
      c.animation?.cancel();
      coinStopAudio(c);
    }
    currentCoin = null;
    els.coinOverlay.classList.remove('show');
    els.coinOverlay.setAttribute('aria-hidden', 'true');
    els.mask07Overlay.classList.remove('coin-behind');
    if (currentMask07) els.mask07Overlay.setAttribute('aria-hidden', 'false');
    els.coinStart.classList.add('hidden');
    els.coinDone.classList.add('hidden');
    els.coinDisc.style.transform = 'rotateY(0deg)';
  }

  function revealCoin() {
    const c = currentCoin;
    if (!c || c.revealed || !c.outcome) return;
    clearTimeout(c.timeout);
    c.timeout = null;
    c.animation?.cancel();
    c.animation = null;
    const playVerdict = c.spinning && document.visibilityState === 'visible';
    c.spinning = false;
    c.revealed = true;
    if (playVerdict) coinPlayVerdict();
    els.coinDisc.style.transform = 'rotateY(' + coinFaceAngle(c.outcome) + 'deg)';
    els.coinStatus.textContent = c.outcome === 'success'
      ? 'PILE ! — ESQUIVE RÉUSSIE.' : 'FACE ! — ESQUIVE RATÉE.';
    if (c.mode === 'manual') {
      els.coinStatus.textContent = c.outcome === 'success'
        ? 'PILE !' : 'FACE !';
    }
    els.coinStart.classList.add('hidden');
    els.coinDone.textContent = c.mode === 'manual'
      ? 'RETOURNER AUX EFFETS' : 'CONTINUER';
    els.coinDone.classList.remove('hidden');
    els.coinDone.focus();
  }

  function flipCoin() {
    const c = currentCoin;
    if (!c || c.spinning || c.revealed) return;
    if (!c.outcome) c.outcome = drawCoinOutcome();
    if (c.mode === 'masque-007' && currentMask07) {
      currentMask07.coinOutcome = c.outcome;
      currentMask07.stage = 'coin-spinning';
      saveMask07Stage();
    }
    c.spinning = true;
    els.coinStart.classList.add('hidden');
    els.coinStatus.textContent = 'Le hasard décide…';
    const token = c.token;
    const show = () => {
      if (currentCoin?.token === token) revealCoin();
    };
    const reducedMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      show();
      return;
    }
    const endRotation = 360 * 7 + coinFaceAngle(c.outcome);
    if (typeof els.coinDisc.animate === 'function') {
      try {
        c.animation = els.coinDisc.animate([
          { transform: 'rotateY(0deg)' },
          { transform: 'rotateY(' + endRotation + 'deg)' }
        ], {
          duration: COIN_SPIN_MS,
          easing: COIN_SPIN_EASING,
          fill: 'forwards'
        });
        coinScheduleSound(c, endRotation);
        c.animation.finished.then(show).catch(() => {});
      } catch (_) { c.animation = null; c.timeout = setTimeout(show, 3500); }
    } else {
      // Les navigateurs anciens voient le même résultat, sans moteur 3D.
      c.timeout = setTimeout(show, 850);
    }
  }

  function completeCoin() {
    const c = currentCoin;
    if (!c || !c.revealed) return;
    const callback = c.onDone, outcome = c.outcome;
    dismissCoin();
    if (typeof callback === 'function') callback(outcome);
  }

  function handleCoinVisibility() {
    // En arrière-plan, on révèle immédiatement le résultat DÉJÀ tiré.
    const c = currentCoin;
    if (c && c.spinning && document.visibilityState === 'hidden') {
      coinStopAudio(c);
      revealCoin();
    }
  }

  function coinOnPageHide() {
    // Un rechargement de MASQUE-007 restaure l'issue sauvegardée.
    if (currentCoin?.spinning) {
      coinStopAudio(currentCoin);
      revealCoin();
    }
  }


  // =========================================================
  // MASQUE-007 — UNE PREUVE D'AMITIÉ
  // 12 fichiers audio + désignations, jeton commun, effets notés à la main.
  // Le Companion ne stocke ni PV ni inventaire. Mort : statut du joueur.
  // =========================================================

  const MASK07_AUDIO_STAGES = [
    'intro', 'aggressor-before', 'aggressor-number', 'aggressor-after',
    'victim-before', 'victim-number', 'victim-after', 'revelation', 'coin-intro'
  ];

  function mask07AudioPath(r) {
    if (!r) return null;
    const base = r.item.audioRoot;
    const names = {
      'intro': 'intro',
      'aggressor-before': 'agresseur-avant',
      'aggressor-after': 'agresseur-apres',
      'victim-before': 'victime-avant',
      'victim-after': 'victime-apres',
      'revelation': 'revelation',
      'coin-intro': 'jeton',
      'success-audio': 'esquive-reussie',
      'injury-audio': 'esquive-ratee-blessure',
      'danger-audio': 'danger-mortel',
      'sacrifice-audio': 'sacrifice-accepte',
      'death-audio': 'sacrifice-refuse'
    };
    if (r.stage === 'aggressor-number') {
      return playerDesignationClips(r.aggressor)[r.designationPart || 0];
    }
    if (r.stage === 'victim-number') {
      return playerDesignationClips(r.victim)[r.designationPart || 0];
    }
    return names[r.stage] ? base + names[r.stage] + '.mp3' : null;
  }

  function saveMask07Stage() {
    const r = currentMask07;
    if (!r || r.preview) return;
    eventSession.pendingMask007 = {
      id: 'masque-007', stage: r.stage, aggressor: r.aggressor,
      victim: r.victim, coinOutcome: r.coinOutcome,
      penalty: r.penalty, deathApplied: r.deathApplied === true
    };
    saveAudioEventSession();
  }

  function mask07StopAudio(r) {
    if (!r?.audio) return;
    r.audio.pause();
    r.audio.onended = null;
    r.audio.onerror = null;
    r.audio = null;
  }

  function dismissMask07() {
    mask07Token++;
    const r = currentMask07;
    mask07StopAudio(r);
    currentMask07 = null;
    if (currentCoin?.mode === 'masque-007') dismissCoin();
    els.mask07Overlay.classList.remove('show', 'is-result', 'is-choice');
    els.mask07Overlay.setAttribute('aria-hidden', 'true');
    specialAudioActive = false;
    syncAmbientVolume();
    renderEventControls();
  }

  function mask07SetStage(stage) {
    const r = currentMask07;
    if (!r) return;
    mask07StopAudio(r);
    r.stage = stage;
    r.designationPart = 0;
    r.audioBroken = false;
    saveMask07Stage();
    mask07Render();
    if (mask07AudioPath(r)) mask07PlayAudio();
  }

  function mask07Render() {
    const r = currentMask07;
    if (!r) return;
    const stage = r.stage;
    els.mask07Overlay.classList.add('show');
    els.mask07Overlay.classList.toggle('is-result', stage === 'outcome');
    els.mask07Overlay.classList.toggle('is-choice', [
      'coin-ready','hp-choice','sacrifice-choice','death-confirm'
    ].includes(stage));
    els.mask07Overlay.setAttribute('aria-hidden', 'false');
    els.mask07Portrait.src = getMaskState(state.value).src;
    els.mask07Pair.textContent =
      playerLabel(r.aggressor).toLocaleUpperCase('fr-FR') + ' — OFFRE  •  ' + playerLabel(r.victim).toLocaleUpperCase('fr-FR') + ' — REÇOIT';
    els.mask07Pair.classList.toggle('hidden', [
      'intro','aggressor-before','aggressor-number','aggressor-after',
      'victim-before','victim-number'
    ].includes(stage));
    for (const id of ['mask07Primary','mask07Secondary','mask07Confirm',
      'mask07Play','mask07Skip']) {
      els[id].classList.add('hidden');
    }
    els.mask07Detail.classList.add('hidden');
    els.mask07Detail.textContent = '';

    if (mask07AudioPath(r)) {
      els.mask07Status.textContent = stage === 'intro'
        ? 'Le Masque vous prépare une épreuve d’amitié…'
        : stage === 'revelation'
          ? 'Le Masque révèle son petit jeu…'
          : stage === 'coin-intro'
            ? 'Le Masque présente son jeton…'
            : ['success-audio','injury-audio','danger-audio',
               'sacrifice-audio','death-audio'].includes(stage)
              ? 'Le Masque rend son verdict…'
              : 'Le Masque désigne ses deux heureux élus…';
      return;
    }
    function button(id,label) {
      els[id].textContent = label;
      els[id].classList.remove('hidden');
    }
    const showDetail = text => {
      els.mask07Detail.textContent = text;
      els.mask07Detail.classList.remove('hidden');
    };

    if (stage === 'coin-ready') {
      els.mask07Status.textContent = 'La victime doit tenter d’esquiver !';
      showDetail('PILE : esquive réussie. FACE : esquive ratée.\nChaque issue a une chance sur deux.');
      button('mask07Primary','🪙 LANCER LE JETON DU MASQUE');
    } else if (stage === 'coin-spinning' || stage === 'coin-reveal') {
      els.mask07Status.textContent = 'Le hasard a choisi…';
      showDetail('Le résultat du jeton est conservé, même après actualisation.');
    } else if (stage === 'hp-choice') {
      els.mask07Status.textContent = 'ESQUIVE RATÉE !';
      showDetail(playerLabel(r.victim).toLocaleUpperCase('fr-FR') + ', combien de PV te reste-t-il AVANT le coup ?\nLe Companion ne connaît pas tes PV.');
      button('mask07Primary','2 PV OU PLUS — PERDRE 1 PV');
      button('mask07Secondary','1 PV — COUP POTENTIELLEMENT MORTEL');
    } else if (stage === 'sacrifice-choice') {
      els.mask07Status.textContent = 'LA VIE CONTRE UN OBJET';
      showDetail(playerLabel(r.victim).toLocaleUpperCase('fr-FR') +
        ', pour conserver ton dernier PV, défausse un objet de ton sac à dos. ' +
        'Si ton sac est vide, sacrifie une arme ou une armure équipée.\n' +
        'Sans sacrifice, le coup est mortel.');
      button('mask07Primary','J’AI DÉFAUSSÉ UN OBJET — JE SURVIS');
      button('mask07Secondary','AUCUN OBJET / JE REFUSE — RISQUE DE MORT');
    } else if (stage === 'death-confirm') {
      els.mask07Status.textContent = 'CONFIRMER LA MORT DU SURVIVANT';
      showDetail('Attention : ' + playerLabel(r.victim).toLocaleUpperCase('fr-FR') + ' va mourir. ' +
        'Le Companion le marquera comme MORT dans la liste des joueurs.\n' +
        'Confirmez uniquement si aucun objet n’est sacrifié.');
      button('mask07Confirm','CONFIRMER : ' + playerLabel(r.victim).toLocaleUpperCase('fr-FR') + ' MEURT');
      button('mask07Secondary','REVENIR AU SACRIFICE');
    } else if (stage === 'outcome') {
      els.mask07Status.textContent = 'ÉPREUVE TERMINÉE';
      let result = '';
      if (r.coinOutcome === 'success') {
        result = 'PILE — ESQUIVE RÉUSSIE.';
      } else if (r.penalty === 'injury') {
        result = 'FACE — ESQUIVE RATÉE.\n\n' + playerLabel(r.victim).toLocaleUpperCase('fr-FR')
          + ' perd 1 PV.\nReportez cette blessure sur sa feuille de personnage.';
      } else if (r.penalty === 'sacrifice') {
        result = 'FACE — ESQUIVE RATÉE.\n\n' + playerLabel(r.victim).toLocaleUpperCase('fr-FR')
          + ' conserve son dernier PV en sacrifiant un objet.\n'
          + 'L’objet doit avoir été défaussé sur le plateau.';
      } else if (r.penalty === 'death') {
        result = 'FACE — ESQUIVE RATÉE.\n\nAucun objet sacrifié : '
          + playerLabel(r.victim).toLocaleUpperCase('fr-FR') + ' meurt.\nMettez sa feuille de personnage à jour.';
      }
      showDetail(result);
      button('mask07Primary','CONTINUER LA PARTIE');
    }
  }

  function mask07AudioFallback(broken = false) {
    const r = currentMask07;
    if (!r || !mask07AudioPath(r)) return;
    r.audioBroken = broken;
    els.mask07Status.textContent = broken
      ? 'Enregistrement indisponible. Réessayez ou continuez sans cet audio.'
      : 'Intervention suspendue. Touchez pour reprendre.';
    els.mask07Play.textContent = broken
      ? 'RÉESSAYER L’ENREGISTREMENT' : 'REPRENDRE L’AUDIO';
    els.mask07Play.classList.remove('hidden');
    els.mask07Skip.classList.toggle('hidden', !broken);
  }

  function mask07PlayAudio() {
    const r = currentMask07;
    if (!r || !mask07AudioPath(r)) return;
    if (document.visibilityState !== 'visible') {
      mask07AudioFallback(false);
      return;
    }
    if (!r.audio) {
      r.audio = new Audio(mask07AudioPath(r));
      r.audio.preload = 'auto';
      r.audio.volume = 1;
    }
    const audio = r.audio, stage = r.stage, token = r.token;
    audio.onended = () => {
      if (currentMask07?.token === token && r.stage === stage && r.audio === audio) {
        mask07NextAudio();
      }
    };
    audio.onerror = () => {
      if (currentMask07?.token === token && r.stage === stage && r.audio === audio) {
        mask07AudioFallback(true);
      }
    };
    r.audioBroken = false;
    els.mask07Play.classList.add('hidden');
    els.mask07Skip.classList.add('hidden');
    try {
      audio.play().catch(() => {
        if (currentMask07?.token === token && r.stage === stage) {
          mask07AudioFallback(false);
        }
      });
    } catch (_) { mask07AudioFallback(false); }
  }

  function mask07ResumeAudio() {
    const r = currentMask07;
    if (!r || document.visibilityState !== 'visible') return;
    if (r.audioBroken) mask07StopAudio(r);
    mask07PlayAudio();
  }

  function mask07SkipAudio() {
    const r = currentMask07;
    if (r?.audioBroken && mask07AudioPath(r)) mask07NextAudio();
  }

  function mask07NextAudio() {
    const r = currentMask07;
    if (!r) return;
    if (r.stage === 'aggressor-number' || r.stage === 'victim-number') {
      const player = r.stage === 'aggressor-number' ? r.aggressor : r.victim;
      const next = (r.designationPart || 0) + 1;
      if (next < playerDesignationClips(player).length) {
        mask07StopAudio(r);
        r.designationPart = next;
        mask07PlayAudio();
        return;
      }
    }
    const index = MASK07_AUDIO_STAGES.indexOf(r.stage);
    if (index >= 0 && index < MASK07_AUDIO_STAGES.length - 1) {
      mask07SetStage(MASK07_AUDIO_STAGES[index + 1]);
    } else if (r.stage === 'coin-intro') {
      mask07SetStage('coin-ready');
    } else if (r.stage === 'danger-audio') {
      mask07SetStage('sacrifice-choice');
    } else if (['success-audio','injury-audio',
      'sacrifice-audio','death-audio'].includes(r.stage)) {
      mask07SetStage('outcome');
    }
  }

  function mask07AfterCoin(outcome) {
    const r = currentMask07;
    if (!r || !['coin-spinning','coin-reveal'].includes(r.stage)
      || r.coinOutcome !== outcome) return;
    mask07SetStage(outcome === 'success' ? 'success-audio' : 'hp-choice');
  }

  function mask07OpenSavedCoin() {
    const r = currentMask07;
    if (!r || !r.coinOutcome || !['coin-spinning','coin-reveal'].includes(r.stage)) return;
    // Au rechargement, ne jamais relancer le hasard : montrer le tirage mémorisé.
    r.stage = 'coin-reveal';
    saveMask07Stage();
    openCoin({mode:'masque-007',outcome:r.coinOutcome,onDone:mask07AfterCoin});
    revealCoin();
  }

  function mask07Choose(action) {
    const r = currentMask07;
    if (!r) return;
    if (r.stage === 'coin-ready' && action === 'primary') {
      const outcome = drawCoinOutcome();
      r.coinOutcome = outcome;
      // Résultat sauvegardé avant le mouvement, aussi en cas de F5.
      mask07SetStage('coin-spinning');
      if (openCoin({mode:'masque-007',outcome,onDone:mask07AfterCoin})) {
        // Contrairement au lancer manuel, cette fenêtre s'ouvre et se lance
        // automatiquement. Laisser deux images au navigateur pour afficher
        // ses faces AVANT de démarrer la transformation 3D (Android/WebView).
        const coinId = currentCoin?.token;
        const launch = () => {
          if (currentCoin?.token === coinId && currentMask07 === r
            && r.stage === 'coin-spinning') flipCoin();
        };
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => requestAnimationFrame(launch));
        } else {
          setTimeout(launch, 40);
        }
      }
    } else if (r.stage === 'hp-choice') {
      if (action === 'primary') {
        r.penalty = 'injury';
        mask07SetStage('injury-audio');
      } else if (action === 'secondary') mask07SetStage('danger-audio');
    } else if (r.stage === 'sacrifice-choice') {
      if (action === 'primary') {
        r.penalty = 'sacrifice';
        mask07SetStage('sacrifice-audio');
      } else if (action === 'secondary') mask07SetStage('death-confirm');
    } else if (r.stage === 'death-confirm') {
      if (action === 'secondary') {
        mask07SetStage('sacrifice-choice');
      } else if (action === 'confirm') {
        // Le personnage doit toujours être reporté mort sur sa feuille.
        // Sa mort est synchronisée avec la liste des survivants de l'application.
        r.penalty = 'death';
        r.deathApplied = true;
        eventSession.alive[r.victim - 1] = false;
        mask07SetStage('death-audio');
        // Persist even in ?test-events=1: the test must apply real consequences.
        saveAudioEventSession();
        renderPlayerStatuses();
        renderEventControls();
      }
    } else if (r.stage === 'outcome' && action === 'primary') {
      completeMask07();
    }
  }

  function completeMask07() {
    const r = currentMask07;
    if (!r || r.stage !== 'outcome') return;
    const delay = r.preview ? r.savedPreviewDelay : randomAudioDelay();
    dismissMask07();
    if (!r.preview) eventSession.pendingMask007 = null;
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();
    if (state.musicOn) syncMusicForActiveTab();
  }

  function handleMask07Visibility() {
    const r = currentMask07;
    if (r?.audio && document.visibilityState === 'hidden' && !r.audio.paused) {
      r.audio.pause();
      mask07AudioFallback(false);
    }
  }

  function mask07OnPageHide() {
    if (currentMask07?.audio) currentMask07.audio.pause();
  }

  function beginMask07(item, preview, restoring = false) {
    const pending = restoring ? eventSession.pendingMask007 : null;
    if (item?.id !== 'masque-007' || !eventSession.active
      || currentMaskEvent || currentMask05 || currentMask06 || currentMask07
      || currentCoin || currentRadioEvent || currentRadio02 || currentRadio03
      || currentWeatherEvent || specialAudioActive || anyBlockingModalOpen()
      || !isPartieTabActive() || document.visibilityState !== 'visible'
      || state.value >= 100 || (restoring && !pending)) return false;

    const pool = livingPlayerNumbers();
    if (!restoring && pool.length < 2) return false;
    const aggressor = restoring ? pending.aggressor
      : pool[randomBetween(0, pool.length - 1)];
    const remaining = pool.filter(n => n !== aggressor);
    const victim = restoring ? pending.victim
      : remaining[randomBetween(0, remaining.length - 1)];
    if (victim === aggressor) return false;

    pauseAudioEventClock();
    currentMask07 = {
      token: ++mask07Token, item, preview, aggressor, victim,
      savedPreviewDelay: eventSession.remainingMs,
      stage: restoring ? pending.stage : 'intro',
      coinOutcome: pending?.coinOutcome || null,
      penalty: pending?.penalty || null,
      deathApplied: pending?.deathApplied === true,
      audio: null, audioBroken: false
    };
    if (!preview && !restoring) {
      eventSession.played.push(item.id);
      eventSession.remainingMs = null;
    }
    saveMask07Stage();
    specialAudioActive = true;
    silenceHauntSounds();
    syncAmbientVolume();
    renderEventControls();
    mask07Render();
    if (['coin-spinning','coin-reveal'].includes(currentMask07.stage)) {
      mask07OpenSavedCoin();
    } else if (mask07AudioPath(currentMask07)) {
      mask07PlayAudio();
    }
    return true;
  }

  function resumePendingMask07IfPossible() {
    const pending = eventSession.pendingMask007;
    if (!pending || !eventSession.active || gameOverShown
      || document.visibilityState !== 'visible' || state.value >= 100) return false;
    const item = AUDIO_EVENTS.find(entry => entry.id === pending.id);
    if (!item) {
      eventSession.pendingMask007 = null;
      saveAudioEventSession();
      return false;
    }
    return beginMask07(item, false, true);
  }

  // =========================================================
  // MASQUE-006 : LA COMPTINE DES OUBLIÉS
  // Introduction → comptine → question → OUI/NON → réaction → +5 global.
  // La jauge est réellement modifiée en partie comme en mode test.
  // =========================================================

  function saveMask06Stage() {
    const r = currentMask06;
    if (!r || r.preview) return;
    eventSession.pendingMask006 = {
      id: 'masque-006', stage: r.stage, choice: r.choice,
      before: r.before, after: r.after, gameOver: r.gameOver === true
    };
    saveAudioEventSession();
  }

  function mask06HideControls() {
    for (const id of ['mask06Choices', 'mask06Result', 'mask06Play',
      'mask06Skip', 'mask06Done']) {
      els[id].classList.add('hidden');
    }
  }

  function mask06StopAudio(r) {
    if (!r?.audio) return;
    r.audio.pause();
    r.audio.onended = null;
    r.audio.onerror = null;
    r.audio = null;
  }

  function dismissMask06() {
    mask06Token += 1;
    const r = currentMask06;
    mask06StopAudio(r);
    currentMask06 = null;
    els.mask06Overlay.classList.remove('show', 'is-choice', 'is-result', 'is-singing');
    els.mask06Overlay.setAttribute('aria-hidden', 'true');
    mask06HideControls();
    specialAudioActive = false;
    syncAmbientVolume();
    renderEventControls();
  }

  function mask06ShowOverlay() {
    const r = currentMask06;
    if (!r) return;
    els.mask06Portrait.src = getMaskState(state.value).src;
    els.mask06Overlay.classList.add('show');
    els.mask06Overlay.classList.toggle('is-choice', r.stage === 'choices');
    els.mask06Overlay.classList.toggle('is-result', r.stage === 'result');
    els.mask06Overlay.classList.toggle('is-singing', r.stage === 'song');
    els.mask06Overlay.setAttribute('aria-hidden', 'false');
    mask06HideControls();
    specialAudioActive = true;
    syncAmbientVolume();
  }

  function mask06AudioPath(r) {
    return r.stage === 'intro' ? r.item.introAudio
      : r.stage === 'song' ? r.item.songAudio
      : r.stage === 'question' ? r.item.questionAudio
      : r.stage === 'reaction'
        ? (r.choice === 'yes' ? r.item.yesAudio : r.item.noAudio)
        : null;
  }

  function mask06AudioFallback(broken = false) {
    const r = currentMask06;
    if (!r || !['intro', 'song', 'question', 'reaction'].includes(r.stage)) return;
    r.audioBroken = broken;
    els.mask06Status.textContent = broken
      ? 'Enregistrement indisponible. Réessayez ou continuez sans cet audio.'
      : 'Lecture suspendue. Touchez pour reprendre.';
    els.mask06Play.textContent = broken
      ? 'RÉESSAYER L’ENREGISTREMENT' : 'REPRENDRE L’AUDIO';
    els.mask06Play.classList.remove('hidden');
    els.mask06Skip.classList.toggle('hidden', !broken);
  }

  function mask06PlayStage() {
    const r = currentMask06;
    if (!r) return;
    if (document.visibilityState !== 'visible') {
      // Ne pas rester bloqué si un segment se termine au moment où
      // Android place l'application en arrière-plan.
      mask06AudioFallback(false);
      return;
    }
    const stage = r.stage, url = mask06AudioPath(r);
    if (!url) return;
    if (!r.audio) {
      r.audio = new Audio(url);
      r.audio.preload = 'auto';
      r.audio.volume = 1;
    }
    const audio = r.audio, token = r.token;
    audio.onended = () => {
      if (currentMask06?.token === token && r.stage === stage && r.audio === audio) {
        mask06Advance();
      }
    };
    audio.onerror = () => {
      if (currentMask06?.token === token && r.stage === stage && r.audio === audio) {
        mask06AudioFallback(true);
      }
    };
    r.audioBroken = false;
    els.mask06Status.textContent = stage === 'intro'
      ? 'Le Masque a une surprise à vous présenter…'
      : stage === 'song' ? 'Le Masque interprète son chef-d’œuvre…'
      : stage === 'question' ? 'Le Masque attend votre avis…'
      : 'Le Masque réagit à votre réponse…';
    els.mask06Play.classList.add('hidden');
    els.mask06Skip.classList.add('hidden');
    els.mask06Overlay.classList.toggle('is-singing', stage === 'song');
    try {
      audio.play().catch(() => {
        if (currentMask06?.token === token && r.stage === stage) {
          mask06AudioFallback(false);
        }
      });
    } catch (_) {
      mask06AudioFallback(false);
    }
  }

  function mask06SetStage(stage) {
    const r = currentMask06;
    if (!r) return;
    mask06StopAudio(r);
    r.stage = stage;
    r.audioBroken = false;
    saveMask06Stage();
    mask06ShowOverlay();
  }

  function mask06Advance() {
    const r = currentMask06;
    if (!r) return;
    if (r.stage === 'intro') {
      mask06SetStage('song');
      mask06PlayStage();
    } else if (r.stage === 'song') {
      mask06SetStage('question');
      mask06PlayStage();
    } else if (r.stage === 'question') {
      mask06SetStage('choices');
      mask06ShowChoices();
    } else if (r.stage === 'reaction') {
      mask06Finalize();
    }
  }

  function skipMask06BrokenAudio() {
    const r = currentMask06;
    if (!r || !r.audioBroken) return;
    mask06Advance();
  }

  function mask06ShowChoices() {
    const r = currentMask06;
    if (!r || r.stage !== 'choices') return;
    mask06ShowOverlay();
    els.mask06Status.textContent = 'ALOOOORS ?! Vous avez aimé ma chanson ?';
    els.mask06Choices.classList.remove('hidden');
    els.mask06Yes.focus();
  }

  function chooseMask06(choice) {
    const r = currentMask06;
    if (!r || r.stage !== 'choices' || !['yes','no'].includes(choice)) return;
    r.choice = choice;
    mask06SetStage('reaction');
    mask06PlayStage();
  }

  function mask06Finalize() {
    const r = currentMask06;
    if (!r || r.stage !== 'reaction' || !['yes','no'].includes(r.choice)) return;
    r.before = state.value;
    r.after = clamp(r.before + 5, 0, 100);
    r.gameOver = r.after >= 100;

    // La conséquence prévue est enregistrée AVANT de modifier l'Instabilité.
    // Une restauration après F5 peut ainsi appliquer l'effet au maximum une fois.
    mask06SetStage('result');
    if (r.after !== r.before) {
      const effect = applyInstabilityDelta(5, {
        source: 'Le Masque — La Comptine des oubliés (' + (r.choice === 'yes' ? 'oui' : 'non') + ')',
        deferThreshold: true,
        deferGameOver: true
      });
      r.after = state.value;
      r.gameOver = effect.gameOver;
      saveMask06Stage();
    }
    mask06ShowResult();
  }

  function mask06ShowResult() {
    const r = currentMask06;
    if (!r || r.stage !== 'result') return;
    mask06StopAudio(r);
    mask06ShowOverlay();
    els.mask06Status.textContent = 'Le Masque a rendu sa sentence.';
    const actual = Number.isFinite(r.before) && Number.isFinite(r.after)
      ? r.after - r.before : 0;
    els.mask06Result.textContent =
      (r.choice === 'yes' ? 'VOUS AVEZ RÉPONDU OUI.' : 'VOUS AVEZ RÉPONDU NON.') +
      '\n\nLe Masque n’a pas accepté votre réponse.\n\n' +
      'Instabilité globale du groupe : ' + r.before + ' % → ' + r.after +
      ' % (+' + actual + ' points).' +
      (r.gameOver
        ? '\n\nLe seuil de 100 % est atteint : la fin de partie sera déclenchée après cette fenêtre.'
        : '');
    els.mask06Result.classList.remove('hidden');
    els.mask06Done.classList.remove('hidden');
    els.mask06Done.focus();
  }

  function completeMask06() {
    const r = currentMask06;
    if (!r || r.stage !== 'result') return;
    const delay = r.preview ? r.savedPreviewDelay : randomAudioDelay();
    const transition = Number.isFinite(r.before) && Number.isFinite(r.after)
      && r.before !== r.after ? [r.before, r.after] : null;
    const over = r.gameOver;
    dismissMask06();
    if (!r.preview) eventSession.pendingMask006 = null;
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();

    if (transition || over) {
      clearTimeout(mask06DeferredOutcomeTimer);
      mask06DeferredOutcomeTimer = setTimeout(() => {
        mask06DeferredOutcomeTimer = null;
        if (over) checkGameOver();
        else if (transition && state.value === transition[1]) {
          handleThresholdTransition(transition[0], transition[1]);
        }
      }, REDUCED_MOTION ? 0 : 790);
    }
  }

  function resumeMask06Audio() {
    const r = currentMask06;
    if (!r || document.visibilityState !== 'visible') return;
    if (r.audioBroken) {
      mask06StopAudio(r);
      r.audioBroken = false;
    }
    mask06PlayStage();
  }

  function handleMask06Visibility() {
    const r = currentMask06;
    if (!r || document.visibilityState !== 'hidden') return;
    if (r.audio && !r.audio.paused) {
      r.audio.pause();
      mask06AudioFallback(false);
    }
  }

  function mask06OnPageHide() {
    const r = currentMask06;
    if (r?.audio) r.audio.pause();
  }

  function beginMask06(item, preview, restoring = false) {
    const pending = restoring ? eventSession.pendingMask006 : null;
    if (item?.id !== 'masque-006' || !eventSession.active
      || currentMaskEvent || currentMask05 || currentMask06 || currentRadioEvent
      || currentRadio02 || currentRadio03 || currentWeatherEvent
      || specialAudioActive || anyBlockingModalOpen()
      || !isPartieTabActive() || document.visibilityState !== 'visible'
      || (state.value >= 100 && !(restoring && pending?.stage === 'result'))
      || (!restoring && livingPlayerNumbers().length === 0)
      || (restoring && !pending)) return false;

    pauseAudioEventClock();
    const r = {
      token: ++mask06Token, item, preview,
      savedPreviewDelay: eventSession.remainingMs,
      stage: pending?.stage || 'intro',
      choice: pending?.choice || null,
      before: pending?.before ?? null,
      after: pending?.after ?? null,
      gameOver: pending?.gameOver === true,
      audio: null, audioBroken: false
    };
    currentMask06 = r;
    if (!preview && !restoring) {
      eventSession.played.push(item.id);
      eventSession.remainingMs = null;
    }
    saveMask06Stage();
    mask06ShowOverlay();
    silenceHauntSounds();
    renderEventControls();

    if (r.stage === 'choices') {
      mask06ShowChoices();
    } else if (r.stage === 'result') {
      // Cas rare : F5 entre l'écriture du résultat et l'application des +5.
      if (!preview && Number.isFinite(r.before) && Number.isFinite(r.after)
        && state.value === r.before && r.after > r.before) {
        applyInstabilityDelta(r.after - r.before, {
          source: 'Le Masque — La Comptine des oubliés (reprise)',
          deferThreshold: true, deferGameOver: true
        });
        saveMask06Stage();
      }
      mask06ShowResult();
    } else {
      mask06PlayStage();
    }
    return true;
  }

  function resumePendingMask06IfPossible() {
    const pending = eventSession.pendingMask006;
    if (!pending || !eventSession.active || gameOverShown
      || document.visibilityState !== 'visible'
      || (state.value >= 100 && pending.stage !== 'result')) return false;
    const item = AUDIO_EVENTS.find(entry => entry.id === pending.id);
    if (!item) {
      eventSession.pendingMask006 = null;
      saveAudioEventSession();
      return false;
    }
    return beginMask06(item, false, true);
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
    els.maskDuelPlayer1.textContent = playerLabel(running.player).toLocaleUpperCase('fr-FR');
    els.maskDuelPlayer2.textContent = playerLabel(running.opponent).toLocaleUpperCase('fr-FR');
    els.maskDuelHelp.textContent = livingPlayerNumbers().length > 2
      ? 'Confiez le téléphone à un témoin. Le premier à détourner les yeux perd.'
      : 'Confiez le téléphone à un témoin disponible. Sinon, confirmez honnêtement le résultat après le duel.';
    els.maskDuelLoss1.textContent = playerLabel(running.player).toLocaleUpperCase('fr-FR') + ' A DÉTOURNÉ LE REGARD';
    els.maskDuelLoss2.textContent = playerLabel(running.opponent).toLocaleUpperCase('fr-FR') + ' A DÉTOURNÉ LE REGARD';
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
        'Les joueurs ' + playerLabel(running.player) + ' et ' + playerLabel(running.opponent)
        + ' ont tenu 30 secondes.\n\n'
        + 'Chacun pioche 1 carte Objet (2 cartes au total).';
    } else {
      const loser = running.duelOutcome === 'first' ? running.player : running.opponent;
      els.maskEventEffect.textContent =
        playerLabel(loser) + ' a détourné le regard.\n\n'
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
      ? (running.introStage === 'presentation'
          ? 'Le Masque vous accueille…'
          : running.introStage === 'request'
            ? 'Le Masque vous invite à vous présenter…'
            : 'Le Masque commente vos présentations…')
      : segment === 0
        ? 'Le Masque choisit sa victime…'
        : 'Le Masque dicte sa loi…';

    audio.onended = () => {
      if (!currentMaskEvent || currentMaskEvent.token !== token) return;
      running.activeAudio = null;
      if (running.intro) {
        advanceMaskIntroduction();
      } else if (segment < running.audios.length - 1) {
        eventAudioGapTimer = setTimeout(() => {
          eventAudioGapTimer = null;
          playMaskEventSegment(segment + 1, token);
        }, segment < running.designationClipCount ? 220 : 320);
      } else if (running.item.id === 'masque-004') {
        showMaskDuelReady(token);
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
      } else if (segment < running.designationClipCount) {
        // Les clips de désignation peuvent être optionnels ; poursuivre
        // vers le prénom ou le récit sans bloquer le groupe.
        if (segment < running.audios.length - 1) {
          playMaskEventSegment(segment + 1, token);
        } else if (running.item.id === 'masque-004') {
          showMaskDuelReady(token);
        } else {
          showMaskEventResult(token, true);
        }
      } else if (running.item.id === 'masque-004') {
        // Même si le récit ou le gong ne charge pas, le duel reste jouable.
        if (segment < running.audios.length - 1) {
          playMaskEventSegment(segment + 1, token);
        } else {
          showMaskDuelReady(token);
        }
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
        ? (running.introStage === 'presentation'
            ? 'Le Masque vous accueille…'
            : running.introStage === 'request'
              ? 'Le Masque vous invite à vous présenter…'
              : 'Le Masque commente vos présentations…')
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
      : randomAudioDelay();
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
    if (currentWeatherEvent?.isWeather04) weather04Visibility();
    if (currentWeatherEvent && !currentWeatherEvent.isWeather04
      && document.visibilityState === 'hidden'
      && currentWeatherEvent.audio && !currentWeatherEvent.audio.paused) {
      currentWeatherEvent.audio.pause();
      showWeatherAudioFallback('Narration suspendue. Touchez pour reprendre.');
    }
    handleRadio02Visibility();
    handleRadio03Visibility();
    handleRadio04Visibility();
    handleRadio05Visibility();
    handleMask05Visibility();
    handleMask06Visibility();
    handleMask07Visibility();
    handleCoinVisibility();
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
    if (item?.id === 'radio-002') return beginRadio02(item, preview);
    if (item?.id === 'radio-003') return beginRadio03(item, preview);
    if (item?.id === 'radio-004') return beginRadio04(item, preview);
    if (item?.id === 'radio-005') return beginRadio05(item, preview);
    if (!item || item.type !== 'radio' || !eventSession.active
      || currentMask05 || currentMaskEvent || currentRadioEvent || currentRadio02 || currentWeatherEvent
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
      : randomAudioDelay();
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
        + playerLabel(recipients[0]).toLocaleUpperCase('fr-FR') + ' et ' + playerLabel(recipients[1]).toLocaleUpperCase('fr-FR')
        + ' : piochez chacun UNE carte Objet.\n\n'
        + 'Les deux bénéficiaires ont été tirés au hasard.'
      : recipients.length === 1
        ? 'Le local est vide… mais le matériel est toujours là.\n\n'
          + playerLabel(recipients[0]).toLocaleUpperCase('fr-FR') + ' : pioche UNE carte Objet.'
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


  // RADIO 002 : rapport prémonitoire, choix chronométré et effets différés.
  function dismissRadio02() {
    radio02Token += 1;
    const r = currentRadio02;
    if (r) {
      if (r.timer !== null) clearInterval(r.timer);
      if (r.audio) {
        r.audio.pause();
        r.audio.onended = null;
        r.audio.onerror = null;
      }
    }
    currentRadio02 = null;
    els.radio02Overlay.classList.remove('show');
    els.radio02Overlay.setAttribute('aria-hidden', 'true');
    for (const id of ['radio02Choices','radio02Reward','radio02Play',
      'radio02Skip','radio02Done']) els[id].classList.add('hidden');
    specialAudioActive = false;
    syncAmbientVolume();
    renderEventControls();
  }

  function beginRadio02(item, preview, restoring = false) {
    if (item?.id !== 'radio-002' || !eventSession.active
      || currentMask05 || currentMaskEvent || currentRadioEvent || currentRadio02 || currentWeatherEvent
      || specialAudioActive || anyBlockingModalOpen()
      || document.visibilityState !== 'visible' || !isPartieTabActive()
      || (state.value >= 100 && !(restoring
        && eventSession.pendingRadio002?.stage === 'result'))) return false;
    if (restoring && !eventSession.pendingRadio002) return false;
    pauseAudioEventClock();
    const pending = restoring ? eventSession.pendingRadio002 : null;
    const stage = pending?.stage || 'intro';
    const choice = pending?.choice ?? null;
    const audioPath = stage === 'intro'
      ? item.audio : stage === 'branch' ? item.responses[choice] : null;
    const audio = audioPath ? new Audio(audioPath) : null;
    if (audio) { audio.volume = 1; audio.preload = 'auto'; }
    currentRadio02 = {
      token: ++radio02Token, item, audio, preview, choice,
      phase: stage, savedPreviewDelay: eventSession.remainingMs,
      timer: null, deadline: 0, remainingMs: 15000,
      before: pending?.before ?? null, after: pending?.after ?? null,
      deferredTransition: null, deferredGameOver: pending?.gameOver === true
    };
    if (!preview && !restoring) {
      eventSession.played.push(item.id);
      eventSession.pendingRadio002 = { id: item.id, stage: 'intro', choice: null };
      eventSession.remainingMs = null;
    }
    saveAudioEventSession();
    els.radio02Heading.textContent = 'TRANSMISSION INTERCEPTÉE';
    els.radio02Status.textContent = 'Une fréquence inconnue s’active…';
    for (const id of ['radio02Choices','radio02Reward','radio02Play',
      'radio02Skip','radio02Done']) els[id].classList.add('hidden');
    els.radio02Overlay.classList.add('show');
    els.radio02Overlay.setAttribute('aria-hidden', 'false');
    specialAudioActive = true;
    silenceHauntSounds();
    syncAmbientVolume();
    renderEventControls();

    if (stage === 'result') {
      const before = pending.before;
      const after = pending.after;
      if (Number.isFinite(before) && Number.isFinite(after)
        && state.value === before) {
        applyInstabilityDelta(after - before, {
          source: 'Radio — Le Rapport impossible',
          deferThreshold: true, deferGameOver: true
        });
      }
      currentRadio02.before = before;
      currentRadio02.after = state.value;
      currentRadio02.deferredTransition = [before, state.value];
      showRadio02Reward();
    } else if (stage === 'choices') showRadio02Choices(true);
    else playRadio02Audio();
    return true;
  }

  function showRadio02AudioFallback() {
    const r = currentRadio02;
    if (!r || !['intro','branch'].includes(r.phase)) return;
    els.radio02Status.textContent =
      'Audio interrompu. Réessayez ou poursuivez sans narration.';
    els.radio02Play.textContent = 'ÉCOUTER LA TRANSMISSION';
    els.radio02Play.classList.remove('hidden');
    els.radio02Skip.classList.remove('hidden');
  }

  function playRadio02Audio() {
    const r = currentRadio02;
    if (!r || !['intro','branch'].includes(r.phase)
      || !r.audio || document.visibilityState !== 'visible') return;
    const token = r.token, phase = r.phase;
    els.radio02Play.classList.add('hidden');
    els.radio02Skip.classList.add('hidden');
    els.radio02Status.textContent = phase === 'intro'
      ? 'Une voix cherche à joindre les survivants…'
      : 'Le rapport semblait connaître votre réponse…';
    r.audio.onended = () => {
      if (currentRadio02?.token !== token || r.phase !== phase) return;
      if (phase === 'intro') showRadio02Choices();
      else finishRadio02Branch();
    };
    r.audio.onerror = () => {
      if (currentRadio02?.token === token) showRadio02AudioFallback();
    };
    try {
      r.audio.play().catch(() => {
        if (currentRadio02?.token === token) showRadio02AudioFallback();
      });
    } catch (_) { showRadio02AudioFallback(); }
  }

  function skipRadio02Audio() {
    const r = currentRadio02;
    if (!r || !['intro','branch'].includes(r.phase)) return;
    r.audio?.pause();
    if (r.audio) { r.audio.onended = null; r.audio.onerror = null; }
    if (r.phase === 'intro') showRadio02Choices();
    else finishRadio02Branch();
  }

  function renderRadio02Countdown(r) {
    const remaining = Math.max(0, r.remainingMs);
    const seconds = Math.ceil(remaining / 1000);
    els.radio02Clock.textContent = '00:' + String(seconds).padStart(2,'0');
    els.radio02Progress.style.width = (remaining / 15000 * 100).toFixed(2) + '%';
    els.radio02Track.setAttribute('aria-valuenow', String(seconds));
  }

  function pauseRadio02Countdown() {
    const r = currentRadio02;
    if (!r || r.phase !== 'choices' || r.timer === null) return;
    r.remainingMs = Math.max(0, r.deadline - performance.now());
    clearInterval(r.timer);
    r.timer = null;
    renderRadio02Countdown(r);
  }

  function tickRadio02Countdown(token) {
    const r = currentRadio02;
    if (!r || r.token !== token || r.phase !== 'choices' || r.timer === null) return;
    r.remainingMs = Math.max(0, r.deadline - performance.now());
    renderRadio02Countdown(r);
    if (r.remainingMs === 0) chooseRadio02('silence');
  }

  function resumeRadio02Countdown() {
    const r = currentRadio02;
    if (!r || r.phase !== 'choices' || r.timer !== null
      || document.visibilityState !== 'visible') return;
    r.deadline = performance.now() + r.remainingMs;
    r.timer = setInterval(() => tickRadio02Countdown(r.token), 100);
    tickRadio02Countdown(r.token);
  }

  function showRadio02Choices(restoring = false) {
    const r = currentRadio02;
    if (!r || (!restoring && r.phase !== 'intro')) return;
    r.audio?.pause();
    r.phase = 'choices';
    r.audio = null;
    r.remainingMs = 15000;
    els.radio02Status.textContent = 'Une réponse est attendue.';
    els.radio02Play.classList.add('hidden');
    els.radio02Skip.classList.add('hidden');
    els.radio02Choices.classList.remove('hidden');
    els.radio02Answer.disabled = false;
    els.radio02Cut.disabled = false;
    renderRadio02Countdown(r);
    if (!r.preview && !restoring) {
      eventSession.pendingRadio002 = { id: r.item.id, stage: 'choices', choice: null };
      saveAudioEventSession();
    }
    resumeRadio02Countdown();
  }

  function chooseRadio02(choice) {
    const r = currentRadio02;
    if (!r || r.phase !== 'choices'
      || !['answer','cut','silence'].includes(choice)) return;
    pauseRadio02Countdown();
    r.phase = 'branch';
    r.choice = choice;
    els.radio02Choices.classList.add('hidden');
    els.radio02Status.textContent = 'La transmission reprend…';
    if (!r.preview) {
      eventSession.pendingRadio002 = { id: r.item.id, stage: 'branch', choice };
      saveAudioEventSession();
    }
    r.audio = new Audio(r.item.responses[choice]);
    r.audio.volume = 1;
    r.audio.preload = 'auto';
    playRadio02Audio();
  }

  function finishRadio02Branch() {
    const r = currentRadio02;
    if (!r || r.phase !== 'branch') return;
    r.audio?.pause();
    if (r.audio) { r.audio.onended = null; r.audio.onerror = null; }
    const before = state.value;
    const delta = r.choice === 'answer' ? 5 : r.choice === 'cut' ? -5 : 0;
    const after = Math.max(0, Math.min(100, before + delta));
    if (!r.preview) {
      eventSession.pendingRadio002 = {
        id: r.item.id, stage: 'result', choice: r.choice,
        before, after, gameOver: after >= 100
      };
      saveAudioEventSession();
    }
    if (delta) {
      const effect = applyInstabilityDelta(delta, {
        source: 'Radio — Le Rapport impossible (' + r.choice + ')',
        deferThreshold: true, deferGameOver: true
      });
      r.deferredTransition = [before, state.value];
      r.deferredGameOver = effect.gameOver;
    }
    r.before = before; r.after = state.value; r.phase = 'result';
    showRadio02Reward();
  }

  function showRadio02Reward() {
    const r = currentRadio02;
    if (!r || r.phase !== 'result') return;
    els.radio02Status.textContent = 'TRANSMISSION TERMINÉE';
    els.radio02Choices.classList.add('hidden');
    els.radio02Play.classList.add('hidden');
    els.radio02Skip.classList.add('hidden');
    const before = r.before, after = r.after;
    const actual = after - before;
    const amount = actual > 0 ? '+' + actual : String(actual);
    const nl = String.fromCharCode(10,10);
    if (r.choice === 'answer') {
      els.radio02Reward.textContent = 'Les paroles de l’opérateur continuent de vous hanter.' + nl
        + 'Instabilité mentale : ' + before + ' % → ' + after
        + ' % (' + amount + ' points).' + nl
        + 'Le groupe choisit UN joueur vivant qui pioche 1 carte Objet.';
    } else if (r.choice === 'cut') {
      els.radio02Reward.textContent =
        'Le silence revient enfin. Vous reprenez progressivement vos esprits.' + nl
        + 'Instabilité mentale : ' + before + ' % → ' + after
        + ' % (' + amount + ' points).';
    } else {
      els.radio02Reward.textContent = 'La fréquence est redevenue muette.' + nl
        + 'Le silence vous laisse avec davantage de questions que de réponses.';
    }
    els.radio02Reward.classList.remove('hidden');
    els.radio02Done.classList.remove('hidden');
    els.radio02Done.focus();
  }

  function completeRadio02() {
    const r = currentRadio02;
    if (!r || r.phase !== 'result') return;
    const delay = r.preview ? r.savedPreviewDelay : randomAudioDelay();
    const transition = r.deferredTransition;
    const over = r.deferredGameOver;
    dismissRadio02();
    if (!r.preview) eventSession.pendingRadio002 = null;
    eventSession.remainingMs = delay;
    saveAudioEventSession();
    renderEventControls();
    updateAudioEventClock();
    if (transition || over) {
      clearTimeout(radio02DeferredOutcomeTimer);
      radio02DeferredOutcomeTimer = setTimeout(() => {
        radio02DeferredOutcomeTimer = null;
        if (transition && state.value === transition[1] && !over)
          handleThresholdTransition(transition[0], transition[1]);
        if (over) checkGameOver();
      }, REDUCED_MOTION ? 0 : 650);
    }
  }

  function handleRadio02Visibility() {
    const r = currentRadio02;
    if (!r) return;
    if (document.visibilityState === 'hidden') {
      if (r.phase === 'choices') pauseRadio02Countdown();
      if (r.audio && !r.audio.paused) {
        r.audio.pause();
        showRadio02AudioFallback();
      }
    } else if (r.phase === 'choices') resumeRadio02Countdown();
  }

  function resumePendingRadio02IfPossible() {
    const pending = eventSession.pendingRadio002;
    if (!pending || !eventSession.active || gameOverShown
      || document.visibilityState !== 'visible'
      || (state.value >= 100 && pending.stage !== 'result')) return false;
    const item = AUDIO_EVENTS.find(entry => entry.id === pending.id);
    if (!item) {
      eventSession.pendingRadio002 = null;
      saveAudioEventSession();
      return false;
    }
    return beginRadio02(item, false, true);
  }


  // RADIO-003 : seule la partie "test" affiche le titre technique.
  // La séquence reste fixe, et chaque prononciation choisit un timbre (70/30).
  function radio03Save(){
    const r=currentRadio03;if(!r||r.preview)return;
    eventSession.pendingRadio003={
      id:'radio-003',stage:r.stage,sequence:r.sequence.slice(),
      target:r.target,guess:r.guess.slice(),outcome:r.outcome,
      remainingMs:r.remainingMs,deadline:r.deadline||0,
      before:r.before,after:r.after,gameOver:r.gameOver===true
    };
    saveAudioEventSession();
  }
  function radio03StopColors(r){
    if(!r)return;
    clearTimeout(r.colorTimer);r.colorTimer=null;
    if(r.colorAudio){
      r.colorAudio.onended=null;r.colorAudio.onerror=null;
      r.colorAudio.pause();r.colorAudio=null;
    }
    r.colorsStarted=false;r.colorIndex=0;
  }
  function radio03StopBackground(r){
    radio03StopColors(r);r?.ambience?.pause();
  }
  function radio03StopAudio(r){
    if(!r)return;
    if(r.gongTimer!==null&&r.gongTimer!==undefined){
      clearTimeout(r.gongTimer);r.gongTimer=null;
    }
    if(r.audio){
      r.audio.onended=null;r.audio.onerror=null;r.audio.ontimeupdate=null;
      r.audio.pause();r.audio=null;
    }
    radio03StopBackground(r);
  }
  function radio03StopTimer(r){
    if(r?.timer!==null&&r?.timer!==undefined){
      clearInterval(r.timer);r.timer=null;
    }
  }
  function dismissRadio03(){
    radio03Token++;
    const r=currentRadio03;
    if(r){radio03StopTimer(r);radio03StopAudio(r);}
    currentRadio03=null;
    els.radio03Overlay.classList.remove('show','is-speaking','is-hijacked',
      'has-mask','is-interactive');
    els.radio03MaskImage.classList.add('hidden');
    els.radio03Overlay.setAttribute('aria-hidden','true');
    for(const id of ['radio03Challenge','radio03Reward','radio03Play',
      'radio03Cancel','radio03Done'])els[id].classList.add('hidden');
    specialAudioActive=false;syncAmbientVolume();renderEventControls();
  }
  function radio03UpdatePortrait(stage){
    const hasMask=['maskintro','designation','maskepreuve','choices','reaction'].includes(stage);
    els.radio03Heading.textContent=stage==='transmission'
      ?'TRANSMISSION INTERCEPTÉE':'TRANSMISSION INTERROMPUE';
    els.radio03MaskImage.classList.toggle('hidden',!hasMask);
    els.radio03Overlay.classList.toggle('has-mask',hasMask);
    els.radio03Overlay.classList.toggle('is-interactive',stage==='choices');
    if(hasMask)els.radio03MaskImage.src=getMaskState(state.value).src;
  }
  function radio03Stage(stage){
    const r=currentRadio03;if(!r)return;
    radio03StopAudio(r);r.stage=stage;
    r.designationPart = 0;
    els.radio03Overlay.classList.toggle('is-hijacked',
      !['transmission','glitch'].includes(stage));
    radio03UpdatePortrait(stage);
    for(const id of ['radio03Challenge','radio03Reward','radio03Play',
      'radio03Cancel','radio03Done'])els[id].classList.add('hidden');
    els.radio03Overlay.classList.remove('is-speaking');
    radio03Save();
  }
  function radio03AudioBlocked(message){
    const r=currentRadio03;
    if(!r||['choices','result','cancelled'].includes(r.stage))return;
    els.radio03Overlay.classList.remove('is-speaking');
    els.radio03Status.textContent=message||'La lecture est suspendue.';
    els.radio03Play.classList.remove('hidden');
    els.radio03Play.textContent='REPRENDRE L’AUDIO';
    // Un simple blocage d'autoplay n'est pas une échappatoire à la sanction.
    els.radio03Cancel.classList.add('hidden');
  }
  function radio03ShowCancelled(){
    els.radio03Status.textContent='TRANSMISSION INTERROMPUE';
    els.radio03Reward.textContent=
      'Cette épreuve audio n’a pas pu être terminée. Aucune récompense ni pénalité.';
    els.radio03Reward.classList.remove('hidden');
    els.radio03Done.classList.remove('hidden');
  }
  function radio03CancelWithoutPenalty(){
    const r=currentRadio03;if(!r||r.stage==='result')return;
    radio03StopTimer(r);radio03Stage('cancelled');radio03ShowCancelled();
  }
  function radio03PlayColorClip(color,variation,canRetry){
    const r=currentRadio03;
    if(!r||r.stage!=='transmission'||!r.colorsStarted
      ||document.visibilityState!=='visible')return;
    const audio=new Audio('audio/events/sfx/'+color+'-'+variation+'.mp3');
    // Rehaussement important après écoute sur téléphone (0,42 était inaudible).
    // Garder une petite marge pour la version normale, la version filtrée à 100 %.
    audio.volume=variation==='telephone'?1:.95;
    audio.preload='auto';r.colorAudio=audio;
    const token=r.token;
    audio.onended=()=>{
      if(currentRadio03?.token!==token||r.colorAudio!==audio
        ||r.stage!=='transmission')return;
      r.colorAudio=null;r.colorIndex=(r.colorIndex+1)%5;
      const delay=r.colorIndex===0?RADIO03_CYCLE_GAP:RADIO03_COLOR_GAP;
      r.colorTimer=setTimeout(()=>{
        r.colorTimer=null;radio03PlayColor();
      },delay);
    };
    const fail=()=>{
      if(currentRadio03?.token!==token||r.colorAudio!==audio)return;
      audio.onended=null;audio.onerror=null;audio.pause();r.colorAudio=null;
      if(canRetry&&variation==='telephone')
        radio03PlayColorClip(color,'normal',false);
      else radio03CancelWithoutPenalty();
    };
    audio.onerror=fail;
    try{audio.play().catch(fail);}catch(_){fail();}
  }
  function radio03PlayColor(){
    const r=currentRadio03;
    if(!r||r.stage!=='transmission'||!r.colorsStarted)return;
    const color=r.sequence[r.colorIndex];
    radio03PlayColorClip(color,Math.random()<.30?'telephone':'normal',true);
  }
  function radio03StartColors(){
    const r=currentRadio03;
    if(!r||r.stage!=='transmission'||r.colorsStarted)return;
    r.colorsStarted=true;r.colorIndex=0;radio03PlayColor();
  }
  function radio03PlayTransmission(){
    const r=currentRadio03;
    if(!r||r.stage!=='transmission'||document.visibilityState!=='visible')return;
    if(!r.audio){
      r.audio=new Audio(r.item.transmission);
      r.audio.preload='auto';r.audio.volume=1;
      r.audio.onended=()=>{
        if(currentRadio03?.token===r.token&&r.stage==='transmission')
          radio03Advance();
      };
      r.audio.onerror=radio03CancelWithoutPenalty;
    }
    const main=r.audio;
    main.ontimeupdate=()=>{
      if(currentRadio03?.token===r.token&&r.stage==='transmission'
        &&main.currentTime>=RADIO03_COLOR_DELAY)radio03StartColors();
    };
    if(!r.ambience){
      r.ambience=new Audio(r.item.ambience);r.ambience.preload='auto';
      r.ambience.loop=true;r.ambience.volume=.12;
    }
    els.radio03Status.textContent='Une voix apparaît au milieu des parasites…';
    els.radio03Play.classList.add('hidden');
    els.radio03Cancel.classList.add('hidden');
    els.radio03Overlay.classList.add('is-speaking');
    try{r.ambience.play().catch(()=>{});}catch(_){}
    const blocked=()=>{
      r.ambience?.pause();
      radio03AudioBlocked('Lecture bloquée. Touchez pour écouter.');
    };
    try{main.play().then(()=>{
      if(currentRadio03?.token===r.token&&r.stage==='transmission'
        &&main.currentTime>=RADIO03_COLOR_DELAY)radio03StartColors();
    }).catch(blocked);}
    catch(_){blocked();}
  }
  function radio03PlaySegment(){
    const r=currentRadio03;
    if(!r||document.visibilityState!=='visible')return;
    const stage=r.stage;
    const path=stage==='gong'?'audio/events/sfx/gong-fin-chronometre.mp3':
      stage==='glitch'?r.item.glitch:
      stage==='maskintro'?r.item.maskIntro:
      stage==='designation'?playerDesignationClips(r.target)[r.designationPart||0]:
      stage==='maskepreuve'?r.item.maskChallenge:
      stage==='reaction'?(r.outcome==='success'?r.item.success:r.item.failure):null;
    if(!path)return;
    if(!r.audio){
      r.audio=new Audio(path);r.audio.volume=1;r.audio.preload='auto';
      const audio=r.audio,token=r.token;
      audio.onended=()=>{
        if(currentRadio03?.token===token&&r.stage===stage&&r.audio===audio)
          radio03Advance();
      };
      audio.onerror=stage==='gong'
        ?()=>{if(currentRadio03?.token===token&&r.stage===stage)radio03Advance();}
        :radio03CancelWithoutPenalty;
    }
    els.radio03Status.textContent=stage==='gong'
      ?'TEMPS ÉCOULÉ… LE VERDICT APPROCHE.':
      stage==='glitch'?'La fréquence se brouille violemment…':
      stage==='maskintro'?'Le Masque interrompt la transmission…':
      stage==='designation'?'Le Masque choisit sa victime…':
      stage==='maskepreuve'?'Le Masque s’adresse à sa victime…':
      'Le Masque rend son verdict…';
    els.radio03Play.classList.add('hidden');
    els.radio03Cancel.classList.add('hidden');
    els.radio03Overlay.classList.add('is-speaking');
    const blocked=()=>radio03AudioBlocked('Lecture bloquée. Touchez pour reprendre.');
    try{
      r.audio.play().then(()=>{
        if(stage!=='gong'||currentRadio03?.token!==r.token
          ||r.stage!=='gong'||r.gongTimer!==null)return;
        // Comme MASQUE-005 : le Masque revient après 10,5 s de résonance.
        r.gongTimer=setTimeout(()=>{
          r.gongTimer=null;
          if(currentRadio03?.token===r.token&&r.stage==='gong')radio03Advance();
        },RADIO03_GONG_DELAY_MS);
      }).catch(blocked);
    }catch(_){blocked();}
  }
  function radio03Advance(){
    const r=currentRadio03;if(!r)return;
    if(r.stage==='transmission'){
      // L'ambiance, les cinq couleurs et la survivante cessent immédiatement.
      radio03Stage('glitch');radio03PlaySegment();
    }else if(r.stage==='glitch'){
      radio03Stage('maskintro');radio03PlaySegment();
    }else if(r.stage==='maskintro'){
      if(!r.target){
        const pool=livingPlayerNumbers();
        if(!pool.length){radio03CancelWithoutPenalty();return;}
        r.target=pool[randomBetween(0,pool.length-1)];
      }
      radio03Stage('designation');radio03PlaySegment();
    }else if(r.stage==='designation'){
      const next=(r.designationPart||0)+1;
      if(next<playerDesignationClips(r.target).length){
        radio03StopAudio(r);r.designationPart=next;radio03PlaySegment();
      }else{radio03Stage('maskepreuve');radio03PlaySegment();}
    }else if(r.stage==='maskepreuve'){
      radio03Stage('choices');radio03ShowChoices();
    }else if(r.stage==='gong'){
      radio03Stage('reaction');radio03PlaySegment();
    }else if(r.stage==='reaction')radio03Finalize();
  }
  function radio03RenderChoices(){
    const r=currentRadio03;if(!r||r.stage!=='choices')return;
    els.radio03Slots.replaceChildren();
    for(let i=0;i<5;i++){
      const value=r.guess[i],slot=document.createElement('div');
      slot.className='radio03-slot'+(value?' filled':'');
      slot.textContent=value?value.toUpperCase():String(i+1);
      slot.setAttribute('aria-label','Position '+(i+1)+' : '+(value||'vide'));
      els.radio03Slots.appendChild(slot);
    }
    els.radio03Confirm.disabled=r.guess.length!==5;
    els.radio03Undo.disabled=r.guess.length===0;
    const s=Math.ceil(Math.max(0,r.remainingMs)/1000);
    els.radio03Clock.textContent='00:'+String(s).padStart(2,'0');
    els.radio03Progress.style.width=
      (Math.max(0,r.remainingMs)/RADIO03_CHOICE_MS*100).toFixed(2)+'%';
    els.radio03Track.setAttribute('aria-valuenow',String(s));
  }
  function radio03PauseTimer(){
    const r=currentRadio03;
    if(!r||r.stage!=='choices'||r.timer===null)return;
    r.remainingMs=Math.max(0,r.deadline-Date.now());
    radio03StopTimer(r);r.deadline=0;radio03Save();
  }
  function radio03Tick(){
    const r=currentRadio03;
    if(!r||r.stage!=='choices'||r.timer===null)return;
    r.remainingMs=Math.max(0,r.deadline-Date.now());
    radio03RenderChoices();
    if(r.remainingMs<=0)radio03Resolve('timeout');
  }
  function radio03StartTimer(){
    const r=currentRadio03;
    if(!r||r.stage!=='choices'||r.timer!==null
      ||document.visibilityState!=='visible')return;
    if(!r.deadline)r.deadline=Date.now()+r.remainingMs;
    radio03Save();
    if(r.deadline<=Date.now()){radio03Resolve('timeout');return;}
    r.timer=setInterval(radio03Tick,100);
    radio03Tick();
  }
  function radio03ShowChoices(){
    const r=currentRadio03;if(!r||r.stage!=='choices')return;
    els.radio03Status.textContent=playerLabel(r.target).toLocaleUpperCase('fr-FR')+
      ' : restitue les cinq couleurs dans l’ordre. Tes compagnons peuvent t’aider.';
    els.radio03Challenge.classList.remove('hidden');
    els.radio03Overlay.classList.remove('is-speaking');
    els.radio03Palette.replaceChildren();
    for(const color of RADIO03_COLORS){
      const button=document.createElement('button');
      button.type='button';button.className='radio03-color '+color;
      button.textContent=color.toUpperCase();
      button.setAttribute('aria-label','Ajouter '+color);
      button.addEventListener('click',()=>{
        if(currentRadio03!==r||r.stage!=='choices'||r.guess.length>=5)return;
        if(r.deadline&&Date.now()>=r.deadline){radio03Resolve('timeout');return;}
        r.guess.push(color);radio03Save();radio03RenderChoices();
      });
      els.radio03Palette.appendChild(button);
    }
    radio03RenderChoices();radio03StartTimer();
  }
  function radio03Undo(){
    const r=currentRadio03;if(!r||r.stage!=='choices')return;
    if(r.deadline&&Date.now()>=r.deadline){radio03Resolve('timeout');return;}
    r.guess.pop();radio03Save();radio03RenderChoices();
  }
  function radio03Submit(){
    const r=currentRadio03;
    if(!r||r.stage!=='choices'||r.guess.length!==5)return;
    if(r.deadline&&Date.now()>=r.deadline){radio03Resolve('timeout');return;}
    radio03Resolve(r.guess.every((color,i)=>color===r.sequence[i])?'success':'failure');
  }
  function radio03Resolve(outcome){
    const r=currentRadio03;if(!r||r.stage!=='choices')return;
    radio03StopTimer(r);r.deadline=0;r.outcome=outcome;
    if(outcome==='timeout'){
      r.remainingMs=0;
      radio03Stage('gong');
    }else radio03Stage('reaction');
    radio03PlaySegment();
  }
  function radio03Finalize(){
    const r=currentRadio03;if(!r||r.stage!=='reaction')return;
    r.before=state.value;
    r.after=clamp(r.before+(r.outcome==='success'?0:5),0,100);
    r.gameOver=r.after>=100;
    // Écrire le résultat AVANT le changement de jauge : restauration idempotente.
    radio03Stage('result');
    if(r.after!==r.before){
      const effect=applyInstabilityDelta(5,{
        source:'Radio — Vous écoutiez ?',deferThreshold:true,deferGameOver:true
      });
      r.after=state.value;r.gameOver=effect.gameOver;radio03Save();
    }
    radio03ShowResult();
  }
  function radio03ShowResult(){
    const r=currentRadio03;if(!r||r.stage!=='result')return;
    radio03StopAudio(r);
    els.radio03Overlay.classList.remove('is-speaking');
    els.radio03Challenge.classList.add('hidden');
    els.radio03Status.textContent='TRANSMISSION TERMINÉE';
    const correct=r.sequence.map(c=>c.toUpperCase()).join(' → ');
    const message=r.outcome==='success'
      ?playerLabel(r.target).toLocaleUpperCase('fr-FR')+' : réponse correcte ! Pioche 2 cartes Objet, uniquement pour toi.'
      :r.outcome==='timeout'
        ?'Temps écoulé. L’Instabilité globale du groupe augmente de 5 points.'
        :'Mauvaise réponse. L’Instabilité globale du groupe augmente de 5 points.';
    // En cas de réussite, ne pas révéler une solution que le groupe connaît déjà.
    // En cas d'échec ou de temps écoulé, indiquer clairement la bonne suite.
    const correction=r.outcome==='success'?''
      :'\n\nLa bonne séquence était : '+correct+
        '\nInstabilité : '+r.before+' % → '+r.after+' %.';
    els.radio03Reward.textContent=message+correction;
    els.radio03Reward.classList.remove('hidden');
    els.radio03Done.classList.remove('hidden');
    els.radio03Done.focus();
  }
  function radio03Complete(){
    const r=currentRadio03;
    if(!r||!['result','cancelled'].includes(r.stage))return;
    const delay=r.preview?r.savedPreviewDelay:randomAudioDelay();
    const over=r.stage==='result'&&r.gameOver;
    const transition=r.stage==='result'
      &&Number.isFinite(r.before)&&Number.isFinite(r.after)
      &&r.after!==r.before?[r.before,r.after]:null;
    dismissRadio03();
    if(!r.preview)eventSession.pendingRadio003=null;
    eventSession.remainingMs=delay;
    saveAudioEventSession();renderEventControls();updateAudioEventClock();
    if(over||transition){
      clearTimeout(radio03DeferredOutcomeTimer);
      radio03DeferredOutcomeTimer=setTimeout(()=>{
        radio03DeferredOutcomeTimer=null;
        if(over)checkGameOver();
        else if(transition&&state.value===transition[1])
          handleThresholdTransition(transition[0],transition[1]);
      },REDUCED_MOTION?0:650);
    }
  }
  function radio03ResumeAudio(){
    const r=currentRadio03;
    if(!r||document.visibilityState!=='visible')return;
    if(r.stage==='transmission')radio03PlayTransmission();
    else radio03PlaySegment();
  }
  function handleRadio03Visibility(){
    const r=currentRadio03;if(!r)return;
    if(document.visibilityState==='hidden'){
      if(r.stage==='choices')radio03PauseTimer();
      if(r.stage==='gong'&&r.gongTimer!==null){
        clearTimeout(r.gongTimer);r.gongTimer=null;
      }
      if(r.audio&&!r.audio.paused){
        r.audio.pause();radio03StopBackground(r);
        radio03AudioBlocked('Lecture suspendue. Touchez pour reprendre.');
      }
    }else if(r.stage==='choices')radio03StartTimer();
  }
  function radio03OnPageHide(){
    const r=currentRadio03;if(!r)return;
    if(r.stage==='choices')radio03PauseTimer();
    else if(r.audio){
      if(r.stage==='gong'&&r.gongTimer!==null){
        clearTimeout(r.gongTimer);r.gongTimer=null;
      }
      r.audio.pause();radio03StopBackground(r);
    }
  }
  function beginRadio03(item,preview,restoring=false){
    const pending=restoring?eventSession.pendingRadio003:null;
    if(item?.id!=='radio-003'||!eventSession.active
      ||currentMaskEvent||currentMask05||currentRadioEvent||currentRadio02
      ||currentRadio03||currentWeatherEvent||specialAudioActive
      ||anyBlockingModalOpen()||!isPartieTabActive()
      ||document.visibilityState!=='visible'
      ||(state.value>=100&&!(restoring&&pending?.stage==='result'))
      ||(!restoring&&livingPlayerNumbers().length===0)
      ||restoring&&!pending)return false;
    pauseAudioEventClock();
    // Après F5, l'appel initial ne sera JAMAIS rejoué.
    const stage=restoring&&pending.stage==='transmission'?'glitch'
      :restoring?pending.stage:'transmission';
    const r={
      token:++radio03Token,item,preview,stage,
      savedPreviewDelay:eventSession.remainingMs,
      sequence:pending?.sequence?.slice()||Array.from({length:5},()=>
        RADIO03_COLORS[randomBetween(0,3)]),
      target:pending?.target??null,guess:pending?.guess?.slice()||[],
      outcome:pending?.outcome??null,before:pending?.before??null,
      after:pending?.after??null,gameOver:pending?.gameOver===true,
      remainingMs:pending?.remainingMs??RADIO03_CHOICE_MS,
      deadline:pending?.deadline||0,
      audio:null,ambience:null,colorAudio:null,
      colorTimer:null,colorIndex:0,colorsStarted:false,timer:null,gongTimer:null
    };
    currentRadio03=r;
    if(!preview&&!restoring){
      eventSession.played.push(item.id);eventSession.remainingMs=null;
    }
    radio03Save();
    els.radio03Status.textContent='Une fréquence inconnue s’active…';
    for(const id of ['radio03Challenge','radio03Reward','radio03Play',
      'radio03Cancel','radio03Done'])els[id].classList.add('hidden');
    els.radio03Overlay.classList.toggle('is-hijacked',
      !['transmission','glitch'].includes(stage));
    radio03UpdatePortrait(stage);
    els.radio03Overlay.classList.add('show');
    els.radio03Overlay.setAttribute('aria-hidden','false');
    specialAudioActive=true;silenceHauntSounds();syncAmbientVolume();
    renderEventControls();
    if(stage==='choices')radio03ShowChoices();
    else if(stage==='result'){
      // Corrige le rare F5 entre la sauvegarde du verdict et l'effet.
      if(!preview&&Number.isFinite(r.before)&&Number.isFinite(r.after)
        &&state.value===r.before&&r.after>r.before){
        applyInstabilityDelta(r.after-r.before,{
          source:'Radio — Vous écoutiez ? (reprise)',
          deferThreshold:true,deferGameOver:true
        });
      }
      radio03ShowResult();
    }else if(stage==='cancelled')radio03ShowCancelled();
    else if(stage==='transmission')radio03PlayTransmission();
    else radio03PlaySegment();
    return true;
  }
  function resumePendingRadio03IfPossible(){
    const pending=eventSession.pendingRadio003;
    if(!pending||!eventSession.active||gameOverShown
      ||document.visibilityState!=='visible'
      ||(state.value>=100&&pending.stage!=='result'))return false;
    const item=AUDIO_EVENTS.find(x=>x.id==='radio-003');
    if(!item){eventSession.pendingRadio003=null;saveAudioEventSession();return false;}
    return beginRadio03(item,false,true);
  }


  // RADIO-004 est encapsulé dans radio004.js pour préserver les événements existants.
  function getRadio04Engine() {
    if (!radio04Engine) {
      if (typeof window.RdVRadio04 !== 'function') return null;
      radio04Engine = window.RdVRadio04({
        session: eventSession,
        save: saveAudioEventSession,
        pauseClock: pauseAudioEventClock,
        updateClock: updateAudioEventClock,
        renderControls: renderEventControls,
        onOpen: r => { currentRadio04 = r; },
        onClose: () => { currentRadio04 = null; },
        markActive: active => { specialAudioActive = active; },
        syncAmbient: syncAmbientVolume,
        silenceHaunts: silenceHauntSounds,
        value: () => state.value,
        applyDelta: (delta, source) => applyInstabilityDelta(delta, {
          source, deferThreshold: true, deferGameOver: true
        }),
        threshold: handleThresholdTransition,
        gameOver: checkGameOver,
        nextDelay: () => randomAudioDelay(),
        reducedMotion: REDUCED_MOTION
      });
    }
    return radio04Engine;
  }

  function beginRadio04(item, preview, restoring = false) {
    const pending = restoring ? eventSession.pendingRadio004 : null;
    if (!eventSession.active || !item || item.id !== 'radio-004'
      || currentMaskEvent || currentMask05 || currentMask06 || currentMask07
      || currentRadioEvent || currentRadio02 || currentRadio03 || currentRadio04
      || currentWeatherEvent || specialAudioActive || anyBlockingModalOpen()
      || !isPartieTabActive() || document.visibilityState !== 'visible'
      || (state.value >= 100 && !(restoring && ['result','resultvoice'].includes(pending?.stage)))
      || (!restoring && livingPlayerNumbers().length === 0)
      || (restoring && !pending)) return false;
    return getRadio04Engine()?.begin(item, preview, restoring) || false;
  }

  function dismissRadio04() {
    radio04Engine?.stop();
  }

  function handleRadio04Visibility() {
    radio04Engine?.visibility();
  }

  function radio04OnPageHide() {
    radio04Engine?.pageHide();
  }

  function resumePendingRadio04IfPossible() {
    const pending = eventSession.pendingRadio004;
    if (!pending || !eventSession.active || gameOverShown
      || document.visibilityState !== 'visible'
      || (state.value >= 100 && !['result','resultvoice'].includes(pending.stage)))
      return false;
    const item = AUDIO_EVENTS.find(x => x.id === 'radio-004');
    if (!item) {
      eventSession.pendingRadio004 = null;
      saveAudioEventSession();
      return false;
    }
    return beginRadio04(item, false, true);
  }


  // RADIO-005 : l'animateur du Vice, séquence isolée dans radio005.js.
  function getRadio05Engine() {
    if (!radio05Engine) {
      if (typeof window.RdVRadio05 !== 'function') return null;
      radio05Engine = window.RdVRadio05({
        session: eventSession,
        save: saveAudioEventSession,
        pauseClock: pauseAudioEventClock,
        updateClock: updateAudioEventClock,
        renderControls: renderEventControls,
        onOpen: r => { currentRadio05 = r; },
        onClose: () => { currentRadio05 = null; },
        markActive: active => { specialAudioActive = active; },
        syncAmbient: syncAmbientVolume,
        silenceHaunts: silenceHauntSounds,
        keepAwake: requestWakeLock,
        value: () => state.value,
        living: livingPlayerNumbers,
        // Les noms seront associés aux emplacements de joueurs ultérieurement.
        // Aucun fichier « Joueur X » n'est prononcé par cet animateur.
        // Deux homonymes restent identifiables par leur place pendant le tirage.
        playerName: n => playerLabel(n),
        applyDelta: (delta, source) => applyInstabilityDelta(delta, {
          source, deferThreshold: true, deferGameOver: true
        }),
        threshold: handleThresholdTransition,
        gameOver: checkGameOver,
        nextDelay: () => randomAudioDelay(),
        reducedMotion: REDUCED_MOTION
      });
    }
    return radio05Engine;
  }

  function beginRadio05(item, preview, restoring = false) {
    const pending = restoring ? eventSession.pendingRadio005 : null;
    if (!eventSession.active || !item || item.id !== 'radio-005'
      || currentMaskEvent || currentMask05 || currentMask06 || currentMask07
      || currentRadioEvent || currentRadio02 || currentRadio03
      || currentRadio04 || currentRadio05 || currentWeatherEvent
      || specialAudioActive || anyBlockingModalOpen()
      || !isPartieTabActive() || document.visibilityState !== 'visible'
      || (state.value >= 100 && !(restoring
        && (pending?.applied === true || pending?.phase === 'result')))
      || (!restoring && livingPlayerNumbers().length === 0)
      || (restoring && !pending)) return false;
    return getRadio05Engine()?.begin(item, preview, restoring) || false;
  }

  function dismissRadio05() {
    radio05Engine?.stop();
  }

  function handleRadio05Visibility() {
    radio05Engine?.visibility();
  }

  function radio05OnPageHide() {
    radio05Engine?.pageHide();
  }

  function resumePendingRadio05IfPossible() {
    const pending = eventSession.pendingRadio005;
    if (!pending || !eventSession.active || gameOverShown
      || document.visibilityState !== 'visible'
      || (state.value >= 100
        && !(pending.applied === true || pending.phase === 'result')))
      return false;
    const item = AUDIO_EVENTS.find(x => x.id === 'radio-005');
    if (!item) {
      eventSession.pendingRadio005 = null;
      saveAudioEventSession();
      return false;
    }
    return beginRadio05(item, false, true);
  }

  // =========================================================
  // MÉTÉO : NARRATION DU MONDE ET CONSÉQUENCE AUTOMATIQUE
  // =========================================================


  // =========================================================
  // MÉTÉO 004 — LE DERNIER BATTEMENT (identité jamais affichée)
  // =========================================================
  const WEATHER04_DURATION=15000;
  // Décalage testable : la combustion commence avant la fin du MP3 « Céder ».
  const WEATHER04_REVEAL_LEAD_SECONDS=2.0;
  const WEATHER04_VIDEO='bestiaire/videos/gardienne-du-vice.webm';
  let w04BurnFrame=null, w04VideoFrame=null, w04Delay=null, w04AutoplayTimer=null;
  let w04VolumeFadeFrame=null;
  function w04Save(stage) {
    const e=currentWeatherEvent;
    if(!e?.is04||e.preview)return;
    eventSession.pendingWeather={id:e.item.id,stage,choice:e.choice,
      remainingMs:stage==='choices'?e.remainingMs:null,rewardApplied:e.applied};
    saveAudioEventSession();
  }
  function w04StopClock() {
    const e=currentWeatherEvent;
    if(e?.timer!==null && e?.timer!==undefined){clearInterval(e.timer);e.timer=null;}
  }
  function w04StopAudio() {
    const e=currentWeatherEvent;
    if(e?.loop){e.loop.pause();try{e.loop.currentTime=0;}catch(_){}}
  }
  function w04StopVisuals() {
    if(w04BurnFrame!==null)cancelAnimationFrame(w04BurnFrame);
    if(w04VideoFrame!==null)cancelAnimationFrame(w04VideoFrame);
    if(w04Delay!==null)clearTimeout(w04Delay);
    if(w04AutoplayTimer!==null)clearTimeout(w04AutoplayTimer);
    if(w04VolumeFadeFrame!==null)cancelAnimationFrame(w04VolumeFadeFrame);
    w04BurnFrame=null;w04VideoFrame=null;w04Delay=null;w04AutoplayTimer=null;
    w04VolumeFadeFrame=null;
  }
  function weather04CleanUp() {
    w04StopClock();w04StopAudio();w04StopVisuals();
    const v=els.weather04Video;
    v.pause();v.onended=null;v.onerror=null;v.onloadeddata=null;
    v.removeAttribute('src');v.load();
    els.weather04Overlay.classList.remove('show');
    els.weather04Overlay.setAttribute('aria-hidden','true');
    els.weather04Stage.className='weather04-stage';
    els.weather04Stage.style.removeProperty('--heart-shock');
    els.weather04Surface.style.removeProperty('mask-image');
    els.weather04Surface.style.removeProperty('-webkit-mask-image');
    els.weather04Surface.style.removeProperty('pointer-events');
    els.weather04Surface.style.removeProperty('opacity');
    els.weather04Surface.style.removeProperty('transition');
    els.weather04Panel.style.removeProperty('mask-image');
    els.weather04Panel.style.removeProperty('-webkit-mask-image');
    els.weather04Panel.style.removeProperty('pointer-events');
    els.weather04Panel.style.removeProperty('opacity');
    els.weather04Panel.style.removeProperty('transition');
    els.weather04Burn.removeAttribute('style');
    for(const id of ['weather04Choices','weather04Sound','weather04Play',
      'weather04Skip','weather04Result','weather04Done','weather04VideoActions'])
      els[id].classList.add('hidden');
    els.weather04Burn.width=0;els.weather04Burn.height=0;
  }
  function w04Fallback(message) {
    const e=currentWeatherEvent;
    if(!e?.is04||!['intro','branch'].includes(e.phase))return;
    els.weather04Status.textContent=message||
      'Narration interrompue. Réessayez ou poursuivez sans audio.';
    els.weather04Play.classList.remove('hidden');
    els.weather04Skip.classList.remove('hidden');
  }
  function weather04PlayNarration(){
    const e=currentWeatherEvent;
    if(!e?.is04||!['intro','branch'].includes(e.phase)
      ||document.visibilityState!=='visible')return;
    if(!e.audio)return weather04SkipNarration();
    const phase=e.phase,token=e.token;
    els.weather04Play.classList.add('hidden');
    els.weather04Skip.classList.add('hidden');
    els.weather04Status.textContent=phase==='intro'
      ?'Une pulsation inconnue traverse la ville…'
      :e.choice==='resist'?'Vous luttez contre le rythme imposé…'
        :'Vous abandonnez toute résistance…';
    // Pendant la conclusion B, le récit continue sous la combustion :
    // seule la transition démarre plus tôt, sans couper le narrateur.
    e.audio.ontimeupdate=()=>{
      if(currentWeatherEvent?.token!==token||phase!=='branch'
        ||e.choice!=='cede'||e.phase!=='branch')return;
      const duration=e.audio?.duration;
      const position=e.audio?.currentTime;
      if(Number.isFinite(duration)&&duration>0&&Number.isFinite(position)
        &&duration-position<=WEATHER04_REVEAL_LEAD_SECONDS){
        w04AfterBranch(true);
      }
    };
    e.audio.onended=()=>{
      if(currentWeatherEvent?.token!==token)return;
      if(phase==='intro'&&e.phase==='intro')w04Choices();
      else if(phase==='branch'){
        if(e.phase==='branch')w04AfterBranch(); // secours si le MP3 n'a pas de durée.
        else if(e.phase==='reveal'){
          e.audio=null;
          w04RestoreRevealVolume();
        }
      }
    };
    e.audio.onerror=()=>{
      if(currentWeatherEvent?.token===token)
        w04Fallback('Audio indisponible. Réessayez ou poursuivez.');
    };
    try{e.audio.play().catch(()=>{
      if(currentWeatherEvent?.token===token)
        w04Fallback('Lecture bloquée. Touchez pour reprendre.');
    });}catch(_){w04Fallback();}
  }
  function weather04SkipNarration(){
    const e=currentWeatherEvent;
    if(!e?.is04||!['intro','branch'].includes(e.phase))return;
    e.audio?.pause();
    if(e.audio){e.audio.onended=null;e.audio.onerror=null;}
    if(e.phase==='intro')w04Choices();
    else w04AfterBranch();
  }
  function w04ClockView(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='choices')return;
    const sec=Math.ceil(e.remainingMs/1000);
    els.weather04Clock.textContent='00:'+String(sec).padStart(2,'0');
    els.weather04Progress.style.width=(e.remainingMs/WEATHER04_DURATION*100).toFixed(2)+'%';
    els.weather04Track.setAttribute('aria-valuenow',String(sec));
  }
  function weather04TryChoiceAudio(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='choices'||document.visibilityState!=='visible')return;
    e.loop.play().then(()=>els.weather04Sound.classList.add('hidden')).catch(()=>{
      if(currentWeatherEvent?.token===e.token)
        els.weather04Sound.classList.remove('hidden');
    });
  }
  function w04PauseChoices(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='choices')return;
    if(e.timer!==null){
      e.remainingMs=Math.max(0,e.deadline-performance.now());
      w04StopClock();w04Save('choices');
    }
    w04StopAudio();
  }
  function w04ResumeChoices(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='choices'||e.timer!==null
      ||document.visibilityState!=='visible')return;
    if(e.remainingMs<=0)return weather04Choose('resist');
    e.deadline=performance.now()+e.remainingMs;
    const token=e.token;let sec=Math.ceil(e.remainingMs/1000);
    e.timer=setInterval(()=>{
      if(currentWeatherEvent?.token!==token||e.phase!=='choices')return;
      e.remainingMs=Math.max(0,e.deadline-performance.now());
      w04ClockView();
      const next=Math.ceil(e.remainingMs/1000);
      if(next!==sec){sec=next;w04Save('choices');}
      if(e.remainingMs<=0)weather04Choose('resist');
    },100);
    weather04TryChoiceAudio();
  }
  function w04Choices(restoring=false){
    const e=currentWeatherEvent;if(!e?.is04)return;
    e.audio?.pause();e.audio=null;e.phase='choices';
    e.remainingMs=restoring?Math.max(0,Math.min(WEATHER04_DURATION,e.remainingMs))
      :WEATHER04_DURATION;
    if(!e.loop){
      e.loop=new Audio(e.item.choiceAudio);
      e.loop.loop=true;e.loop.volume=1;e.loop.preload='auto';
    }
    els.weather04Stage.className='weather04-stage choices';
    els.weather04Status.textContent=
      'Une cadence étrangère s’impose à vos cœurs. Comment réagissez-vous ?';
    for(const id of ['weather04Play','weather04Skip','weather04Result',
      'weather04Done','weather04Sound'])els[id].classList.add('hidden');
    els.weather04Choices.classList.remove('hidden');
    w04ClockView();w04Save('choices');w04ResumeChoices();
  }
  function weather04Choose(choice){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='choices'||!['resist','cede'].includes(choice))return;
    w04PauseChoices();e.choice=choice;e.phase='branch';
    e.audio=new Audio(choice==='resist'?e.item.resistAudio:e.item.cedeAudio);
    e.audio.volume=1;e.audio.preload='auto';
    els.weather04Choices.classList.add('hidden');
    els.weather04Sound.classList.add('hidden');
    els.weather04Stage.className='weather04-stage branch';
    w04Save('branch');
    if(choice==='cede'){
      els.weather04Video.src=WEATHER04_VIDEO;
      els.weather04Video.preload='auto';
      els.weather04Video.load();
      ensureRuntimeAsset(WEATHER04_VIDEO).catch(()=>{});
    }
    weather04PlayNarration();
  }
  function w04AfterBranch(keepNarration=false){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='branch')return;
    if(keepNarration&&e.choice==='cede'){
      // Le MP3 finit normalement sa dernière phrase, sans déclencher
      // à nouveau la révélation quand son événement ended se produit.
      if(e.audio)e.audio.ontimeupdate=null;
    }else{
      e.audio?.pause();
      e.audio=null;
    }
    if(e.choice==='cede'){
      e.phase='reveal';w04Save('reveal');w04Reveal();
    }else weather04Result();
  }
  function w04RestoreRevealVolume(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='reveal')return;
    const video=els.weather04Video;
    if(w04VolumeFadeFrame!==null)cancelAnimationFrame(w04VolumeFadeFrame);
    const start=video.volume,at=performance.now(),token=e.token;
    const fade=now=>{
      if(currentWeatherEvent?.token!==token||e.phase!=='reveal')return;
      const p=Math.max(0,Math.min(1,(now-at)/480));
      video.volume=Math.min(1,start+(1-start)*p);
      if(p<1)w04VolumeFadeFrame=requestAnimationFrame(fade);
      else w04VolumeFadeFrame=null;
    };
    w04VolumeFadeFrame=requestAnimationFrame(fade);
  }


  // Combustion procédurale : une membrane de "papier" craquelle,
  // se consume et ouvre des brèches sur la vidéo derrière elle.
  function w04Burn(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='reveal')return;
    const stage=els.weather04Stage,curtain=els.weather04Surface;
    const canvas=els.weather04Burn;
    const token=e.token;
    // Le WebM est visible sous chaque trou dès la première brûlure.
    // Le son/la vidéo démarrent au bout de 500 ms, pendant la combustion.
    function finish(){
      if(currentWeatherEvent?.token!==token||e.phase!=='reveal')return;
      curtain.style.opacity='0';
      stage.classList.add('burn-done','revealing');
      w04BurnFrame=null;
      // À la fin du feu, la lecture est déjà en cours. Si le navigateur
      // refuse l'autoplay, on attend ici pour proposer une action manuelle.
      if(e.videoError){
        els.weather04VideoActions.classList.remove('hidden');
        els.weather04VideoPlay.classList.add('hidden');
      }else if(e.videoAutoplayBlocked){
        els.weather04VideoActions.classList.remove('hidden');
        els.weather04VideoPlay.classList.remove('hidden');
        els.weather04VideoPlay.textContent='TOUCHER POUR RÉVÉLER';
      }else if(els.weather04Video.paused && w04AutoplayTimer===null){
        weather04TryVideo();
      }
    }
    const masksSupported=('maskImage' in curtain.style)
      ||('webkitMaskImage' in curtain.style);
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx||!masksSupported||REDUCED_MOTION){
      curtain.style.transition='opacity .55s ease';
      curtain.style.opacity='0';
      w04Delay=setTimeout(()=>{w04Delay=null;finish();},560);
      return;
    }
    const rect=curtain.getBoundingClientRect();
    // Le masque couvre le viewport, mais est calculé à résolution
    // maîtrisée pour préserver la fluidité sur smartphone/ordinateur.
    const scale=Math.min(1,
      Math.sqrt(370000/Math.max(1,rect.width*rect.height)),
      900/Math.max(1,rect.width));
    const W=Math.max(1,Math.round(rect.width*scale));
    const H=Math.max(1,Math.round(rect.height*scale));
    canvas.style.left=rect.left+'px';
    canvas.style.top=rect.top+'px';
    canvas.style.width=rect.width+'px';
    canvas.style.height=rect.height+'px';
    canvas.width=W;canvas.height=H;
    curtain.style.pointerEvents='none';
    const mask=document.createElement('canvas');
    mask.width=W;mask.height=H;
    const mc=mask.getContext('2d',{willReadFrequently:true});
    if(!mc){curtain.style.opacity='0';finish();return;}
    const maskPixels=mc.createImageData(W,H);
    const glowPixels=ctx.createImageData(W,H);
    const total=W*H,field=new Float32Array(total);
    // Bruit continu multiéchelle : des micro-brûlures organiques et non
    // des trous géométriques/rayonnants dessinés à partir de cercles.
    function hash(x,y){
      let n=Math.imul(x,374761393)^Math.imul(y,668265263);
      n=Math.imul(n^(n>>>13),1274126177);
      return ((n^(n>>>16))>>>0)/4294967295;
    }
    function noise(x,y){
      const ix=Math.floor(x),iy=Math.floor(y);
      const sx=x-ix,sy=y-iy;
      const tx=sx*sx*(3-2*sx),ty=sy*sy*(3-2*sy);
      const a=hash(ix,iy),b=hash(ix+1,iy);
      const c=hash(ix,iy+1),d=hash(ix+1,iy+1);
      return (a+(b-a)*tx)*(1-ty)+(c+(d-c)*tx)*ty;
    }
    const seeds=[
      [.05,.17,-.08],[.85,.13,.03],[.12,.74,-.02],
      [.76,.86,.02],[.46,.43,.12],[.93,.52,.10],
      [.31,.07,.09],[.35,.92,.08],[.62,.24,.12],
      [.08,.45,.17],[.58,.71,.13],[.23,.30,.10],
      [.71,.44,.16],[.43,.63,.17],[.27,.82,.19],
      [.92,.84,.20],[.13,.90,.17],[.86,.32,.22]
    ];
    let lo=Infinity,hi=-Infinity;
    for(let y=0;y<H;y++){
      const v=(y+.5)/H;
      for(let x=0;x<W;x++){
        const u=(x+.5)/W;
        const large=noise(u*5.5+7.2,v*6.6+1.8);
        const mid=noise(u*17.6+10.3,v*19.8+3.1);
        const fine=noise(u*47.2+4.6,v*43.9+11.7);
        const warpU=u+(large-.5)*.093+(mid-.5)*.026;
        const warpV=v+(noise(u*5.5+15.7,v*6.3+9.1)-.5)*.083;
        let nearest=Infinity;
        for(const [sx,sy,offset] of seeds){
          const dist=Math.hypot((warpU-sx)*1.1,(warpV-sy)*.87);
          nearest=Math.min(nearest,dist+offset);
        }
        const t=nearest*1.85+(large-.5)*.23
          +(mid-.5)*.16+(fine-.5)*.062;
        const ix=y*W+x;
        field[ix]=t;
        if(t<lo)lo=t;if(t>hi)hi=t;
      }
    }
    const inv=1/Math.max(.001,hi-lo);
    for(let i=0;i<total;i++)field[i]=(field[i]-lo)*inv;
    const start=performance.now(),duration=3450;
    let lastFrame=-Infinity;
    function renderFrame(now){
      if(currentWeatherEvent?.token!==token||e.phase!=='reveal')return;
      if(now-lastFrame<43){
        w04BurnFrame=requestAnimationFrame(renderFrame);return;
      }
      lastFrame=now;
      const p=Math.min(1,(now-start)/duration);
      const threshold=-.012+p*1.035;
      const m=maskPixels.data,g=glowPixels.data;
      for(let i=0;i<total;i++){
        const delta=field[i]-threshold,k=i*4;
        const alpha=Math.max(0,Math.min(255,Math.round(delta*14200)));
        m[k]=255;m[k+1]=255;m[k+2]=255;m[k+3]=alpha;
        // Cendres noires, croûte orange, filet jaune incandescent.
        let ga=0,r=0,gg=0,b=0;
        if(delta>-.034&&delta<.063){
          if(delta<-.013){
            r=255;gg=65;b=22;
            ga=80*(delta+.034)/.021;
          }else if(delta<0){
            r=255;gg=117;b=37;
            ga=115+125*(delta+.013)/.013;
          }else if(delta<.011){
            r=255;gg=228;b=143;
            ga=238;
          }else if(delta<.03){
            r=235;gg=89;b=32;
            ga=193*(.03-delta)/.019;
          }else{
            r=19;gg=7;b=6;
            ga=150*(.063-delta)/.033;
          }
        }
        g[k]=r;g[k+1]=gg;g[k+2]=b;
        g[k+3]=Math.max(0,Math.min(255,Math.round(ga)));
      }
      mc.putImageData(maskPixels,0,0);
      const encoded=mask.toDataURL('image/png');
      curtain.style.maskImage='url("'+encoded+'")';
      curtain.style.webkitMaskImage='url("'+encoded+'")';
      ctx.putImageData(glowPixels,0,0);
      // Quelques minuscules braises détachées des bords, pas d'étoiles.
      if(p<.96){
        for(let j=0;j<20;j++){
          const pos=((j*7919+Math.floor(p*600)*409)%total);
          if(Math.abs(field[pos]-threshold)>.025)continue;
          ctx.fillStyle=j%4?'rgba(255,112,40,.58)':'rgba(255,223,154,.8)';
          ctx.fillRect(pos%W,(pos/W|0)-2-j%10,1+j%2,2+j%3);
        }
      }
      if(p>=1){finish();return;}
      w04BurnFrame=requestAnimationFrame(renderFrame);
    }
    w04BurnFrame=requestAnimationFrame(renderFrame);
  }
  function w04SyncVideo(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='reveal')return;
    const video=els.weather04Video;
    const time=video.currentTime||0;
    // Une seule lecture vidéo : les images fournissent aussi le fond flouté.
    if(video.readyState>=2){
      const canvas=els.weather04Backdrop;
      if(canvas.width!==384||canvas.height!==240){
        canvas.width=384;canvas.height=240;
      }
      const ctx=canvas.getContext('2d',{alpha:false});
      if(ctx){
        const vw=video.videoWidth||736,vh=video.videoHeight||1120;
        const ratio=Math.min(vw/384,vh/240);
        const sw=384*ratio,sh=240*ratio;
        ctx.drawImage(video,(vw-sw)/2,(vh-sh)/2,sw,sh,0,0,384,240);
      }
    }
    // Deux grandes impulsions observables dans l'animation source.
    const strength=Math.min(1,
      .5*Math.exp(-Math.pow((time-1.8)/.25,2))+
      Math.exp(-Math.pow((time-6.3)/.36,2)));
    els.weather04Stage.style.setProperty('--heart-shock',strength.toFixed(3));
    w04VideoFrame=requestAnimationFrame(w04SyncVideo);
  }


  function w04Reveal(restoring=false){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='reveal')return;
    const token=e.token,video=els.weather04Video;
    els.weather04Stage.className=restoring
      ? 'weather04-stage revealing burn-done'
      : 'weather04-stage burning';
    els.weather04VideoActions.classList.add('hidden');
    video.playsInline=true;video.muted=false;
    // Éviter que le premier grondement du WebM masque « C'est le sien ».
    video.volume=e.audio&&!e.audio.paused?0.12:1;
    video.preload='auto';
    if(!video.getAttribute('src'))video.src=WEATHER04_VIDEO;
    video.onended=()=>{
      if(currentWeatherEvent?.token===token&&e.phase==='reveal')weather04Result();
    };
    video.onerror=()=>{
      if(currentWeatherEvent?.token===token&&e.phase==='reveal'){
        e.videoError=true;
        if(els.weather04Stage.classList.contains('burn-done')){
          els.weather04VideoActions.classList.remove('hidden');
          els.weather04VideoPlay.classList.add('hidden');
        }
      }
    };
    if(restoring){
      els.weather04Surface.style.opacity='0';
      els.weather04VideoPlay.classList.remove('hidden');
      els.weather04VideoPlay.textContent='REPRENDRE L’APPARITION';
      els.weather04VideoActions.classList.remove('hidden');
    }else{
      // On attend la PREMIÈRE IMAGE DÉCODÉE avant de consumer tout l'écran.
      // Aucun écran vide après la combustion, même sur connexion lente.
      const ignite=()=>{
        if(currentWeatherEvent?.token!==token||e.phase!=='reveal')return;
        video.onloadeddata=null;
        if(w04Delay!==null){clearTimeout(w04Delay);w04Delay=null;}
        els.weather04VideoActions.classList.add('hidden');
        w04Burn();
        // La combustion dure 3,45 s : la vidéo joue dès 0,5 s.
        // On conserve la première image visible sous le masque avant cela.
        w04AutoplayTimer=setTimeout(()=>{
          w04AutoplayTimer=null;
          if(currentWeatherEvent?.token!==token||e.phase!=='reveal')return;
          weather04TryVideo();
        },500);
      };
      if(video.readyState>=2)ignite();
      else{
        els.weather04Status.textContent=
          'Une présence cherche à traverser votre écran…';
        video.onloadeddata=ignite;
        w04Delay=setTimeout(()=>{
          w04Delay=null;
          if(currentWeatherEvent?.token!==token||e.phase!=='reveal'
            ||video.readyState>=2)return;
          els.weather04Status.textContent=
            'L’apparition tarde à se charger. Vous pouvez poursuivre sans la vidéo.';
          els.weather04VideoActions.classList.remove('hidden');
          els.weather04VideoPlay.classList.add('hidden');
        },7000);
      }
    }
    if(!REDUCED_MOTION)w04VideoFrame=requestAnimationFrame(w04SyncVideo);
  }
  function weather04TryVideo(){
    const e=currentWeatherEvent;
    if(!e?.is04||e.phase!=='reveal')return;
    const v=els.weather04Video;
    if(v.error){
      els.weather04VideoActions.classList.remove('hidden');
      els.weather04VideoPlay.classList.add('hidden');
      return;
    }
    v.play().then(()=>{
      if(currentWeatherEvent?.token!==e.token)return;
      e.videoAutoplayBlocked=false;
      els.weather04VideoActions.classList.add('hidden');
    }).catch(()=>{
      if(currentWeatherEvent?.token!==e.token)return;
      e.videoAutoplayBlocked=true;
      // Pas de bouton pendant la combustion, pour préserver la surprise.
      if(!els.weather04Stage.classList.contains('burn-done'))return;
      els.weather04VideoActions.classList.remove('hidden');
      els.weather04VideoPlay.classList.remove('hidden');
      els.weather04VideoPlay.textContent='TOUCHER POUR RÉVÉLER';
    });
  }
  function weather04Result(){
    const e=currentWeatherEvent;if(!e?.is04)return;
    w04StopVisuals();w04StopClock();w04StopAudio();
    els.weather04Surface.style.removeProperty('opacity');
    els.weather04Surface.style.removeProperty('mask-image');
    els.weather04Surface.style.removeProperty('-webkit-mask-image');
    els.weather04Surface.style.removeProperty('pointer-events');
    els.weather04Surface.style.removeProperty('transition');
    els.weather04Panel.style.removeProperty('opacity');
    els.weather04Panel.style.removeProperty('mask-image');
    els.weather04Panel.style.removeProperty('-webkit-mask-image');
    els.weather04Panel.style.removeProperty('pointer-events');
    els.weather04Panel.style.removeProperty('transition');
    els.weather04Burn.removeAttribute('style');
    e.audio?.pause();els.weather04Video.pause();
    e.phase='result';
    // Sauvegarde de l'étape et de la récompense avant l'affichage.
    w04Save('result');
    if(e.choice==='cede'&&!e.applied){
      setTemporaryEffect('equipements','Équipements et Objets inutilisables',2);
      e.applied=true;w04Save('result');
    }
    e.completed=true;
    els.weather04Stage.className='weather04-stage result';
    els.weather04Status.textContent=e.choice==='resist'
      ?'Vous avez repoussé les pulsations.'
      :'Le silence revient. Une présence vous a répondu.';
    els.weather04Result.replaceChildren();
    const p=document.createElement('p'),b=document.createElement('strong');
    b.textContent=e.choice==='resist'
      ?'Chaque survivant perd 1 PV.':'Chaque survivant soigne 1 PV.';
    p.appendChild(b);els.weather04Result.appendChild(p);
    const info=document.createElement('p');
    info.textContent=e.choice==='resist'
      ?'Cette perte ne peut pas tuer : un survivant à 1 PV conserve son dernier PV.'
      :'Retournez face cachée tous vos Équipements et Objets. Ils sont inutilisables pendant 2 manches complètes.';
    els.weather04Result.appendChild(info);
    for(const id of ['weather04Choices','weather04Play','weather04Skip',
      'weather04VideoActions'])els[id].classList.add('hidden');
    els.weather04Result.classList.remove('hidden');
    els.weather04Done.classList.remove('hidden');
    els.weather04Done.focus();
    if(!e.preview){
      eventSession.nextWeatherEligibleAt=Date.now()+WEATHER_MIN_GAP_MS;
      saveAudioEventSession();
    }
  }
  function weather04Complete(){
    const e=currentWeatherEvent;
    if(!e?.is04||!e.completed)return;
    const delay=e.preview?e.savedPreviewDelay:randomAudioDelay();
    dismissWeatherEvent();
    if(!e.preview)eventSession.pendingWeather=null;
    eventSession.remainingMs=delay;
    saveAudioEventSession();renderEventControls();updateAudioEventClock();
  }
  function weather04Visibility(){
    const e=currentWeatherEvent;if(!e?.is04)return;
    if(document.visibilityState==='hidden'){
      if(e.phase==='choices')w04PauseChoices();
      if(['intro','branch'].includes(e.phase)&&e.audio&&!e.audio.paused){
        e.audio.pause();w04Fallback('Narration suspendue. Touchez pour reprendre.');
      }
      if(e.phase==='reveal'){
        e.audio?.pause();
        els.weather04Video.pause();
        els.weather04Video.onloadeddata=null;
        w04StopVisuals();
        els.weather04Surface.style.opacity='0';
        els.weather04Stage.className='weather04-stage revealing burn-done';
        els.weather04VideoActions.classList.remove('hidden');
        els.weather04VideoPlay.classList.remove('hidden');
        els.weather04VideoPlay.textContent='REPRENDRE L’APPARITION';
      }
    }else if(e.phase==='choices')w04ResumeChoices();
  }
  function beginWeather04(item,preview,restoring=false){
    if(!item||item.id!=='meteo-004'||!eventSession.active
      ||currentMask05||currentMaskEvent||currentRadioEvent||currentRadio02
      ||currentWeatherEvent||specialAudioActive||anyBlockingModalOpen()
      ||document.visibilityState!=='visible'||!isPartieTabActive()
      ||state.value>=100||livingPlayerNumbers().length===0)return false;
    const pending=restoring?eventSession.pendingWeather:null;
    if(restoring&&(!pending||pending.id!=='meteo-004'))return false;
    if(!preview&&!restoring&&(eventSession.pendingWeather
      ||eventSession.played.includes(item.id)
      ||eventSession.weatherCount>=WEATHER_MAX_PER_GAME
      ||Date.now()<eventSession.nextWeatherEligibleAt))return false;
    if(preview&&eventSession.pendingWeather)return false;
    pauseAudioEventClock();
    const phase=pending?.stage||'intro',choice=pending?.choice||null;
    const path=phase==='intro'?item.introAudio
      :phase==='branch'?(choice==='cede'?item.cedeAudio:item.resistAudio):null;
    const audio=path?new Audio(path):null;
    if(audio){audio.preload='auto';audio.volume=1;}
    currentWeatherEvent={
      is04:true,isWeather04:true,item,preview,token:++weatherEventToken,
      phase,choice,audio,loop:null,timer:null,deadline:0,
      remainingMs:Number.isFinite(pending?.remainingMs)
        ?Math.max(0,Math.min(WEATHER04_DURATION,pending.remainingMs))
        :WEATHER04_DURATION,
      applied:pending?.rewardApplied===true,completed:false,
      videoAutoplayBlocked:false,videoError:false,
      savedPreviewDelay:eventSession.remainingMs
    };
    if(!preview&&!restoring){
      eventSession.played.push(item.id);
      eventSession.weatherCount=Math.min(WEATHER_MAX_PER_GAME,eventSession.weatherCount+1);
      eventSession.remainingMs=null;
      w04Save('intro');
    }
    els.weather04Stage.className='weather04-stage intro';
    els.weather04Surface.style.removeProperty('opacity');
    els.weather04Surface.style.removeProperty('mask-image');
    els.weather04Surface.style.removeProperty('-webkit-mask-image');
    els.weather04Surface.style.removeProperty('pointer-events');
    els.weather04Surface.style.removeProperty('transition');
    els.weather04Panel.style.removeProperty('opacity');
    els.weather04Panel.style.removeProperty('mask-image');
    els.weather04Panel.style.removeProperty('-webkit-mask-image');
    els.weather04Status.textContent='Une sensation inconnue traverse la ville…';
    for(const id of ['weather04Choices','weather04Result','weather04Done',
      'weather04Play','weather04Skip','weather04VideoActions','weather04Sound'])
      els[id].classList.add('hidden');
    els.weather04VideoPlay.classList.remove('hidden');
    els.weather04Overlay.classList.add('show');
    els.weather04Overlay.setAttribute('aria-hidden','false');
    specialAudioActive=true;silenceHauntSounds();syncAmbientVolume();renderEventControls();
    if(restoring){
      if(phase==='choices')w04Choices(true);
      else if(phase==='reveal')w04Reveal(true);
      else if(phase==='result')weather04Result();
      else w04Fallback('Reprenez le récit interrompu.');
    }else weather04PlayNarration();
    return true;
  }

  function getWeatherItem(id) {
    return AUDIO_EVENTS.find(item => item.type === 'meteo' && item.id === id);
  }

  function getWeatherResultValue(item, before, fromReflet) {
    // La Fracture du Réel force le passage d'un monde à l'autre :
    // 55 % depuis le normal, 45 % depuis le Reflet, sans +5 % météo.
    if (item.id === 'meteo-003') return fromReflet ? 45 : 55;
    return clamp(before + item.delta, 0, 100);
  }

  function dismissWeatherEvent(immediate = false) {
    if (currentWeatherEvent?.isWeather04) weather04CleanUp();
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
    if (item?.id === 'meteo-004') return beginWeather04(item, preview, restoring);
    if (!item || item.type !== 'meteo' || !eventSession.active
      || currentMask05 || currentMaskEvent || currentRadioEvent || currentWeatherEvent
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
    // Le monde est figé dès le tirage, et conservé si la page est rechargée.
    const savedOrigin = restoring ? eventSession.pendingWeather?.fromReflet : null;
    const fromReflet = typeof savedOrigin === 'boolean' ? savedOrigin : isReflet();
    const audioPath = item.id === 'meteo-003'
      ? (fromReflet ? item.audioReflet : item.audioNormal) : item.audio;
    const audio = new Audio(audioPath);
    audio.preload = 'auto';
    audio.volume = 1;
    currentWeatherEvent = {
      item, preview, restoring, token, audio, fromReflet, completed: false,
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
        fromReflet, gameOver: false
      };
      eventSession.remainingMs = null;
    }
    saveAudioEventSession();

    // Aucun nom ni pictogramme propre au phénomène avant la narration.
    // Le nom technique reste réservé aux contrôles du mode test.
    els.weatherEventSymbol.textContent = '◇';
    els.weatherEventHeading.textContent = item.id === 'meteo-003'
      ? 'ANOMALIE SISMIQUE' : 'PERTURBATION ATMOSPHÉRIQUE';
    els.weatherEventStatus.textContent = item.id === 'meteo-003'
      ? 'Une anomalie se manifeste sous vos pieds…'
      : 'L’atmosphère semble se déformer…';
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
          applyInstabilityDelta(pending.after - pending.before, {
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
    const isFracture = running.item.id === 'meteo-003';
    els.weatherEventStatus.textContent = isFracture
      ? (running.fromReflet
        ? 'Vous revenez de force dans le monde normal.'
        : 'Vous basculez de force dans le Reflet du Vice.')
      : 'Le phénomène se dissipe, mais son empreinte demeure.';
    els.weatherEventEffect.textContent = 'Instabilité mentale';
    els.weatherEventChange.textContent = change + ' %';
    els.weatherEventValues.classList.toggle('fracture-values', isFracture);
    els.weatherEventValues.textContent = isFracture
      ? '(' + before + ' % → ' + after + ' %)'
      : before + ' % → ' + after + ' %'
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
    const after = getWeatherResultValue(running.item, before, running.fromReflet);

    if (!running.preview) {
      // L'intention de modifier la jauge est enregistrée avant l'application.
      // Une reprise ne peut donc pas donner deux fois les points.
      eventSession.pendingWeather = {
        id: running.item.id, stage: 'result', before, after,
        fromReflet: running.fromReflet, gameOver: after >= 100
      };
      eventSession.nextWeatherEligibleAt = Date.now() + WEATHER_MIN_GAP_MS;
      saveAudioEventSession();
    }

    const effect = applyInstabilityDelta(after - before, {
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
      : randomAudioDelay();
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

    if (!resumePendingMaskIntroIfPossible()
      && !resumePendingMask05IfPossible()
      && !resumePendingMask06IfPossible()
      && !resumePendingMask07IfPossible()
      && !resumePendingRadio02IfPossible()
      && !resumePendingRadio03IfPossible()
      && !resumePendingRadio04IfPossible()
      && !resumePendingRadio05IfPossible()
      && !resumePendingWeatherIfPossible()) {
      updateAudioEventClock();
    }

    if (
      state.musicOn
    ) {
      setMusic(true);
    }

    if (
      state.value >= 100 && !currentWeatherEvent && !currentRadio02
      && !currentRadio03 && !currentRadio04 && !currentRadio05 && !currentMask05 && !currentMask06 && !currentMask07
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
    els.btnEffects.addEventListener('click', openEffectsModal);
    els.effectsClose.addEventListener('click', closeEffectsModal);
    els.effectsModal.addEventListener('click', e => {
      if (e.target === els.effectsModal) closeEffectsModal();
    });
    els.effectsPreset.addEventListener('click', () =>
      setTemporaryEffect('equipements', 'Équipements et Objets inutilisables', 2));
    els.effectsCoin.addEventListener('click', openManualCoin);
    els.effectsForm.addEventListener('submit', e => {
      e.preventDefault();
      addManualEffect();
    });
    els.effectsAdvance.addEventListener('click', advanceTemporaryEffects);
    els.effectsUndo.addEventListener('click', undoTemporaryEffects);
    els.weather04Resist.addEventListener('click', () => weather04Choose('resist'));
    els.weather04Cede.addEventListener('click', () => weather04Choose('cede'));
    els.weather04Sound.addEventListener('click', weather04TryChoiceAudio);
    els.weather04Play.addEventListener('click', weather04PlayNarration);
    els.weather04Skip.addEventListener('click', weather04SkipNarration);
    els.weather04Done.addEventListener('click', weather04Complete);
    els.weather04VideoPlay.addEventListener('click', weather04TryVideo);
    els.weather04VideoSkip.addEventListener('click', weather04Result);

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
    els.btnPlayers.addEventListener('click', () => openPlayersModal());
    els.btnAdmin.addEventListener('click', openAdminModal);
    els.adminClose.addEventListener('click', closeAdminModal);
    els.adminModal.addEventListener('click', e => {
      if (e.target === els.adminModal) closeAdminModal();
    });
    els.adminPassword.addEventListener('keydown', e => {
      if (e.key === 'Enter') unlockAdmin();
    });
    els.adminUnlock.addEventListener('click', unlockAdmin);
    els.adminSave.addEventListener('click', saveAdminConfig);
    els.adminDefaults.addEventListener('click', restoreAdminDefaults);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && els.adminModal.classList.contains('show')) {
        closeAdminModal();
      }
    });
    els.playersClose.addEventListener('click', () => closePlayersModal());
    els.playersConfirm.addEventListener('click', confirmIntroNames);
    els.testMaskEventSelect.addEventListener('change', renderEventControls);
    els.btnTestMaskEvent.addEventListener('click', forceAdminAudioEvent);
    els.maskEventPlay.addEventListener('click', resumeMaskEventAudio);
    els.maskIntroSkip.addEventListener('click', advanceMaskIntroduction);
    els.maskChoiceSelf.addEventListener('click', () => chooseMaskSacrifice('self'));
    els.maskChoiceGroup.addEventListener('click', () => chooseMaskSacrifice('group'));
    els.maskEventDone.addEventListener('click', completeMaskEvent);
    els.maskDuelStart.addEventListener('click', startMaskDuel);
    els.maskDuelLoss1.addEventListener('click', () => resolveMaskDuel('first'));
    els.maskDuelLoss2.addEventListener('click', () => resolveMaskDuel('second'));
    els.maskDuelSuccess.addEventListener('click', () => resolveMaskDuel('both'));
    els.maskDuelSkipAudio.addEventListener('click', skipMaskDuelReaction);
    els.mask05Private.addEventListener('click', startMask05Secret);
    els.mask05Start.addEventListener('click', startMask05Mission);
    els.mask05Success.addEventListener('click', () => resolveMask05('success'));
    els.mask05Failure.addEventListener('click', () => resolveMask05('failure'));
    els.mask05Play.addEventListener('click', resumeMask05Audio);
    els.mask05Skip.addEventListener('click', skipMask05Audio);
    els.mask05Done.addEventListener('click', completeMask05);
    els.mask06Yes.addEventListener('click', () => chooseMask06('yes'));
    els.mask06No.addEventListener('click', () => chooseMask06('no'));
    els.mask06Play.addEventListener('click', resumeMask06Audio);
    els.mask06Skip.addEventListener('click', skipMask06BrokenAudio);
    els.mask06Done.addEventListener('click', completeMask06);
    els.mask07Primary.addEventListener('click', () => mask07Choose('primary'));
    els.mask07Secondary.addEventListener('click', () => mask07Choose('secondary'));
    els.mask07Confirm.addEventListener('click', () => mask07Choose('confirm'));
    els.mask07Play.addEventListener('click', mask07ResumeAudio);
    els.mask07Skip.addEventListener('click', mask07SkipAudio);
    els.coinStart.addEventListener('click', flipCoin);
    els.coinDone.addEventListener('click', completeCoin);

    els.radioMissionToggle.addEventListener('click', toggleRadioMissionPanel);
    els.radioMissionArrived.addEventListener('click', radioMissionArrived);
    els.radioMissionAbandon.addEventListener('click', abandonRadioMission);
    els.radioEventPlay.addEventListener('click', playRadioEventAudio);
    els.radioEventSkip.addEventListener('click', skipRadioAudio);
    els.radioEventAccept.addEventListener('click', () => answerRadioCall(true));
    els.radioEventIgnore.addEventListener('click', () => answerRadioCall(false));
    els.radioEventDone.addEventListener('click', finishRadioResolution);
    els.radio02Answer.addEventListener('click', () => chooseRadio02('answer'));
    els.radio02Cut.addEventListener('click', () => chooseRadio02('cut'));
    els.radio02Play.addEventListener('click', playRadio02Audio);
    els.radio02Skip.addEventListener('click', skipRadio02Audio);
    els.radio02Done.addEventListener('click', completeRadio02);
    els.radio03Undo.addEventListener('click', radio03Undo);
    els.radio03Confirm.addEventListener('click', radio03Submit);
    els.radio03Play.addEventListener('click', radio03ResumeAudio);
    els.radio03Cancel.addEventListener('click', radio03CancelWithoutPenalty);
    els.radio03Done.addEventListener('click', radio03Complete);
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
          if (document.visibilityState === 'visible'
            && eventSession.introPhase && !currentMaskEvent
            && !playersIntroMode) {
            resumePendingMaskIntroIfPossible();
          }
        }
      );

    window.addEventListener('pagehide', () => {
      pauseAudioEventClock();
      radio03OnPageHide();
      radio04OnPageHide();
      radio05OnPageHide();
      mask06OnPageHide();
      mask07OnPageHide();
      coinOnPageHide();
    });

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

          if (els.effectsModal.classList.contains('show')) {
            closeEffectsModal();
            return;
          }
          if (els.playersModal.classList.contains('show')) {
            if (!playersIntroMode) closePlayersModal();
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

    renderTemporaryEffects();
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
