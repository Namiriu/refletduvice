const CACHE = 'instability-v115';
const MEDIA_CACHE = 'instability-media-v1';
const MEDIA_REVISIONS_KEY = './__rdv_media_revisions_v1__.json';
const RUNTIME_CACHE = 'instability-runtime-v1';

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './radio004.js',
  './radio004.css',
  './radio005.js',
  './radio005.css',
  './prenoms.js',
  './bestiaire-data.js',
  './manifest.webmanifest',

  './icons/icon-192.png',

  './img/bg.webp',

  // Masques d'Instabilité
  './img/masque0.png',
  './img/masque-presentations.webp',
  './img/masque15.png',
  './img/masque25.png',
  './img/masque40.png',
  './img/masque50.png',
  './img/masque65.png',
  './img/masque75.png',
  './img/masque90.png',
  // Les deux faces illustrées du jeton du Masque.
  './img/jeton-masque-pile.png',
  './img/jeton-masque-face.png',
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
  './audio/events/masque/introduction/masque-000-demande-prenoms.mp3',
  './audio/events/masque/introduction/masque-000-reaction-prenoms.mp3',
  './audio/events/masque/introduction/masque-000-aucun-prenom.mp3',

  // Événements audio — Le Masque (prototype hors connexion)
  './audio/events/masque/designations/joueur-1.mp3',
  './audio/events/masque/designations/joueur-2.mp3',
  './audio/events/masque/designations/joueur-3.mp3',
  './audio/events/masque/designations/joueur-4.mp3',
  './audio/events/masque/interventions/masque-001-collectionneur.mp3',
  './audio/events/masque/interventions/masque-002-elan-de-generosite.mp3',
  './audio/events/masque/interventions/masque-003-prix-du-sacrifice.mp3',
'./audio/events/masque/interventions/masque-004-regard-du-vice-intro.mp3',
'./audio/events/masque/interventions/masque-004-regard-du-vice-epreuve.mp3',
'./audio/events/masque/interventions/masque-004-regard-du-vice-perdant.mp3',
'./audio/events/masque/interventions/masque-004-regard-du-vice-reussite.mp3',
  // Masque 005 — dialogues et gong réutilisable
  './audio/events/masque/interventions/masque-005-confidence-intro.mp3',
  './audio/events/masque/interventions/masque-005-confidence-cible.mp3',
  './audio/events/masque/interventions/masque-005-confidence-transfert.mp3',
  './audio/events/masque/interventions/masque-005-confidence-secrete.mp3',
  './audio/events/masque/interventions/masque-005-confidence-verdict.mp3',
  './audio/events/masque/interventions/masque-005-confidence-reussite.mp3',
  './audio/events/masque/interventions/masque-005-confidence-echec.mp3',
  // Masque 006 — La Comptine des oubliés
  './audio/events/masque/interventions/masque-006-comptine.MP3',
  './audio/events/masque/interventions/masque-006-intro.mp3',
  './audio/events/masque/interventions/masque-006-non.mp3',
  './audio/events/masque/interventions/masque-006-oui.mp3',
  './audio/events/masque/interventions/masque-006-question.mp3',
  // MASQUE-007 — 12 répliques, jeton entièrement construit en CSS
  './audio/events/masque/interventions/masque-007-agresseur-apres.mp3',
  './audio/events/masque/interventions/masque-007-agresseur-avant.mp3',
  './audio/events/masque/interventions/masque-007-danger-mortel.mp3',
  './audio/events/masque/interventions/masque-007-esquive-ratee-blessure.mp3',
  './audio/events/masque/interventions/masque-007-esquive-reussie.mp3',
  './audio/events/masque/interventions/masque-007-intro.mp3',
  './audio/events/masque/interventions/masque-007-jeton.mp3',
  './audio/events/masque/interventions/masque-007-revelation.mp3',
  './audio/events/masque/interventions/masque-007-sacrifice-accepte.mp3',
  './audio/events/masque/interventions/masque-007-sacrifice-refuse.mp3',
  './audio/events/masque/interventions/masque-007-victime-apres.mp3',
  './audio/events/masque/interventions/masque-007-victime-avant.mp3',
  // RADIO-005 — jingles, voix et bruitages (montage du public en direct)
  './audio/events/radio/radio-005-accepter.mp3',
  './audio/events/radio/radio-005-choix.mp3',
  './audio/events/radio/radio-005-colere.mp3',
  './audio/events/radio/radio-005-conclusion.mp3',
  './audio/events/radio/radio-005-fanfare-cadeau.mp3',
  './audio/events/radio/radio-005-fanfare-jeu.mp3',
  './audio/events/radio/radio-005-gagnant.mp3',
  './audio/events/radio/radio-005-intro.mp3',
  './audio/events/radio/radio-005-jeu.mp3',
  './audio/events/radio/radio-005-jingle-fin.mp3',
  './audio/events/radio/radio-005-jingle-ouverture.mp3',
  './audio/events/radio/radio-005-jingle-pub.mp3',
  './audio/events/radio/radio-005-jingle-retour.mp3',
  './audio/events/radio/radio-005-objet-micro.mp3',
  './audio/events/radio/radio-005-public-applaudissements.mp3',
  './audio/events/radio/radio-005-public-coups.mp3',
  './audio/events/radio/radio-005-public-presentation.mp3',
  './audio/events/radio/radio-005-public-reaction.mp3',
  './audio/events/radio/radio-005-publicite.mp3',
  './audio/events/radio/radio-005-refuser.mp3',
  './audio/events/radio/radio-005-sequestre-1.mp3',
  './audio/events/radio/radio-005-sequestre-2.mp3',
  './audio/events/radio/radio-005-tirage.mp3',
  './audio/events/radio/radio-004-1073-murmure.mp3',
  './audio/events/radio/radio-004-1073-reussite.mp3',
  './audio/events/radio/radio-004-884-annonce.mp3',
  './audio/events/radio/radio-004-884-reussite.mp3',
  './audio/events/radio/radio-004-947-consigne.mp3',
  './audio/events/radio/radio-004-947-interruption.mp3',
  './audio/events/radio/radio-004-947-reussite.mp3',
  './audio/events/radio/radio-004-alerte.mp3',
  './audio/events/radio/radio-004-ambiance-ferroviaire.mp3',
  './audio/events/radio/radio-004-changement-frequence.mp3',
  './audio/events/radio/radio-004-echec.mp3',
  './audio/events/radio/radio-004-glitch-ecran.mp3',
  './audio/events/radio/radio-004-interferences.mp3',
  './audio/events/radio/radio-004-intro.mp3',
  './audio/events/radio/radio-004-parasites.mp3',
  './audio/events/radio/radio-004-respiration.mp3',
  './audio/events/radio/radio-004-signal-perdu.mp3',
  './audio/events/radio/radio-004-signal-reussi.mp3',
  './audio/events/sfx/gong-fin-chronometre.mp3',
  './audio/events/sfx/jeton-verdict.mp3',
  // Première transmission radio : appel monté + résolution narrée
  './audio/events/radio/radio-001-derriere-la-porte.MP3',
  './audio/events/radio/radio-001-resolution-local-vide.mp3',
  './audio/events/radio/radio-002-rapport-impossible.mp3',
  './audio/events/radio/radio-002-repondre.mp3',
  './audio/events/radio/radio-002-couper.mp3',
  './audio/events/radio/radio-002-silence.mp3',
  // RADIO-003 : sanctuaire, prise de contrôle du Masque et voix TV variables
  './audio/events/radio/radio-003-transmission.mp3',
  './audio/events/radio/radio-003-ambiance-sanctuaire.mp3',
  './audio/events/radio/radio-003-brouillage.mp3',
  './audio/events/radio/radio-003-masque-intro.mp3',
  './audio/events/radio/radio-003-masque-epreuve.mp3',
  './audio/events/radio/radio-003-masque-reussite.mp3',
  './audio/events/radio/radio-003-masque-echec.mp3',
  './audio/events/sfx/rouge-normal.mp3',
  './audio/events/sfx/rouge-telephone.mp3',
  './audio/events/sfx/bleu-normal.mp3',
  './audio/events/sfx/bleu-telephone.mp3',
  './audio/events/sfx/vert-normal.mp3',
  './audio/events/sfx/vert-telephone.mp3',
  './audio/events/sfx/jaune-normal.mp3',
  './audio/events/sfx/jaune-telephone.mp3',

  // Météo — récits finalisés du narrateur avec sound design intégré
  './audio/events/meteo/meteo-001-pression-fantome.mp3',
  './audio/events/meteo/meteo-002-pluie-a-rebours.mp3',
  './audio/events/meteo/meteo-003-fracture-du-reel-normal-vers-reflet.mp3',
  './audio/events/meteo/meteo-003-fracture-du-reel-reflet-vers-normal.mp3',
  './audio/events/meteo/meteo-004-dernier-battement-intro.mp3',
  './audio/events/meteo/meteo-004-dernier-battement-choix.mp3',
  './audio/events/meteo/meteo-004-dernier-battement-resister.mp3',
  './audio/events/meteo/meteo-004-dernier-battement-ceder.mp3',
  './bestiaire/videos/gardienne-du-vice.webm',

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
  './radio004.js',
  './radio004.css',
  './radio005.js',
  './radio005.css',
  './prenoms.js',
  './bestiaire-data.js',
  './manifest.webmanifest',
  './icons/icon-192.png'
];
const MEDIA_ASSETS = ASSETS.filter(asset => !SHELL_ASSETS.includes(asset));
const MEDIA_REVISIONS = {
  "./audio/events/masque/introduction/masque-000-aucun-prenom.mp3": "c54bdd4c481d5660d78d542bf3532773dfc6e78a",
  "./audio/events/masque/introduction/masque-000-demande-prenoms.mp3": "19f3229ff850c9daa646058dec245b664eeefa4e",
  "./audio/events/masque/introduction/masque-000-reaction-prenoms.mp3": "2131974e14b9022e0dd5b8a01f635b2792a5e018",
  "./audio/events/radio/radio-005-accepter.mp3": "2f50b033ae414006e01ae4f54cc92569dd2c5bc5",
  "./audio/events/radio/radio-005-choix.mp3": "bb7bf70d9a8531adb3ea79edffb187a1b7d51094",
  "./audio/events/radio/radio-005-colere.mp3": "f96b488dfe7c0d16aa0607fd7bb5afcbc6fe9201",
  "./audio/events/radio/radio-005-conclusion.mp3": "e612a80f067864660c0d60f579840976d56d47a6",
  "./audio/events/radio/radio-005-fanfare-cadeau.mp3": "fb3f459300e43cf19bedde9ed2bcf355d23246dc",
  "./audio/events/radio/radio-005-fanfare-jeu.mp3": "c801350c69f6ae0351535c521feae1893f4f10ea",
  "./audio/events/radio/radio-005-gagnant.mp3": "43018d337a95467623e0e060027485027a45a7f4",
  "./audio/events/radio/radio-005-intro.mp3": "93282ae52123d0909eda582cddd02bcda103a1fc",
  "./audio/events/radio/radio-005-jeu.mp3": "e99f0347495c3ff73078934efcc7df8f3330b9eb",
  "./audio/events/radio/radio-005-jingle-fin.mp3": "8fdcfdb120c195b7fdd6da2f170a643445e37411",
  "./audio/events/radio/radio-005-jingle-ouverture.mp3": "d0e77a3b034f164f7b42bbb2cc1b0db01c850c05",
  "./audio/events/radio/radio-005-jingle-pub.mp3": "3b7e258d0fa278aa1b41f8faf715d8604e65cbcb",
  "./audio/events/radio/radio-005-jingle-retour.mp3": "dbebe2269749d36192f59cf0df17d8bda1380aa2",
  "./audio/events/radio/radio-005-objet-micro.mp3": "09ba355c62b8b6c13aa399627b04db0bff1d51dc",
  "./audio/events/radio/radio-005-public-applaudissements.mp3": "81ed4ac56042b448320c2c5c9bd5c63701c570d2",
  "./audio/events/radio/radio-005-public-coups.mp3": "3beed92c306798170f6d4e75ed8bc198ef510ac7",
  "./audio/events/radio/radio-005-public-presentation.mp3": "5ebdb08e50ec5b55f0017e599dbc1a7626525b13",
  "./audio/events/radio/radio-005-public-reaction.mp3": "f5d3c68ee6261c56be6916ed4c9167fadc223450",
  "./audio/events/radio/radio-005-publicite.mp3": "65e35ba5ec1fa48b2dc551038e8b9052c9065f77",
  "./audio/events/radio/radio-005-refuser.mp3": "999d89f92cd4e453d5511105ba000f0092ed30a3",
  "./audio/events/radio/radio-005-sequestre-1.mp3": "36e6f8f28b0c3adc4c51aa01059c7b1c3ee7df98",
  "./audio/events/radio/radio-005-sequestre-2.mp3": "395c725ee4ffec0fd34d359ea965f9cad5479755",
  "./audio/events/radio/radio-005-tirage.mp3": "ea9fd3a44f9359ee6575e7c104f71617f5b6a5d4",
  "./img/bg.webp": "7147cd9081980c4577f2e3e0b6c1b082d269b9a3",
  "./img/masque0.png": "3866a6674214aeadaaad73a79d9929a90fc0d94c",
  "./img/masque15.png": "d8421c273f3efc14be9e493787a1b5a073c679ce",
  "./img/masque25.png": "d30022d47a617bebd7bd7c9be32751bc93c1f6a3",
  "./img/masque40.png": "aa8d95cc57c8c61794935fd64dda2aa9a46c29a8",
  "./img/masque50.png": "32eb82d4cc232f3a282bb1155d7717bafced8c6d",
  "./img/masque65.png": "394d58c4abe5b075e481f20a5861efa4181cdccc",
  "./img/masque75.png": "047e5d0b4bec6aeae47d222b359a382c5486ace3",
  "./img/masque90.png": "70c5160a5cceafc5ea380245d6090da0a7fcc3d0",
  "./img/jeton-masque-pile.png": "3116393e7ad5cc11145ef427ee24d1f70c9858d4",
  "./img/jeton-masque-face.png": "fa9d67185e2038a906c43ca1ac238efdf9d4363d",
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
  "./audio/events/masque/interventions/masque-004-regard-du-vice-intro.mp3": "61d5fc839300524702144812d6a5f61cde80bd07",
  "./audio/events/masque/interventions/masque-004-regard-du-vice-epreuve.mp3": "21394f03272827e2846ea6b1927b55558646ba42",
  "./audio/events/masque/interventions/masque-004-regard-du-vice-perdant.mp3": "88e44b914376506ddd478231f7854290693a5a5e",
  "./audio/events/masque/interventions/masque-004-regard-du-vice-reussite.mp3": "9bc3b59d8ce0adc120b654ea700eeb7df141602e",
  "./audio/events/masque/interventions/masque-005-confidence-intro.mp3": "d6d39e4d0f7816c295170d22416200987dc89ae2",
  "./audio/events/masque/interventions/masque-005-confidence-cible.mp3": "a157f63bc4810b24b5d00803945a62c1c71e4b33",
  "./audio/events/masque/interventions/masque-005-confidence-transfert.mp3": "ccde91162c2cba0f70ace6b8f27c25d01bafb96b",
  "./audio/events/masque/interventions/masque-005-confidence-secrete.mp3": "5ff59be9860f8f8c87fe90cbd5a83aa5f3237709",
  "./audio/events/masque/interventions/masque-005-confidence-verdict.mp3": "339ce5ebd03bf0cd05733f5b701be0de3b4fb070",
  "./audio/events/masque/interventions/masque-005-confidence-reussite.mp3": "48ec07bbc18e41f66de7eb3ea9b17a314617dee0",
  "./audio/events/masque/interventions/masque-005-confidence-echec.mp3": "31bc495f2853a1aa00bf926c86953f4c6cd16f2e",
  "./audio/events/masque/interventions/masque-006-comptine.MP3": "190d9da7b15da1823eb927f48e58e1634704334b",
  "./audio/events/masque/interventions/masque-006-intro.mp3": "cdd67f739dd8609aca8fa35e454fca0d084e530e",
  "./audio/events/masque/interventions/masque-006-non.mp3": "d9980065c8d99bc2925af557acfe9b7b43838d12",
  "./audio/events/masque/interventions/masque-006-oui.mp3": "d761872d14deb99a5b8ab3d054aa5ec7fe2c2e1d",
  "./audio/events/masque/interventions/masque-006-question.mp3": "e878a07088f43fc9de411c0d4a4f27f5d095076b",
  "./audio/events/masque/interventions/masque-007-agresseur-apres.mp3": "876eb2220e3fcd9494772fc807a951fd31c6bab4",
  "./audio/events/masque/interventions/masque-007-agresseur-avant.mp3": "0d5da1e3df336b6b774ff09e2a678482fd2695d5",
  "./audio/events/masque/interventions/masque-007-danger-mortel.mp3": "0776a2f6763bce13bd7163eb713ea59b27fc1d49",
  "./audio/events/masque/interventions/masque-007-esquive-ratee-blessure.mp3": "b55b673b1ba1da5dcaef02462c945480fafa5b76",
  "./audio/events/masque/interventions/masque-007-esquive-reussie.mp3": "c780802a018129b851d0e03975357653b39fbd36",
  "./audio/events/masque/interventions/masque-007-intro.mp3": "225a14663de46fe417e23131c7d7037f2547009d",
  "./audio/events/masque/interventions/masque-007-jeton.mp3": "b52d4eab0ef3df7a8e8e42424da32914caf1ed64",
  "./audio/events/masque/interventions/masque-007-revelation.mp3": "9be37f5abbc4d9494d772a5ea0614c46801b80d1",
  "./audio/events/masque/interventions/masque-007-sacrifice-accepte.mp3": "025e7246ccb5c6a18c1ba8abe5ef3ad05e85fb6e",
  "./audio/events/masque/interventions/masque-007-sacrifice-refuse.mp3": "bc5467abf55a60e1d6961ae53f8c83abbc02b28a",
  "./audio/events/masque/interventions/masque-007-victime-apres.mp3": "7f68b70d2ae16bc934f3c3167654b693ece69ddf",
  "./audio/events/masque/interventions/masque-007-victime-avant.mp3": "8f037a81244befbed01e3342c47399985acb556e",
  "./audio/events/radio/radio-004-1073-murmure.mp3": "6610e2300aabc7fee60b00c7ebebfb796f395773",
  "./audio/events/radio/radio-004-1073-reussite.mp3": "24380d5487e8968bcfd89a1dc2113f63485afd32",
  "./audio/events/radio/radio-004-884-annonce.mp3": "e2d23c7c687032390ef5574962e60ae745bb9729",
  "./audio/events/radio/radio-004-884-reussite.mp3": "e1771de707ff6b898dcc16d89e09957a5fe25855",
  "./audio/events/radio/radio-004-947-consigne.mp3": "40f96cdd69d91a13f1dbad5dea5b758b3fd67f0d",
  "./audio/events/radio/radio-004-947-interruption.mp3": "4f3aed3b1ebe76aac61466f24255caae04f1795a",
  "./audio/events/radio/radio-004-947-reussite.mp3": "c57e0ef10f2baa78232e30d75ee689a44b55a1a8",
  "./audio/events/radio/radio-004-alerte.mp3": "48ea73b0bde8462214dc7d5b89fb0ff4f2649714",
  "./audio/events/radio/radio-004-ambiance-ferroviaire.mp3": "fe5d4b51cd0aeeade3ec43a82896cf8d877d723e",
  "./audio/events/radio/radio-004-changement-frequence.mp3": "597b6a1250ba74786a7acf6030a8c5f2611e144c",
  "./audio/events/radio/radio-004-echec.mp3": "334aba8e3ae85d727ecd4ae45599725c043507ef",
  "./audio/events/radio/radio-004-glitch-ecran.mp3": "9acf3f36e98bd4a2dd4ba5cc85a52cccfd57d6b4",
  "./audio/events/radio/radio-004-interferences.mp3": "2e194888a9a8a0317a48dd5bbdd8d6b25c906617",
  "./audio/events/radio/radio-004-intro.mp3": "56fcf0fe0e738bbd02b7c9b3f4920454a674538c",
  "./audio/events/radio/radio-004-parasites.mp3": "23988e736be33078c2f8f62e611ffb6985abe880",
  "./audio/events/radio/radio-004-respiration.mp3": "1bfd1edfa2ef4dcaea55dcb9759d2662372c2c7b",
  "./audio/events/radio/radio-004-signal-perdu.mp3": "ab9c3a177a90c2b16736e8e701fbed61bd14e1c2",
  "./audio/events/radio/radio-004-signal-reussi.mp3": "0c9f0b18c0e95a0a8475a1dd5c821904513dabe0",
  "./audio/events/sfx/gong-fin-chronometre.mp3": "04009fb2cc462e133b0646d3c92fe47fb85c36df",
  "./audio/events/sfx/jeton-verdict.mp3": "d787f17e4e95eacae71ed271d7e78d4be2f9457a",
  "./audio/events/radio/radio-001-derriere-la-porte.MP3": "f058d8962a4e843d4af550cabc36989d58a29d6b",
  "./audio/events/radio/radio-001-resolution-local-vide.mp3": "9af4f7ee68a2358f9287c91816b201604a34c41e",
  "./audio/events/radio/radio-002-rapport-impossible.mp3": "550bd2d4e932887bf8a89bf58ac7910951750217",
  "./audio/events/radio/radio-002-repondre.mp3": "5306f609ea7b4454a269c9c753020c23d6635000",
  "./audio/events/radio/radio-002-couper.mp3": "1849dd2d6720c8fee15d52052c918fe328087d0e",
  "./audio/events/radio/radio-002-silence.mp3": "f623407c0e6bb0e89b79ff7ec257d9ca548ca87c",
  "./audio/events/radio/radio-003-transmission.mp3": "72ed5ab4cd63725493d6266cc73d845e83b3def7",
  "./audio/events/radio/radio-003-ambiance-sanctuaire.mp3": "51981e2934382091b0e4eefc68b5dba0c611efb5",
  "./audio/events/radio/radio-003-brouillage.mp3": "e73f52b867364fe2974510697e9830a091b4e910",
  "./audio/events/radio/radio-003-masque-intro.mp3": "83b14ef411306f1de451983943f8e2abe68a108c",
  "./audio/events/radio/radio-003-masque-epreuve.mp3": "d2a1bb53c280f545ccf9404373d6c53272ec2ae6",
  "./audio/events/radio/radio-003-masque-reussite.mp3": "11a9f667db71e4f7f24196b0c27bd28252a03057",
  "./audio/events/radio/radio-003-masque-echec.mp3": "d63b284c26a3c89a59503a031f8690682495f678",
  "./audio/events/sfx/rouge-normal.mp3": "fa37000e6dbcf6e36899a6509de8abc0936e3fda",
  "./audio/events/sfx/rouge-telephone.mp3": "7f1ac4dde6ef914b122134a3d76be8dfe8b9e395",
  "./audio/events/sfx/bleu-normal.mp3": "fbbec89e175a4474473f0422bb9a5febdce50dab",
  "./audio/events/sfx/bleu-telephone.mp3": "3833153d67a6fb2258cf1bf16fce5796f5182542",
  "./audio/events/sfx/vert-normal.mp3": "a77f86a4290b4cd6eaf668f31ba76eeadec2c6eb",
  "./audio/events/sfx/vert-telephone.mp3": "4db04ebe42d0848cc2d8e49ef4d19482e379eb19",
  "./audio/events/sfx/jaune-normal.mp3": "e2a2b2a63c6bb2226c4a58a0205a83d7c78e8d83",
  "./audio/events/sfx/jaune-telephone.mp3": "cfbae60d6a165763a617f38c0509c97f5203b215",
  "./audio/events/meteo/meteo-001-pression-fantome.mp3": "fe45d827bd3792ce1a14ca66638a18ffafac2f45",
  "./audio/events/meteo/meteo-002-pluie-a-rebours.mp3": "2aa95887633d79f79a6857169d52b194d0101155",
  "./audio/events/meteo/meteo-003-fracture-du-reel-normal-vers-reflet.mp3": "1967f5cd39d69cac7b61e5a6f93b2ee63b854500",
  "./audio/events/meteo/meteo-003-fracture-du-reel-reflet-vers-normal.mp3": "b8a02d3918d829ddf00bc39a1a3b2c34051919d2",
  "./audio/events/meteo/meteo-004-dernier-battement-intro.mp3": "44f443f9a2e9c647eeb5d1b21bfb1f5066b56aaf",
  "./audio/events/meteo/meteo-004-dernier-battement-choix.mp3": "3ee606109f086ac563d4a98f011ac662ba132b98",
  "./audio/events/meteo/meteo-004-dernier-battement-resister.mp3": "fde6dc4e22f84ebaf86b4053f26ddf52e9a87525",
  "./audio/events/meteo/meteo-004-dernier-battement-ceder.mp3": "bbb22ccdd5a8f8a4615ebfbae755b462fb225a43",
  "./bestiaire/videos/gardienne-du-vice.webm": "401df951c8f4e6f7c47aa1f46a116149a49c606b",
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
  if (event.data?.type === 'rdv-cache-prenoms') {
    const requested = Array.isArray(event.data.paths) ? event.data.paths : [];
    // Un joueur ne peut jamais demander de mettre en cache une URL arbitraire.
    const paths = requested.slice(0, 4).filter(path =>
      typeof path === 'string'
      && /^audio\/events\/masque\/prenoms\/[a-z]+\.mp3\?v=[a-f0-9]{12}$/.test(path));
    event.waitUntil((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      await Promise.all(paths.map(async path => {
        try {
          if (await cache.match(path)) return;
          const audio = await fetch(path, {cache:'no-cache'});
          if (audio.ok && audio.status === 200) await cache.put(path, audio);
        } catch (_) {
          // Une indisponibilité ponctuelle ne bloque jamais la PWA.
        }
      }));
    })());
    return;
  }
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

  // Les 100 prénoms ne sont PAS préchargés au premier lancement.
  // Chaque prénom sélectionné pourra néanmoins servir hors connexion.
  if (path.origin === self.location.origin
    && /\/audio\/events\/masque\/prenoms\/[a-z]+\.mp3$/.test(path.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok && response.status === 200)
        await cache.put(event.request, response.clone());
      return response;
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
