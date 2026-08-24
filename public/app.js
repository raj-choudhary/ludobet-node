/**
 * LUDO TOURNAMENT - INTERACTIVE CONTROLLER
 * High-performance, tactile micro-interactions and modal controller
 */

(function () {
  'use strict';

  // --- 1. Synthesized Audio Engine (No external sound files required) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSound(type) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'coin') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    }
  }

  // --- 2. Toast System ---
  let toastTimer = null;
  function showToast(message, icon = '✨') {
    const toast = document.getElementById('toast-msg');
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  // --- 3. Modal Controllers ---
  function openModal(modalId) {
    playSound('click');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  }

  function closeModal(modalId) {
    playSound('click');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }

  // Close when clicking backdrop
  document.querySelectorAll('.modal-backdrop, .drawer-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('show');
      }
    });
  });

  // --- 4. Game Card Handlers ---
  window.handleGameClick = function (gameName) {
    playSound('click');
    const titleElem = document.getElementById('game-modal-title');
    const subtitleElem = document.getElementById('game-modal-sub');
    const badgeElem = document.getElementById('game-modal-badge');
    const actionBtn = document.getElementById('game-modal-action-btn');

    if (gameName === 'Ludo Classic') {
      window.location.href = 'ludo-classic.html';
      return;
    } else if (gameName === 'Ludo Quick') {
      badgeElem.innerHTML = '⚡';
      titleElem.textContent = 'Ludo Quick';
      subtitleElem.textContent = 'Fast-paced 2-token match. Winner in 5 mins!';
      actionBtn.textContent = 'PLAY QUICK (₹20)';
      openModal('game-select-modal');
    } else if (gameName === 'Snake & Ladders') {
      badgeElem.innerHTML = '🐍';
      titleElem.textContent = 'Snake & Ladders';
      subtitleElem.textContent = 'Climb the ladders, avoid the snakes & win!';
      actionBtn.textContent = 'ENTER LOBBY (₹15)';
      openModal('game-select-modal');
    } else if (gameName === 'New Game') {
      badgeElem.innerHTML = '🔮';
      titleElem.textContent = 'Mystery Game';
      subtitleElem.textContent = 'Exciting multiplayer tournament coming next week!';
      actionBtn.textContent = 'NOTIFY ME ON LAUNCH';
      openModal('game-select-modal');
    }
  };

  // --- 5. Tournament Banner Handlers ---
  window.handleTournamentClick = function () {
    playSound('coin');
    openModal('tournament-modal');
  };

  window.handleViewAllTournaments = function (e) {
    if (e) e.stopPropagation();
    playSound('click');
    showToast('Loading full tournament schedule...', '🏆');
  };

  // --- 6. Top Header Actions ---
  window.handleMenuClick = function () {
    playSound('click');
    const drawer = document.getElementById('sidebar-drawer');
    if (drawer) drawer.classList.add('show');
  };

  window.closeDrawer = function () {
    playSound('click');
    const drawer = document.getElementById('sidebar-drawer');
    if (drawer) drawer.classList.remove('show');
  };

  window.handleChipsClick = function () {
    playSound('coin');
    openModal('add-chips-modal');
  };

  window.handleEarningsClick = function () {
    playSound('coin');
    openModal('earnings-modal');
  };

  window.handleBellClick = function () {
    playSound('click');
    openModal('notifications-modal');
  };

  // --- 7. Bottom Navigation Tab Switching ---
  window.handleNavTab = function (tabElement, tabName) {
    playSound('click');
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    tabElement.classList.add('active');

    if (tabName === 'Home') {
      showToast('Welcome to Home', '🏠');
    } else if (tabName === 'Ranking') {
      window.location.href = 'ranking.html';
    } else if (tabName === 'Wallet') {
      window.location.href = 'wallet.html';
    } else if (tabName === 'Refer') {
      window.location.href = 'refer-earn.html';
    } else if (tabName === 'Profile') {
      window.location.href = 'profile.html';
    }
  };

  // --- 8. Option Selector in Modals ---
  window.selectGameMode = function (btn, modeName) {
    playSound('click');
    document.querySelectorAll('.modal-option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };

  window.selectChipAmount = function (btn, amount) {
    playSound('click');
    document.querySelectorAll('.chip-option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const payBtn = document.getElementById('pay-chips-btn');
    if (payBtn) payBtn.textContent = `ADD ${amount} CHIPS`;
  };

  window.confirmGameStart = function () {
    playSound('win');
    closeModal('game-select-modal');
    showToast('Matching with online players...', '⚔️');
  };

  window.confirmTournamentEntry = function () {
    playSound('win');
    closeModal('tournament-modal');
    showToast('Entry Confirmed! Tournament starts at 10:00 PM', '🎟️');
  };

  window.confirmRecharge = function () {
    playSound('coin');
    closeModal('add-chips-modal');
    showToast('Payment Successful! +500 Chips Added', '💰');
    // Animate chips count
    const chipsElem = document.getElementById('chips-value');
    if (chipsElem) chipsElem.textContent = '12,950';
  };

  window.confirmWithdraw = function () {
    playSound('coin');
    closeModal('earnings-modal');
    showToast('Withdrawal request of ₹350 initiated to UPI!', '🏦');
  };

  window.closeAllModals = closeModal;

  // ==========================================================================
  // 9. DAILY LUCKY SPIN WHEEL ENGINE
  // ==========================================================================
  const WHEEL_PRIZES = [
    { label: '₹5 Cash', color: '#10b981', textColor: '#ffffff' },
    { label: '10 Gems 💎', color: '#3b82f6', textColor: '#ffffff' },
    { label: '₹50 Bonus', color: '#f59e0b', textColor: '#ffffff' },
    { label: '2x XP', color: '#8b5cf6', textColor: '#ffffff' },
    { label: '₹2 Cash', color: '#059669', textColor: '#ffffff' },
    { label: '₹100 WIN 👑', color: '#d97706', textColor: '#ffffff' },
    { label: '₹10 Bonus', color: '#ec4899', textColor: '#ffffff' },
    { label: '50 Stars ⭐', color: '#0288d1', textColor: '#ffffff' }
  ];

  let currentRotation = 0;
  let isSpinning = false;

  window.openDailySpinModal = function () {
    playSound('click');
    const modal = document.getElementById('modal-spin-wheel');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('show');
    }
    setTimeout(drawWheel, 50);
  };

  window.closeDailySpinModal = function () {
    playSound('click');
    const modal = document.getElementById('modal-spin-wheel');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  };

  function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numSlices = WHEEL_PRIZES.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    WHEEL_PRIZES.forEach((slice, i) => {
      const angle = i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text labels
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = slice.textColor;
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillText(slice.label, radius - 18, 4);
      ctx.restore();
    });
  }

  window.triggerWheelSpin = function () {
    if (isSpinning) return;
    isSpinning = true;
    playSound('coin');

    const resultText = document.getElementById('spin-result-text');
    if (resultText) resultText.textContent = '🎡 Spinning... Best of luck!';

    // Random slice (0 to 7)
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceDeg = 360 / WHEEL_PRIZES.length;
    
    // Calculate rotation to land under top pointer (270 deg / top)
    const extraTurns = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rounds
    const targetDeg = extraTurns * 360 + (360 - (prizeIndex * sliceDeg + sliceDeg / 2)) - 90;

    currentRotation += targetDeg;

    const canvas = document.getElementById('wheel-canvas');
    if (canvas) {
      canvas.style.transform = `rotate(${currentRotation}deg)`;
    }

    setTimeout(() => {
      isSpinning = false;
      const wonPrize = WHEEL_PRIZES[prizeIndex];
      playSound('win');
      if (resultText) {
        resultText.innerHTML = `🎉 CONGRATULATIONS! You Won <strong>${wonPrize.label}</strong>!`;
      }
      showToast(`Won ${wonPrize.label}! Credited to Wallet 🎁`, '🎉');
    }, 4100);
  };

  // Initialize interactive ripple effects
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Ludo Tournament UI initialized successfully.');
  });
})();
