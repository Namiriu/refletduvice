const CACHE = 'instability-v38';

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',

  './icons/icon-192.png',

  './img/bg.webp',

  // Masques d'Instabilité
  './img/masque0.png',
  './img/masque15.png',
  './img/masque25.png',
  './img/masque40.png',
  './img/masque50.png',
  './img/masque65.png',
  './img/masque75.png',
  './img/masque90.png',

  // Boutons Instabilité
  './img/btn_moins5.png',
  './img/btn_plus5.png',
  './img/btn_moins10.png',
  './img/btn_plus10.png',
  './img/btn_moins15.png',
  './img/btn_plus15.png',
  './img/btn_moins20.png',
  './img/btn_plus20.png',

  // Ambiance
  './audio/ambient_loop.mp3',
  './audio/groan.wav',

  // Actions spéciales
  './audio/ritual_resurrection.wav',
  './audio/camp_rest.wav',

  // Passage Monde normal / Reflet
  './audio/voice_enter_reflet.wav',
  './audio/voice_return_normal.mp3',

  // Sons hantés
  './audio/sounds/creepy_crow_caw.mp3',
  './audio/sounds/creepy_ghost_whisper.mp3',
  './audio/sounds/creepy_laugh.mp3',
  './audio/sounds/creepy_wind.mp3',
  './audio/sounds/door_slam_angrily.mp3',
  './audio/sounds/footsteps_on_wooden_floor.mp3',
  './audio/sounds/forest_whisper.mp3',
  './audio/sounds/scratching_metal.mp3',
  './audio/sounds/whisper_voices.mp3',
  './audio/sounds/wood_creak_single.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request);
      })
  );
});
