const CACHE = 'instability-v39';

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

  const range = event.request.headers.get('range');

  if (range) {
    event.respondWith(handleRangeRequest(event.request, range));
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
  );
});

async function handleRangeRequest(request, rangeHeader) {
  const cachedResponse = await caches.match(request.url);

  if (!cachedResponse) {
    return fetch(request);
  }

  const buffer = await cachedResponse.arrayBuffer();
  const size = buffer.byteLength;

  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader);

  if (!match) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${size}`
      }
    });
  }

  let start;
  let end;

  if (match[1] === '') {
    const suffixLength = Number(match[2]);

    if (!suffixLength) {
      return new Response(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${size}`
        }
      });
    }

    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === ''
      ? size - 1
      : Math.min(Number(match[2]), size - 1);
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${size}`
      }
    });
  }

  const slicedBuffer = buffer.slice(start, end + 1);

  const headers = new Headers();

  headers.set(
    'Content-Type',
    cachedResponse.headers.get('Content-Type') || 'application/octet-stream'
  );

  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(slicedBuffer.byteLength));

  return new Response(slicedBuffer, {
    status: 206,
    statusText: 'Partial Content',
    headers
  });
}
