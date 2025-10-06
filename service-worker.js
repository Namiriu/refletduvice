// Basic offline cache; requires HTTPS or localhost to activate
const CACHE = 'instability-v11';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './audio/ambient_loop.wav',
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
  './img/btn_moins20.png'
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
