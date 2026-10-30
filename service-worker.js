const CACHE = 'instability-v69';
const RUNTIME_CACHE = 'instability-runtime-v1';

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './bestiaire-data.js',
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
  './img/icon-sac-a-dos.svg',

  // Boutons Instabilité
  './img/btn_moins5.png',
  './img/btn_plus5.png',
  './img/btn_moins10.png',
  './img/btn_plus10.png',
  './img/btn_moins15.png',
  './img/btn_plus15.png',
  './img/btn_moins20.png',
  './img/btn_plus20.png',

// Bestiaire — 35 cartes fixes disponibles hors ligne
'./bestiaire/images/fletris-chien.png',
'./bestiaire/images/mannequin-desarticule.png',
'./bestiaire/images/enfant-grotesque.png',
'./bestiaire/images/fillette-sans-paupieres.png',
'./bestiaire/images/ventriloque-muet.png',
'./bestiaire/images/infirmier-trepane.png',
'./bestiaire/images/educatrice-figee.png',
'./bestiaire/images/porte-reserve.png',
'./bestiaire/images/publicite-vivante.png',
'./bestiaire/images/presence-assise.png',
'./bestiaire/images/chambre-inversee.png',
'./bestiaire/images/maria-la-couturiere-suspendue.png',
'./bestiaire/images/repetition.png',
'./bestiaire/images/suspendu.png',
'./bestiaire/images/nuee.png',
'./bestiaire/images/restes-dexpedition.png',
'./bestiaire/images/marinade.png',
'./bestiaire/images/croque-vase.png',
'./bestiaire/images/rampemort.png',
'./bestiaire/images/trancherelle.png',
'./bestiaire/images/echo-de-lheure-de-pointe.png',
'./bestiaire/images/code-13.png',
'./bestiaire/images/moniteur-dordre.png',
'./bestiaire/images/protocole.png',
'./bestiaire/images/declasse.png',
'./bestiaire/images/madame-registre.png',
'./bestiaire/images/densite-amnesique.png',
'./bestiaire/images/assemblage-visceral.png',
'./bestiaire/images/employe-surgele.png',
'./bestiaire/images/attroupement-necrose.png',
'./bestiaire/images/gardienne-du-vice.png',
'./bestiaire/images/tour-controle-ferroviaire.png',
'./bestiaire/images/siffle-circuit.png',
'./bestiaire/images/recuperateur-voile.png',
'./bestiaire/images/fetard-en-retard.png',

  // Bestiaire — 35 narrations disponibles hors ligne
'./bestiaire/audio/fletris-chien.mp3',
'./bestiaire/audio/mannequin-desarticule.mp3',
'./bestiaire/audio/enfant-grotesque.mp3',
'./bestiaire/audio/fillette-sans-paupieres.mp3',
'./bestiaire/audio/ventriloque-muet.mp3',
'./bestiaire/audio/infirmier-trepane.mp3',
'./bestiaire/audio/educatrice-figee.mp3',
'./bestiaire/audio/porte-reserve.mp3',
'./bestiaire/audio/publicite-vivante.mp3',
'./bestiaire/audio/presence-assise.mp3',
'./bestiaire/audio/chambre-inversee.mp3',
'./bestiaire/audio/maria-la-couturiere-suspendue.mp3',
'./bestiaire/audio/repetition.mp3',
'./bestiaire/audio/suspendu.mp3',
'./bestiaire/audio/nuee.mp3',
'./bestiaire/audio/restes-dexpedition.mp3',
'./bestiaire/audio/marinade.mp3',
'./bestiaire/audio/croque-vase.mp3',
'./bestiaire/audio/rampemort.mp3',
'./bestiaire/audio/trancherelle.mp3',
'./bestiaire/audio/echo-de-lheure-de-pointe.mp3',
'./bestiaire/audio/code-13.mp3',
'./bestiaire/audio/moniteur-dordre.mp3',
'./bestiaire/audio/protocole.mp3',
'./bestiaire/audio/declasse.mp3',
'./bestiaire/audio/madame-registre.mp3',
'./bestiaire/audio/densite-amnesique.mp3',
'./bestiaire/audio/assemblage-visceral.mp3',
'./bestiaire/audio/employe-surgele.mp3',
'./bestiaire/audio/attroupement-necrose.mp3',
'./bestiaire/audio/gardienne-du-vice.mp3',
'./bestiaire/audio/tour-controle-ferroviaire.mp3',
'./bestiaire/audio/siffle-circuit.mp3',
'./bestiaire/audio/recuperateur-voile.mp3',
'./bestiaire/audio/fetard-en-retard.mp3',

  // Introduction : le Masque accueille les joueurs au lancement
  './audio/events/masque/introduction/masque-000-presentation.mp3',

  // Événements audio — Le Masque (prototype hors connexion)
  './audio/events/masque/designations/joueur-1.mp3',
  './audio/events/masque/designations/joueur-2.mp3',
  './audio/events/masque/designations/joueur-3.mp3',
  './audio/events/masque/designations/joueur-4.mp3',
  './audio/events/masque/interventions/masque-001-collectionneur.mp3',

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
            .filter(
              key =>
                key !== CACHE &&
                key !== RUNTIME_CACHE
            )
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
    event.respondWith(
      handleRangeRequest(
        event.request,
        range
      )
    );

    return;
  }

  // L'interface évolue souvent en playtest : utiliser la dernière version
  // de la page et du script dès qu'un réseau est disponible.
  // Conserver un repli hors ligne pour la PWA installée.
  const path = new URL(event.request.url);
  const shell = path.origin === self.location.origin
    && (event.request.mode === 'navigate'
      || path.pathname.endsWith('/app.js')
      || path.pathname.endsWith('/index.html'));

  if (shell) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request, { cache: 'no-store' });
        if (fresh.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, fresh.clone());
        }
        return fresh;
      } catch (_) {
        return (await caches.match(event.request))
          || (await caches.match('./index.html'))
          || Response.error();
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      cachedResponse => cachedResponse || fetch(event.request)
    )
  );
});

async function handleRangeRequest(
  request,
  rangeHeader
) {
  const cachedResponse =
    await caches.match(
      request.url
    );

  if (!cachedResponse) {
    return fetch(request);
  }

  const buffer =
    await cachedResponse.arrayBuffer();

  const size =
    buffer.byteLength;

  const match =
    /^bytes=(\d*)-(\d*)$/i.exec(
      rangeHeader
    );

  if (!match) {
    return new Response(
      null,
      {
        status: 416,
        headers: {
          'Content-Range':
            `bytes */${size}`
        }
      }
    );
  }

  let start;
  let end;

  if (match[1] === '') {
    const suffixLength =
      Number(match[2]);

    if (!suffixLength) {
      return new Response(
        null,
        {
          status: 416,
          headers: {
            'Content-Range':
              `bytes */${size}`
          }
        }
      );
    }

    start =
      Math.max(
        0,
        size - suffixLength
      );

    end =
      size - 1;
  }

  else {
    start =
      Number(match[1]);

    end =
      match[2] === ''
        ? size - 1
        : Math.min(
            Number(match[2]),
            size - 1
          );
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return new Response(
      null,
      {
        status: 416,
        headers: {
          'Content-Range':
            `bytes */${size}`
        }
      }
    );
  }

  const slicedBuffer =
    buffer.slice(
      start,
      end + 1
    );

  const headers =
    new Headers();

  headers.set(
    'Content-Type',
    cachedResponse.headers.get(
      'Content-Type'
    ) || 'application/octet-stream'
  );

  headers.set(
    'Accept-Ranges',
    'bytes'
  );

  headers.set(
    'Content-Range',
    `bytes ${start}-${end}/${size}`
  );

  headers.set(
    'Content-Length',
    String(
      slicedBuffer.byteLength
    )
  );

  return new Response(
    slicedBuffer,
    {
      status: 206,
      statusText:
        'Partial Content',
      headers
    }
  );
}
