const CACHE = 'instability-v77';
const MEDIA_CACHE = 'instability-media-v1';
const MEDIA_REVISIONS_KEY = './__rdv_media_revisions_v1__.json';
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
  './audio/events/masque/interventions/masque-002-elan-de-generosite.mp3',
  './audio/events/masque/interventions/masque-003-prix-du-sacrifice.mp3',
  // Première transmission radio : appel monté + résolution narrée
  './audio/events/radio/radio-001-derriere-la-porte.MP3',
  './audio/events/radio/radio-001-resolution-local-vide.mp3',

  // Météo — récits finalisés du narrateur avec sound design intégré
  './audio/events/meteo/meteo-001-pression-fantome.mp3',
  './audio/events/meteo/meteo-002-pluie-a-rebours.mp3',

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
/*
 * Les illustrations, musiques et narrations sont lourdes (≈ 110 Mio).
 * Une mise à jour du JavaScript ne doit pas les retélécharger.
 * Les révisions sont les SHA des objets GitHub de la branche de test.
 * Si un média change, sa révision doit être mise à jour lors du commit.
 */
const SHELL_ASSETS = [
  './',
  './index.html',
  './app.js',
  './bestiaire-data.js',
  './manifest.webmanifest',
  './icons/icon-192.png'
];
const MEDIA_ASSETS = ASSETS.filter(asset => !SHELL_ASSETS.includes(asset));
const MEDIA_REVISIONS = {
  "./img/bg.webp": "7147cd9081980c4577f2e3e0b6c1b082d269b9a3",
  "./img/masque0.png": "3866a6674214aeadaaad73a79d9929a90fc0d94c",
  "./img/masque15.png": "d8421c273f3efc14be9e493787a1b5a073c679ce",
  "./img/masque25.png": "d30022d47a617bebd7bd7c9be32751bc93c1f6a3",
  "./img/masque40.png": "aa8d95cc57c8c61794935fd64dda2aa9a46c29a8",
  "./img/masque50.png": "32eb82d4cc232f3a282bb1155d7717bafced8c6d",
  "./img/masque65.png": "394d58c4abe5b075e481f20a5861efa4181cdccc",
  "./img/masque75.png": "047e5d0b4bec6aeae47d222b359a382c5486ace3",
  "./img/masque90.png": "70c5160a5cceafc5ea380245d6090da0a7fcc3d0",
  "./img/icon-sac-a-dos.svg": "7bd86cdf6908dcb07aab9b7fe96ab5c242914adc",
  "./img/btn_moins5.png": "bc266bb683cc1c67d8e1612f8fd665f8172631f2",
  "./img/btn_plus5.png": "e0ca1b4352c22d14d1eebc316ec808a30664e82e",
  "./img/btn_moins10.png": "45c5ebb0ce601256bf835b13506877015c5a85e6",
  "./img/btn_plus10.png": "5ffbbc8913060a8d669c76bc3045a409930cdc4c",
  "./img/btn_moins15.png": "5ca0be90e12215b4eced7ea8334f4ae11abd899d",
  "./img/btn_plus15.png": "02e7a35a40ea08d276ab5a3f7bf7c96fbfe112c0",
  "./img/btn_moins20.png": "11795b47a22e36f971fdfd2f32ebd22c674f4ece",
  "./img/btn_plus20.png": "9865799717672e297f03944b111eed285307484f",
  "./bestiaire/images/fletris-chien.png": "7397598708c70d7df3a5134a6f7e6d9b5a64820f",
  "./bestiaire/images/mannequin-desarticule.png": "5a59408906071bed16c4d948a4b639aaede64dd4",
  "./bestiaire/images/enfant-grotesque.png": "678f91cd8e66b5b53d307343ab58aab6c2c97a5f",
  "./bestiaire/images/fillette-sans-paupieres.png": "3bfcc4e930683ec9873b6ca91ad6f4f92d05f3e5",
  "./bestiaire/images/ventriloque-muet.png": "efae519d971795c0f8a9bdcbcdf54c5a183a18da",
  "./bestiaire/images/infirmier-trepane.png": "e329cef6c951a6b1ab98bd90a2c14e9992683db9",
  "./bestiaire/images/educatrice-figee.png": "b18e8f1b5bb08f4b4a07c97ead59df93f83e57a5",
  "./bestiaire/images/porte-reserve.png": "5461208e5deee45110fd8bf499141fa0e66cdda3",
  "./bestiaire/images/publicite-vivante.png": "fc69ac8b6216f251a4eae41ec37759cceedcb201",
  "./bestiaire/images/presence-assise.png": "8ebd730758b06b494d979a83c9d8fe3c5caa7746",
  "./bestiaire/images/chambre-inversee.png": "3328dba43059356cb7120f8642a7498c3c731ab8",
  "./bestiaire/images/maria-la-couturiere-suspendue.png": "129c79eabea49bd9eb1e1966c309b29db355957c",
  "./bestiaire/images/repetition.png": "8e3453489599384fa4114fe48cb048c52f91f721",
  "./bestiaire/images/suspendu.png": "587579802e7d49ce97534cd8434936d56e8e51f8",
  "./bestiaire/images/nuee.png": "a5493be981dfade89d5a22faa50d73bca24afb3c",
  "./bestiaire/images/restes-dexpedition.png": "27b04dc6eef5f9b9ffb0fbf8745c284fd9a863ee",
  "./bestiaire/images/marinade.png": "a6dedc7f7abf052df1e82f1936681f9ac962026e",
  "./bestiaire/images/croque-vase.png": "211996815bbd82e2a2df4c18eb70080111f00a34",
  "./bestiaire/images/rampemort.png": "3000dd6128abd867410d405e0e1b366c591e2777",
  "./bestiaire/images/trancherelle.png": "9a82ad534a98087f4ecded1f2a6878e76a2c6e1e",
  "./bestiaire/images/echo-de-lheure-de-pointe.png": "b1137f12af75a9b1c8ec863abcc0cdadf90535f2",
  "./bestiaire/images/code-13.png": "3b78a1397a574a54198bea7e488c2d9125f12b16",
  "./bestiaire/images/moniteur-dordre.png": "d219c0f315f33e7ac5a8df4c5151b23a7bb2e780",
  "./bestiaire/images/protocole.png": "59972ff76b20a1903a10bb4ccfb6039fb8fd7389",
  "./bestiaire/images/declasse.png": "5ab5f24aad7b359264ac4d304169b116ce67f70d",
  "./bestiaire/images/madame-registre.png": "81eff15e2ed8460a45f880a9283d9f9be26553b5",
  "./bestiaire/images/densite-amnesique.png": "e1acd8005829b49c1925c11e52b33f3e01ffed00",
  "./bestiaire/images/assemblage-visceral.png": "17fd355fb6d4ae34cda8fda675a1e64b64bcf881",
  "./bestiaire/images/employe-surgele.png": "982361d61ec04b91da0b0d954856310d7b49987f",
  "./bestiaire/images/attroupement-necrose.png": "c23241433579203f1df628dae6dfcbee5d05a3a4",
  "./bestiaire/images/gardienne-du-vice.png": "3c2b931f43644695cae5b7c05eca649fb5b97e68",
  "./bestiaire/images/tour-controle-ferroviaire.png": "05421c0717a245cdf1ea396f6213512a4c73a872",
  "./bestiaire/images/siffle-circuit.png": "f9d7571903ecf41f679356e11995615170e6f8e2",
  "./bestiaire/images/recuperateur-voile.png": "0a657584134e77c042717e95d76d84567f87fe99",
  "./bestiaire/images/fetard-en-retard.png": "6e6687330c23a78bba82eccf959c234a245787f2",
  "./bestiaire/audio/fletris-chien.mp3": "67dce18c66674df2c8cc59814a827cf19331f117",
  "./bestiaire/audio/mannequin-desarticule.mp3": "6db7974456b4767ee09590d15b6481f14ae51a55",
  "./bestiaire/audio/enfant-grotesque.mp3": "22ef2f1e46c39edd5e64b63481af5d8f35165672",
  "./bestiaire/audio/fillette-sans-paupieres.mp3": "ba289d65a800909c9ff69f737d1a78c5d77c43cd",
  "./bestiaire/audio/ventriloque-muet.mp3": "d65eb964fe67ce3520b700f2eb097edf2c4aad25",
  "./bestiaire/audio/infirmier-trepane.mp3": "bcede08de5e09c4657276506029f3e071e6590d9",
  "./bestiaire/audio/educatrice-figee.mp3": "7dc7ee9e460f187176ba45c73a73933d7f86eafd",
  "./bestiaire/audio/porte-reserve.mp3": "9155b3356f774d54687ef38ca5bfc4381a67c71c",
  "./bestiaire/audio/publicite-vivante.mp3": "0cac9a01f0a3b94b0cb3518480fbd045c75fe0d6",
  "./bestiaire/audio/presence-assise.mp3": "c9838a83a30fc9b0c00a6e0093f2d78eb3e744d4",
  "./bestiaire/audio/chambre-inversee.mp3": "b33f9572cb49015cab6d89bdf5bbc09ae51cfdf7",
  "./bestiaire/audio/maria-la-couturiere-suspendue.mp3": "91cd59d18e76a66d37bbf7bad1cafe6e085eb777",
  "./bestiaire/audio/repetition.mp3": "25b0a4e0e41c0738b80ab2cce7bf0c06b2d5558b",
  "./bestiaire/audio/suspendu.mp3": "77bb330a3f0abc3ca17fdf1641b1a5f933649275",
  "./bestiaire/audio/nuee.mp3": "0ce192dd29082e45a226231b85b5ac904261b7a6",
  "./bestiaire/audio/restes-dexpedition.mp3": "85bad01b5c337a4e8c6a261476547ea9158fe7a0",
  "./bestiaire/audio/marinade.mp3": "a395871d310bada81165d4d8da4fabcf8c34f8d2",
  "./bestiaire/audio/croque-vase.mp3": "aa1c4b379ccc3d516160b19c81c4da8a1e306040",
  "./bestiaire/audio/rampemort.mp3": "4c249a12d5e26511655cdd901fa1f16f9d29ee92",
  "./bestiaire/audio/trancherelle.mp3": "80f23c047e0b9afead9e2c15f6acaa6fa7f1fe69",
  "./bestiaire/audio/echo-de-lheure-de-pointe.mp3": "8f87473fa9aa61734a154248120276a17ffc6761",
  "./bestiaire/audio/code-13.mp3": "8c848beb40a997353171764aed15c51c0ae135e7",
  "./bestiaire/audio/moniteur-dordre.mp3": "cde38f3668054897e909463ab8d86de985eff8dd",
  "./bestiaire/audio/protocole.mp3": "d99564b0b0002e704d4b88a38a117f79e6847d16",
  "./bestiaire/audio/declasse.mp3": "a47fb6a36b2d0bf3ea13d7bfe01f83ae6375bca2",
  "./bestiaire/audio/madame-registre.mp3": "843e5e5959e18093b0039d400c27058baf6bc38b",
  "./bestiaire/audio/densite-amnesique.mp3": "0883d336b728fc02e2a432691039880bf2e9c69a",
  "./bestiaire/audio/assemblage-visceral.mp3": "fc3fa0ed8e57331a15b4d15f76ebace0d08e4d52",
  "./bestiaire/audio/employe-surgele.mp3": "cb22df821ec41ca793f89ed1580cb0efbb853e2c",
  "./bestiaire/audio/attroupement-necrose.mp3": "25f32e6c224082aa75a4351cd7a7f2c6ee9e8789",
  "./bestiaire/audio/gardienne-du-vice.mp3": "77a50db5e89ab93c87298c7e54bfc3d515a6d6a9",
  "./bestiaire/audio/tour-controle-ferroviaire.mp3": "35ed5e4058a935ff410aaccf4b61daded9a4c780",
  "./bestiaire/audio/siffle-circuit.mp3": "c1340dec2cea3f89a0488c171839c66254709fea",
  "./bestiaire/audio/recuperateur-voile.mp3": "b4a1a15cabccf19aad38ac7e66d43d8c9ed7b70a",
  "./bestiaire/audio/fetard-en-retard.mp3": "9bf2b09ac7816827f5eb545ff67770c1d34a2a2b",
  "./audio/events/masque/introduction/masque-000-presentation.mp3": "5dde4364c827f9700cc5062a821a18c8302e9b79",
  "./audio/events/masque/designations/joueur-1.mp3": "2b70bd19bcf7eda179aaf5a0162509e4d786a64e",
  "./audio/events/masque/designations/joueur-2.mp3": "4fb296f619239c4232037eab2ad1a104a94e8137",
  "./audio/events/masque/designations/joueur-3.mp3": "426ec5df304a3c851a225c85bb83affd64bc0a9d",
  "./audio/events/masque/designations/joueur-4.mp3": "41b4cbfc07627def6010f07a6494c29079ce0cd8",
  "./audio/events/masque/interventions/masque-001-collectionneur.mp3": "24e2377d6b74a9d71151e067f0a8e99c6981bcdf",
  "./audio/events/masque/interventions/masque-002-elan-de-generosite.mp3": "9ba126b121b272bcca8f6b21d02d3e8450222866",
  "./audio/events/masque/interventions/masque-003-prix-du-sacrifice.mp3": "c3cfbb27d1f3a1038a1358e075e8416c28bba697",
  "./audio/events/radio/radio-001-derriere-la-porte.MP3": "f058d8962a4e843d4af550cabc36989d58a29d6b",
  "./audio/events/radio/radio-001-resolution-local-vide.mp3": "9af4f7ee68a2358f9287c91816b201604a34c41e",
  "./audio/events/meteo/meteo-001-pression-fantome.mp3": "fe45d827bd3792ce1a14ca66638a18ffafac2f45",
  "./audio/events/meteo/meteo-002-pluie-a-rebours.mp3": "2aa95887633d79f79a6857169d52b194d0101155",
  "./audio/ambient_loop.mp3": "fdb97f1acd6ecd62731f3de9e8c78437cc0dc07b",
  "./audio/groan.wav": "20913ca3052fa4a40fe7fad2a35a8ec6a56ade79",
  "./audio/ritual_resurrection.wav": "afe2c7123a36e91e478f73825ec2529f5f1f1983",
  "./audio/camp_rest.wav": "54372e22b7a745ab9cf80b5fa9674254ed798e7b",
  "./audio/voice_enter_reflet.wav": "caf70f9b67bf4ad1fb0fa877ee8b14c2cec169d6",
  "./audio/voice_return_normal.mp3": "ac34c6e9cefd4913a203578d2aaafab3c139576a",
  "./audio/sounds/creepy_crow_caw.mp3": "0391b2d717d305ee4782ca08a38f1be15bec0769",
  "./audio/sounds/creepy_ghost_whisper.mp3": "608a8566e56914b710dd38f8c93cfce735a4c6db",
  "./audio/sounds/creepy_laugh.mp3": "2f85e6adff741acf0107f190ea9bbcfe7673d446",
  "./audio/sounds/creepy_wind.mp3": "9310548a5fcf762412a524215dd8ec64144bbb41",
  "./audio/sounds/door_slam_angrily.mp3": "5950edc0f26d7801e4c7d31f1138d3b4edcb92dd",
  "./audio/sounds/footsteps_on_wooden_floor.mp3": "565c17993cf3bc1f14e0272b8c2ce0903d8daab7",
  "./audio/sounds/forest_whisper.mp3": "b4db87aad7fdae8c7c16382c7a32203aec23bcf9",
  "./audio/sounds/scratching_metal.mp3": "8f026ddae906b0bc01bffa4a9909dbba27b31a6a",
  "./audio/sounds/whisper_voices.mp3": "78313bcd4763c444c492029ba556eeacdecf7a44",
  "./audio/sounds/wood_creak_single.mp3": "f89e7ba7ea5a93e3c60744f55d6c777abe1828cf"
};

async function cachePersistentMedia() {
  const mediaCache = await caches.open(MEDIA_CACHE);
  let oldRevisions = null;
  const savedRevisions = await mediaCache.match(MEDIA_REVISIONS_KEY);
  if (savedRevisions) {
    try { oldRevisions = await savedRevisions.json(); } catch (_) {}
  }

  // Premier passage depuis l'ancien système : récupérer ses fichiers locaux
  // plutôt que les télécharger à nouveau. Le v75 n'a pas modifié de média.
  const cacheNames = await caches.keys();
  const legacyNames = oldRevisions ? [] : cacheNames
    .filter(name => /^instability-v\d+$/.test(name) && name !== CACHE)
    .sort((a, b) => Number(b.split('-v')[1]) - Number(a.split('-v')[1]));

  async function migrateOne(asset) {
    const revision = MEDIA_REVISIONS[asset];
    if (oldRevisions && oldRevisions[asset] === revision
      && await mediaCache.match(asset)) return;

    if (!oldRevisions) {
      for (const name of legacyNames) {
        const previous = await (await caches.open(name)).match(asset);
        if (previous) {
          await mediaCache.put(asset, previous);
          return;
        }
      }
    }

    const fresh = await fetch(asset, { cache: 'no-cache' });
    if (!fresh.ok) throw new Error('Média indisponible : ' + asset);
    await mediaCache.put(asset, fresh);
  }

  // Éviter d'ouvrir plus de 6 transferts/copies simultanés sur mobile.
  for (let pos = 0; pos < MEDIA_ASSETS.length; pos += 6) {
    await Promise.all(MEDIA_ASSETS.slice(pos, pos + 6).map(migrateOne));
  }

  await mediaCache.put(
    MEDIA_REVISIONS_KEY,
    new Response(JSON.stringify(MEDIA_REVISIONS), {
      headers: { 'Content-Type': 'application/json' }
    })
  );
}


// L'interface doit devenir disponible hors ligne sans attendre les 110 Mio
// de contenus du Bestiaire. Ces médias sont préparés séparément.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const shellCache = await caches.open(CACHE);
    await shellCache.addAll(SHELL_ASSETS);
    await self.skipWaiting();
  })());
});

let mediaCacheJob = null;
self.addEventListener('message', event => {
  if (event.data?.type !== 'rdv-cache-offline-media') return;
  if (!mediaCacheJob) {
    mediaCacheJob = cachePersistentMedia()
      .catch(err => {
        // L'échec d'un gros fichier ne doit plus rendre toute la PWA inutilisable.
        console.warn('Médias hors ligne incomplets :', err);
      })
      .finally(() => { mediaCacheJob = null; });
  }
  event.waitUntil(mediaCacheJob);
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE
          && key !== RUNTIME_CACHE
          && key !== MEDIA_CACHE)
          .map(key => caches.delete(key))
      ))
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
