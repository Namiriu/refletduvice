// =========================================================
// RdV Companion — Service Worker
// v0.7 Playtest
// =========================================================

const CACHE = 'instability-v35';


const ASSETS = [

  // Application
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',


  // Icônes PWA
  './icons/icon-192.png',
  './icons/icon-512.png',


  // Fond
  './img/bg.webp',


  // Masque d'instabilité
  './img/masque0.png',


  // Boutons positifs
  './img/btn_plus5.png',
  './img/btn_plus10.png',
  './img/btn_plus15.png',
  './img/btn_plus20.png',


  // Boutons négatifs
  './img/btn_moins5.png',
  './img/btn_moins10.png',
  './img/btn_moins15.png',
  './img/btn_moins20.png',


  // Musique
  './audio/ambient_loop.mp3',


  // Audio existant
  './audio/groan.wav',


  // Effets sonores hantés
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


  // Voix passage Normal ↔ Reflet
  './audio/voice_enter_reflet.wav',
  './audio/voice_return_normal.mp3'

];


// =========================================================
// INSTALLATION
// =========================================================

self.addEventListener('install', event => {

  event.waitUntil(

    caches
      .open(CACHE)

      .then(cache => {

        return cache.addAll(
          ASSETS
        );

      })

      .then(() => {

        /*
          Active immédiatement la nouvelle version
          du Service Worker sans attendre la fermeture
          complète de l'ancienne PWA.
        */

        return self.skipWaiting();

      })

  );

});


// =========================================================
// ACTIVATION
// =========================================================

self.addEventListener('activate', event => {

  event.waitUntil(

    caches
      .keys()

      .then(keys => {

        return Promise.all(

          keys.map(key => {

            /*
              Supprime tous les anciens caches.

              Exemple :
              instability-v34
                    ↓
                supprimé
            */

            if (key !== CACHE) {

              return caches.delete(
                key
              );

            }

            return null;

          })

        );

      })

      .then(() => {

        /*
          Le nouveau Service Worker prend immédiatement
          le contrôle des pages déjà ouvertes.
        */

        return self.clients.claim();

      })

  );

});


// =========================================================
// FETCH / MODE HORS-LIGNE
// =========================================================

self.addEventListener('fetch', event => {

  /*
    On ne gère que les requêtes GET.
  */

  if (event.request.method !== 'GET') {

    return;

  }


  event.respondWith(

    caches
      .match(
        event.request
      )

      .then(cachedResponse => {

        /*
          Si le fichier existe dans le cache,
          on l'utilise.
        */

        if (cachedResponse) {

          return cachedResponse;

        }


        /*
          Sinon, récupération normale depuis Internet.
        */

        return fetch(
          event.request
        );

      })

  );

});
