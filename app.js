(() => {
  'use strict';

  // ---------- Configuration ----------
  const STEPS = [5, 10, 15, 20];
  const LSK = key => `jds_${key}`;
  const VERSION = 'v0.7.2 Playtest';
  const THRESHOLD = 50;
  const AMBIENT_VOLUME = 0.55;

  const PASSPHRASE_HASH =
    'sha256:779d99b88c773f38617d286974f7882cbbc7f91781ef98287c55a5e89ea09e9f';

  const GATE_KEY = 'playtest_gate_hash';

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

  const MASK_STATES = [
    { min: 0, src: 'img/masque0.png' }

    // Plus tard :
    // { min: 25, src: 'img/masque25.png' },
    // { min: 50, src: 'img/masque50.png' },
    // { min: 75, src: 'img/masque75.png' },
    // { min: 100, src: 'img/masque100.png' }
  ];

  // ---------- DOM ----------
  const $ = id => document.getElementById(id);

  const els = {
    appMain: $('appMain'),

    percent: $('percent'),
    subjectId: $('subjectId'),
    maskImage: $('maskImage'),
    instabilityButtons: $('instabilityButtons'),

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

  // ---------- État ----------
  const clamp = (n, min, max) =>
    Math.min(max, Math.max(min, n));

  const readInt = (key, fallback) => {
    const value = Number.parseInt(
      localStorage.getItem(LSK(key)),
      10
    );

    return Number.isFinite(value)
      ? value
      : fallback;
  };

  const readBool = (key, fallback) => {
    const value =
      localStorage.getItem(LSK(key));

    return value === null
      ? fallback
      : value === 'true';
  };

  const state = {
    value: clamp(
      readInt('instability', 0),
      0,
      100
    ),

    subjectNumber: Math.max(
      1,
      readInt('subjectNumber', 1)
    ),

    musicOn:
      readBool('musicOn', false),

    ritualUsed: clamp(
      readInt('ritualUsed', 0),
      0,
      2
    ),

    /*
      Migration automatique :
      l'ancienne version pouvait encore avoir
      campLeft = 3 en localStorage.
      On le limite maintenant à 2.
    */
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
  let wakeLock = null;
  let appStarted = false;
  let specialAudioActive = false;
  let deferredInstallPrompt = null;

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

  // ---------- Boutons d'Instabilité ----------
  function buildInstabilityButtons() {
    els.instabilityButtons.innerHTML = '';

    for (const step of STEPS) {
      for (const delta of [-step, step]) {
        const minus = delta < 0;

        const btn =
          document.createElement('button');

        btn.type = 'button';
        btn.className = 'instability-btn';
        btn.dataset.delta = String(delta);

        btn.setAttribute(
          'aria-label',
          `${minus ? 'Réduire' : 'Augmenter'} l'instabilité de ${step} %`
        );

        const img =
          document.createElement('img');

        img.src =
          `img/btn_${minus ? 'moins' : 'plus'}${step}.png`;

        img.alt =
          `${minus ? '−' : '+'}${step} %`;

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

  // ---------- Masque ----------
  function updateMask() {
    const mask =
      [...MASK_STATES]
        .reverse()
        .find(
          item =>
            state.value >= item.min
        ) || MASK_STATES[0];

    if (
      els.maskImage.getAttribute('src')
      !== mask.src
    ) {
      els.maskImage.src = mask.src;
    }
  }

  // ---------- Rendu principal ----------
  function render() {
    els.percent.textContent =
      `${state.value}%`;

    els.subjectId.textContent =
      `SUJET #${String(
        state.subjectNumber
      ).padStart(2, '0')}`;

    els.ritualInfo.textContent =
      `Restants : ${2 - state.ritualUsed}/2`;

    els.campInfo.textContent =
      `Restants : ${state.campLeft}/2`;

    const gameOver =
      state.value >= 100;

    /*
      Profanation :
      uniquement dans le Reflet,
      2 utilisations maximum.
    */
    els.btnRitual.disabled =
      !isReflet()
      || state.ritualUsed >= 2
      || gameOver;

    /*
      Camp :
      disponible dans les deux mondes,
      tant qu'il reste des utilisations.
    */
    els.btnCamp.disabled =
      state.campLeft <= 0
      || gameOver;

    els.instabilityButtons
      .querySelectorAll(
        '.instability-btn'
      )
      .forEach(btn => {
        const delta =
          Number(btn.dataset.delta);

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

    els.vignette.style.opacity =
      state.value >= 90
        ? '1'
        : '0';

    updateMask();
    updateFullscreenButton();
    save();
  }

  // ---------- Journal ----------
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

    if (history.length > 50) {
      history.length = 50;
    }
  }

  function renderHistory() {
    els.historyList.innerHTML = '';

    if (!history.length) {
      const li =
        document.createElement('li');

      li.className =
        'journal-empty';

      li.textContent =
        'Aucune modification pour le moment.';

      els.historyList.appendChild(li);
      return;
    }

    for (const item of history) {
      const li =
        document.createElement('li');

      li.textContent =
        `${item.time} — ${item.source} : ${item.delta} → ${item.value} %`;

      els.historyList.appendChild(li);
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

  // ---------- Modale générique ----------
  function showInfo(
    title,
    text
  ) {
    pendingAction = null;

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

    els.actionModalClose.focus();
  }

  function showConfirm(
    title,
    text,
    onYes
  ) {
    pendingAction = onYes;

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

    els.actionModalYes.focus();
  }

  function closeActionModal() {
    pendingAction = null;

    els.actionModal
      .classList
      .remove('show');
  }

  // ---------- Modification Instabilité ----------
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

  // ---------- Passage Monde normal / Reflet ----------
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

    /*
      Temporairement au-dessus des modales.
      Important si le Camp fait repasser
      de 50% à 35%, par exemple.
    */
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
      setTimeout(() => {
        els.alert
          .classList
          .remove('show');

        els.alert.setAttribute(
          'aria-hidden',
          'true'
        );

        setTimeout(
          () => {
            els.alert.style.zIndex = '';
          },
          850
        );
      }, 5000);
  }

  // ---------- Effets visuels ----------
  function microEffect() {
    if (
      state.value < 60
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
      Math.random() < 0.45
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

Le personnage ressuscité revient avec 3 PV, ainsi qu’avec l’équipement qu’il possédait encore lors de sa mort. Les objets déjà récupérés par ses compagnons ne lui sont pas rendus.`;

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
    /*
      On revérifie la condition
      au moment de valider.
    */
    if (
      !isReflet()
      || state.ritualUsed >= 2
      || state.value >= 100
    ) {
      return;
    }

    /*
      L'utilisation est consommée
      dès que le rituel est accepté.
    */
    state.ritualUsed += 1;

    save();
    render();

    /*
      Son dédié :
      ritual_resurrection.wav
    */
    playSpecialAudio(
      els.ritualAudio,
      1
    );

    /*
      Le rituel ajoute automatiquement
      +10% d'Instabilité.
    */
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
      Si +10% fait atteindre 100%,
      la Fin de partie prend la priorité.
    */
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
      IMPORTANT :
      on mémorise le monde AVANT
      d'appliquer la réduction.

      Exemple :
      50% dans le Reflet
      → Camp
      → effet Reflet = -15%
      → jauge finale 35%.

      Le joueur n'obtient PAS les soins,
      même s'il revient ensuite
      dans le Monde normal.
    */
    const wasReflet =
      isReflet();

    state.campLeft -= 1;

    save();
    render();

    /*
      Son dédié :
      camp_rest.wav
    */
    playSpecialAudio(
      els.campAudio,
      0.95
    );

    /*
      Effet automatique :
      Normal = -10%
      Reflet = -15%
    */
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

  // ---------- Nouvelle partie ----------
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

    /*
      Nouveau numéro de sujet
      à chaque nouvelle partie.
    */
    state.subjectNumber += 1;

    history = [];
    gameOverShown = false;

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
      audio.currentTime = 0;
    }

    catch (_) {}
  }

  /*
    Lors d'un rituel ou d'un camp,
    la musique ambiante principale
    est presque entièrement abaissée
    pour laisser respirer le son spécial.
  */
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

    const restore = () => {
      specialAudioActive =
        false;

      if (state.musicOn) {
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

  async function setMusic(on) {
    state.musicOn = on;
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

  function randomBetween(
    min,
    max
  ) {
    return Math.floor(
      Math.random()
      * (max - min + 1)
    ) + min;
  }

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
      Math.random() < 0.85
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
          /*
            Pas d'événement aléatoire
            pendant le rituel / camp,
            devant le mot de passe,
            ou après la défaite.
          */
          if (
            !specialAudioActive
            && !els.gate
              .classList
              .contains('show')
            && state.value < 100
          ) {
            if (
              Math.random() < 0.60
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
    if (state.value < 100) {
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
      wakeLock = null;
    }
  }

  // =========================================================
  // ONGLETS
  // =========================================================

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

    for (const btn of buttons) {
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

    els.installBtn.addEventListener(
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

        hideInstallBanner(false);
      }
    );

    els.installClose.addEventListener(
      'click',
      () =>
        hideInstallBanner(true)
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

    if (state.musicOn) {
      setMusic(true);
    }

    if (state.value >= 100) {
      checkGameOver();
    }
  }

  // ---------- Événements ----------
  function bindEvents() {
    // Journal
    els.btnJournal.addEventListener(
      'click',
      openJournal
    );

    els.journalClose.addEventListener(
      'click',
      closeJournal
    );

    els.journalModal.addEventListener(
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

    // Mot de passe
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
            .textContent = '';
        }
      );

    /*
      Si la musique était enregistrée ON
      mais que le navigateur bloque
      l'autoplay, le premier toucher
      réessaiera de la lancer.
    */
    document.addEventListener(
      'pointerdown',
      unlockAmbientOnce,
      {
        once: true
      }
    );

    // Retour dans l'application
    document.addEventListener(
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

    // Échap ferme seulement
    // les modales non critiques.
    document.addEventListener(
      'keydown',
      event => {
        if (
          event.key !== 'Escape'
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

  // ---------- Initialisation ----------
  function init() {
    buildInstabilityButtons();
    setupTabs();
    bindEvents();
    setupInstallBanner();

    els.version.textContent =
      VERSION;

    els.ambient.volume =
      AMBIENT_VOLUME;

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
