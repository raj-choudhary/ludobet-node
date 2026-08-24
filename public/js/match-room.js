/**
 * Match Room Real-Time Controller
 * Ludo Tournament King
 */

let countdownSeconds = 285; // 4 mins 45 secs
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  startMatchCountdown();
});

// 1. Live Countdown Timer
function startMatchCountdown() {
  const countdownEl = document.getElementById('match-countdown');
  const progressFill = document.getElementById('timer-progress-fill');
  const initialSeconds = 300; // 5 mins total

  if (!countdownEl || !progressFill) return;

  timerInterval = setInterval(() => {
    countdownSeconds--;

    if (countdownSeconds <= 0) {
      clearInterval(timerInterval);
      countdownEl.innerText = '00:00';
      progressFill.style.width = '0%';
      showToast('Match cancellation window expired!', '⏳');
      return;
    }

    const mins = Math.floor(countdownSeconds / 60);
    const secs = countdownSeconds % 60;
    countdownEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const percentage = (countdownSeconds / initialSeconds) * 100;
    progressFill.style.width = `${percentage}%`;
  }, 1000);
}

// 2. 1-Click Copy Room Code with Animation
function copyRoomCode() {
  const codeDigits = document.getElementById('room-code-digits');
  const copyText = document.getElementById('copy-text');
  if (!codeDigits) return;

  const rawCode = codeDigits.innerText.replace(/\s+/g, '');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(rawCode).catch(() => {});
  }

  if (copyText) copyText.innerText = 'COPIED!';
  showToast(`Room Code "${rawCode}" Copied!`, '📋');

  setTimeout(() => {
    if (copyText) copyText.innerText = 'COPY';
  }, 2000);
}

// 3. Open Ludo King App Deep Link
function openLudoKingApp() {
  copyRoomCode();
  showToast('Opening Ludo King App...', '🎮');

  // Try deep-link to Ludo King app
  const ludoKingDeepLink = 'ludoking://';
  const playStoreLink = 'https://play.google.com/store/apps/details?id=com.ludo.king';

  window.location.href = ludoKingDeepLink;

  // Fallback if app not installed on device
  setTimeout(() => {
    // If window is still active after 2.5s, app might not be installed
  }, 2500);
}

// 4. Refresh / Generate New Room Code
function refreshRoomCode() {
  const codeDigits = document.getElementById('room-code-digits');
  if (!codeDigits) return;

  // Generate random 8-digit Ludo King code
  const p1 = Math.floor(1000 + Math.random() * 9000);
  const p2 = Math.floor(1000 + Math.random() * 9000);
  const newCode = `${p1} ${p2}`;

  codeDigits.innerText = newCode;
  showToast('New Room Code Generated!', '🔄');
}

// 5. Toggle Rules Accordion
function toggleRulesAccordion() {
  const body = document.getElementById('rules-body');
  const arrow = document.getElementById('rules-toggle-arrow');
  if (!body || !arrow) return;

  body.classList.toggle('collapsed');
  arrow.innerText = body.classList.contains('collapsed') ? '▲' : '▼';
}

// 6. Cancel Modal Management
function openCancelModal() {
  const modal = document.getElementById('cancel-modal');
  if (modal) modal.classList.add('show');
}

function closeCancelModal() {
  const modal = document.getElementById('cancel-modal');
  if (modal) modal.classList.remove('show');
}

function confirmCancelBattle() {
  closeCancelModal();
  showToast('Cancellation request submitted. Entry fee refunded to wallet.', '✅');
  setTimeout(() => {
    window.location.href = 'ludo-classic.html';
  }, 1500);
}

// 7. Interactive Toast Utility
function showToast(msg, icon = '⚡') {
  const toast = document.getElementById('app-toast');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;

  msgEl.innerText = msg;
  if (iconEl) iconEl.innerText = icon;

  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
