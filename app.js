// Variables & Configuration de la porte d'accès
const PASSPHRASE_HASH = 'sha256:779d99b88c773f38617d286974f7882cbbc7f91781ef98287c55a5e89ea09e9f';
const GATE_KEY = 'playtest_gate_hash';

// Éléments du DOM
const gate = document.getElementById('gate');
const gateInput = document.getElementById('gateInput');
const gateBtn = document.getElementById('gateBtn');
const gateError = document.getElementById('gateError');
const gaugeValueEl = document.getElementById('gaugeValue');

// État de l'instabilité (départ à 50%)
let instabilite = 50;

// Fonction utilitaire pour calculer le HASH SHA-256
async function sha256Hex(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Vérification de la porte au chargement
async function checkGate() {
  const stored = localStorage.getItem(GATE_KEY);
  if (stored === PASSPHRASE_HASH) {
    gate.style.display = 'none';
  } else {
    gate.style.display = 'flex';
  }
}

// Validation du mot de passe saisi
async function validateGate() {
  const value = gateInput.value.trim();
  if (!value) return;

  const hash = await sha256Hex(value);
  const formattedHash = 'sha256:' + hash;

  if (formattedHash === PASSPHRASE_HASH) {
    localStorage.setItem(GATE_KEY, formattedHash);
    gate.style.display = 'none';
    gateError.textContent = '';
  } else {
    gateError.textContent = 'Mot de passe incorrect.';
  }
}

// Événements sur la porte
if (gateBtn) gateBtn.addEventListener('click', validateGate);
if (gateInput) {
  gateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') validateGate();
  });
}

// Mise à jour de l'affichage du pourcentage
function updateGaugeDisplay() {
  if (gaugeValueEl) {
    gaugeValueEl.textContent = `${instabilite} %`;
  }
}

// Événements sur les 8 boutons d'instabilité
document.querySelectorAll('.btn-gauge').forEach(btn => {
  btn.addEventListener('click', () => {
    const change = parseInt(btn.getAttribute('data-change'), 10);
    instabilite = Math.min(100, Math.max(0, instabilite + change));
    updateGaugeDisplay();
  });
});

// Initialisation
checkGate();
updateGaugeDisplay();

// Enregistrement du Service Worker (silencieux en cas d'absence)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}
