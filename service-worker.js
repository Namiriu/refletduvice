// Basic offline cache; requires HTTPS or localhost to activate
const CACHE = 'instability-v3';
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
