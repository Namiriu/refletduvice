// Basic offline cache; requires HTTPS or localhost to activate
const CACHE = 'instability-v33';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './audio/ambient_loop.mp3',
  './audio/groan.wav'
  './img/bg.webp',
  './img/gauge_fill.png',
  './img/gauge_track.png',
  './img/btn_plus1.png',
  './img/btn_plus2.png',
  './img/btn_plus3.png',
  './img/btn_plus5.png',
  './img/btn_plus10.png',
  './img/btn_plus20.png',
  './img/btn_moins1.png',
  './img/btn_moins2.png',
  './img/btn_moins3.png',
  './img/btn_moins5.png',
  './img/btn_moins10.png',
  './img/btn_moins20.png',
  './audio/sounds/creepy_crow_caw.mp3',
  './audio/sounds/creepy_ghost_whisper.mp3',
  './audio/sounds/creepy_laugh.mp3',
  './audio/sounds/creepy_wind.mp3',
  './audio/sounds/door_slam_angrily.mp3',
  './audio/sounds/footsteps_on_wooden_floor.mp3',
  './audio/sounds/forest_whisper.mp3',
  './audio/sounds/scratching_metal.mp3',
  './audio/sounds/whisper_voices.mp3',
  './audio/sounds/wood_creak_single.mp3',
  './audio/voice_enter_reflet.wav',
  './audio/voice_return_normal.mp3'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null)))
  );
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(res=>res || fetch(e.request))
  );
});
