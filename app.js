(() => {
  'use strict';

  // =========================================================
  // CONFIGURATION
  // =========================================================

  const STEPS = [5, 10, 15, 20];
  const THRESHOLD = 50;
  const VERSION = 'v0.9.1 Playtest';
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
  let deferredInstallPrompt = null;

  let maskInitialized = false;
  let currentMaskMin = null;
  let pendingMaskMin = null;
  let maskRequestToken = 0;

  const preloadedMasks = new Map();

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

function syncAmbientVolume() {
  fadeAudioVolume(
    els.ambient,
    specialAudioActive
      ? DUCK_VOLUME
      : AMBIENT_VOLUME
  );

  fadeAudioVolume(
    els.bestiaireAmbient,
    getBestiaireAmbientTargetVolume()
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
      total === 1
        ? '1 créature recensée'
        : `${total} créatures recensées`;
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

    const shown =
      normalizedQuery
        ? all.filter(
            creature =>
              normalizeSearch(
                creature.name
              ).includes(
                normalizedQuery
              )
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
      shown.length,
      all.length,
      normalizedQuery
    );

    for (
      const creature
      of shown
    ) {
      els.bestiaireList
        .appendChild(
          buildCreatureEntry(
            creature
          )
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
  if (!state.musicOn) {
    await Promise.all([
      fadeAudioVolume(
        els.ambient,
        0,
        AUDIO_SWITCH_FADE_MS
      ),

      fadeAudioVolume(
        els.bestiaireAmbient,
        0,
        AUDIO_SWITCH_FADE_MS
      )
    ]);

    els.ambient.pause();
    els.bestiaireAmbient.pause();

    return;
  }

  const bestiaireActive =
    isBestiaireTabActive();

  const activeAudio =
    bestiaireActive
      ? els.bestiaireAmbient
      : els.ambient;

  const inactiveAudio =
    bestiaireActive
      ? els.ambient
      : els.bestiaireAmbient;

  const activeTarget =
    bestiaireActive
      ? getBestiaireAmbientTargetVolume()
      : (
          specialAudioActive
            ? DUCK_VOLUME
            : AMBIENT_VOLUME
        );

  if (!inactiveAudio.paused) {
    await fadeAudioVolume(
      inactiveAudio,
      0,
      AUDIO_SWITCH_FADE_MS
    );

    inactiveAudio.pause();
  }

  if (!activeAudio.paused) {
    fadeAudioVolume(
      activeAudio,
      activeTarget
    );

    return;
  }

  activeAudio.volume =
    0;

  try {
    await activeAudio.play();

    await fadeAudioVolume(
      activeAudio,
      activeTarget
    );
  }

  catch (_) {}
}

async function setMusic(
  on
) {
  state.musicOn =
    on;

  save();

  await syncMusicForActiveTab();

  render();
}

function unlockAmbientOnce() {
  if (state.musicOn) {
    syncMusicForActiveTab();
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

    els.audioToggle
      .addEventListener(
        'click',
        () =>
          setMusic(
            !state.musicOn
          )
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
          if (
            document.visibilityState
            === 'visible'
          ) {
            requestWakeLock();
          }
        }
      );

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
