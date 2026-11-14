/* Le Reflet du Vice : liste explicite des prénoms enregistrés.
   Seul un fichier présent ici peut être chargé, jamais un chemin fourni par un joueur.
   Les révisions SHA invalident le cache de chaque MP3 si une voix est remplacée. */
(function () {
  'use strict';
  const clips = Object.freeze({
    "adam": "5d7a3f8ea439",
    "adele": "27a9d7baa894",
    "adrien": "ed83d2030364",
    "alba": "43a6a31e8d4c",
    "alexandre": "6d80d7f1286c",
    "alice": "237ec9f0e6ea",
    "alma": "8adc96363e89",
    "ambre": "b1ba890d5af4",
    "anais": "f44fea4f2171",
    "angelina": "61a6e1f58382",
    "anthony": "bf9f3742b5a3",
    "antoine": "4b7dbf8b37d8",
    "arthur": "93c877e42adf",
    "aurelie": "1825245bf2a5",
    "axel": "f642ba691aaa",
    "baptiste": "fb0e1bdbf4fb",
    "benjamin": "fd3c20d224e9",
    "camille": "d347de2c4646",
    "caroline": "cce55548c0b9",
    "celia": "95977bbf3035",
    "charline": "2556beaf90e4",
    "charlotte": "192d6e3c1e0e",
    "chloe": "c50e4e6e273b",
    "clara": "6c096379489d",
    "clemence": "a39490b2b3aa",
    "clement": "d3371c0648dc",
    "corentin": "91f5bcc72698",
    "elodie": "9e68870300c1",
    "emma": "2809cfae9044",
    "enzo": "17d2cd920f63",
    "ethan": "8f00f8f8e595",
    "eva": "a87aac9b5273",
    "florian": "8204d813a6ba",
    "gabriel": "f95f8e9607f9",
    "geoffray": "273da7ff9844",
    "guillaume": "39842dfaadfd",
    "hugo": "d30ca076f82d",
    "ines": "b219c6efbe48",
    "jade": "ba37c3243dfe",
    "jeanne": "c57f049421d7",
    "jerome": "a9299d98957b",
    "jules": "c19d83954471",
    "julie": "d2a3af446c0b",
    "julien": "a365bb2e6e10",
    "juliette": "d73b9b87aa98",
    "kevin": "5df6cf0da11d",
    "laura": "81eb6c32ffcd",
    "lea": "33bab68df663",
    "lena": "e71906c2b368",
    "leo": "61f026055e86",
    "leon": "de9f52437c44",
    "lina": "9bcd987b77f6",
    "lisa": "aab4d4a8f3bc",
    "lola": "6e5c3968cad9",
    "louis": "275d9bfd90f4",
    "louise": "ccbee163c7dd",
    "lucas": "9fb8d2abea04",
    "lucie": "7a25dea1e598",
    "mael": "ce5fb80c72e7",
    "maelys": "176df4e77a3a",
    "manon": "ef643a4374aa",
    "marc": "7818345e89b3",
    "margaux": "dd09aaf93966",
    "marie": "cc9cd1b1f142",
    "marion": "89eb9a1eb584",
    "mathieu": "8ef41d6a01e3",
    "mathilde": "a42e0caa2de0",
    "mathis": "0f55251a7db1",
    "matthias": "903dfa31c2e6",
    "maxence": "49a033802c10",
    "maxime": "01d0472fa8a8",
    "melanie": "648324cec79c",
    "melys": "cf15a8c54a90",
    "mila": "da9abd000f0e",
    "nathan": "66a500d3ce16",
    "nicolas": "f014bbc78af3",
    "noah": "62eb54bbffe9",
    "noemie": "3d9e76f2eef5",
    "oceane": "d560753d78d6",
    "paul": "7c9eb0672671",
    "pauline": "c0ba68e004d6",
    "pierre": "2f5f3e5774e0",
    "quentin": "4822da22513a",
    "raphael": "f5c30e4061a3",
    "romain": "956caacf4f4c",
    "romane": "ebe9a965ab80",
    "romy": "1dff95b08ba3",
    "rose": "36d96e7ff2ef",
    "sacha": "4bc38544901f",
    "samuel": "1f8bf005d651",
    "sarah": "85d88b974a03",
    "simon": "c5b098264e7b",
    "theo": "c7e78a952344",
    "thomas": "bb980770f4c3",
    "tom": "d9a09a193af8",
    "vadia": "676a156f9fc3",
    "valentin": "9b6f206ced47",
    "victor": "a5ed0af54711",
    "yanis": "2b50b4ba1799",
    "zoe": "ad9caf912c88"
  });
  // Un alias n'est accepté qu'après validation de la prononciation partagée.
  const aliases = Object.freeze({ noa: 'noah', batiste: 'baptiste' });
  const base = 'audio/events/masque/prenoms/';
  const fallback = number => 'audio/events/masque/designations/joueur-'
    + Math.max(1, Math.min(4, Number(number) || 1)) + '.mp3';

  function normalized(name) {
    if (typeof name !== 'string') return '';
    return name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr-FR');
  }

  function audioPath(name, playerNumber) {
    const key = normalized(name);
    // La liste blanche empêche qu'une saisie contenant /, ., ? ou autre
    // caractère spécial ne construise un chemin arbitraire.
    if (!/^[a-z]+$/.test(key)) return fallback(playerNumber);
    const canonical = aliases[key] || key;
    const revision = clips[canonical];
    return revision ? base + canonical + '.mp3?v=' + revision
      : fallback(playerNumber);
  }

  function isPersonalized(path) {
    return typeof path === 'string' && path.startsWith(base);
  }

  function selectedPaths(names) {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const path = audioPath(Array.isArray(names) ? names[i] : '', i + 1);
      if (isPersonalized(path) && !result.includes(path)) result.push(path);
    }
    return result;
  }

  window.RdVPlayerNames = Object.freeze({
    normalized, audioPath, isPersonalized, selectedPaths, count: Object.keys(clips).length
  });
})();
