/**
 * MY WALLET (DEPOSIT ONLY) ENGINE
 * Handles presets, coupon codes, payment methods, QR timer, and checkout flow.
 */

(function () {
  'use strict';

  // --- 1. Audio Engine ---
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
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'coin') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.3, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    }
  }

  // --- 2. Toast System ---
  let toastTimer = null;
  window.showToast = function (message, icon = '✨') {
    const toast = document.getElementById('toast-msg');
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  };

  // --- 3. Wallet State & Datasets ---
  const state = {
    totalBalance: 12450,
    depositBalance: 10250,
    bonusBalance: 2200,
    currentAmount: 500,
    currentBonus: 100,
    appliedPromo: null,
    selectedMethod: 'gpay',
    qrTimerSeconds: 299,
    qrInterval: null
  };

  const DEPOSIT_HISTORY = [
    { id: 'TXN_8849102', method: 'Google Pay', icon: 'assets/icon_gpay.svg', amount: 500, bonus: 100, date: 'Today, 02:45 PM', status: 'success' },
    { id: 'TXN_8841923', method: 'PhonePe UPI', icon: 'assets/icon_phonepe.svg', amount: 200, bonus: 30, date: 'Yesterday, 07:15 PM', status: 'success' },
    { id: 'TXN_8830114', method: 'Scan QR Code', icon: 'assets/icon_upi.svg', amount: 1000, bonus: 250, date: '16 Aug 2026', status: 'success' },
    { id: 'TXN_8819401', method: 'Debit Card (Visa)', icon: 'assets/icon_cards.svg', amount: 100, bonus: 10, date: '14 Aug 2026', status: 'success' }
  ];

  // --- 4. Render Deposit History ---
  function renderHistory() {
    const container = document.getElementById('deposit-history-container');
    if (!container) return;

    container.innerHTML = DEPOSIT_HISTORY.map(item => `
      <div class="deposit-item-card">
        <div class="deposit-item-left">
          <img src="${item.icon}" alt="${item.method}" class="deposit-type-icon">
          <div class="deposit-item-meta">
            <span class="deposit-item-name">${item.method}</span>
            <span class="deposit-item-date">${item.date} • ${item.id}</span>
          </div>
        </div>
        <div class="deposit-item-right">
          <span class="deposit-item-amount">+₹${item.amount}</span>
          <span class="deposit-status-badge ${item.status}">
            ${item.status === 'success' ? 'SUCCESS ✅' : 'PENDING ⏳'}
          </span>
        </div>
      </div>
    `).join('');
  }

  // --- 5. Presets & Amount Inputs ---
  window.selectDepositPreset = function (amt, bonus, btn) {
    playSound('click');
    state.currentAmount = amt;
    state.currentBonus = bonus;

    const input = document.getElementById('deposit-amount-input');
    if (input) input.value = amt;

    const tag = document.getElementById('deposit-bonus-hint');
    if (tag) tag.textContent = `+₹${bonus} Bonus`;

    document.querySelectorAll('.deposit-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    updateDepositButtonText();
  };

  const amountInput = document.getElementById('deposit-amount-input');
  if (amountInput) {
    amountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 0;
      state.currentAmount = val;
      state.currentBonus = Math.round(val * 0.15); // 15% default bonus

      const tag = document.getElementById('deposit-bonus-hint');
      if (tag) tag.textContent = `+₹${state.currentBonus} Bonus`;

      document.querySelectorAll('.deposit-chip-btn').forEach(b => b.classList.remove('active'));
      updateDepositButtonText();
    });
  }

  function updateDepositButtonText() {
    const btnText = document.getElementById('btn-deposit-text');
    if (btnText) {
      btnText.textContent = `ADD ₹${state.currentAmount.toLocaleString()} CASH NOW ➔`;
    }
  }

  // --- 6. Promo Codes ---
  window.setPromo = function (code) {
    playSound('click');
    const input = document.getElementById('promo-code-input');
    if (input) input.value = code;
    handleApplyPromo();
  };

  window.handleApplyPromo = function () {
    const input = document.getElementById('promo-code-input');
    const code = input ? input.value.trim().toUpperCase() : '';

    if (!code) {
      showToast('Please enter a valid coupon code', '⚠️');
      return;
    }

    playSound('coin');
    if (code === 'FIRST100') {
      state.currentBonus = state.currentAmount; // 100% bonus
      state.appliedPromo = code;
      showToast('Coupon FIRST100 Applied! 100% Extra Bonus added!', '🎉');
    } else if (code === 'LUDO50') {
      state.currentBonus += 50;
      state.appliedPromo = code;
      showToast('Coupon LUDO50 Applied! Flat ₹50 Instant Cash added!', '🎁');
    } else {
      showToast('Invalid or expired coupon code', '❌');
      return;
    }

    const tag = document.getElementById('deposit-bonus-hint');
    if (tag) tag.textContent = `+₹${state.currentBonus} Bonus (${code})`;
  };

  // --- 7. Payment Methods ---
  window.selectPaymentMethod = function (method, card) {
    playSound('click');
    state.selectedMethod = method;
    document.querySelectorAll('.pay-method-card').forEach(c => c.classList.remove('selected'));
    if (card) card.classList.add('selected');
  };

  // --- 8. Checkout & Deposit Flow ---
  window.startDepositFlow = function () {
    if (state.currentAmount < 10) {
      showToast('Minimum deposit amount is ₹10', '⚠️');
      return;
    }

    playSound('coin');

    // Update title in checkout modal
    const checkoutTitle = document.getElementById('checkout-amount-title');
    if (checkoutTitle) {
      checkoutTitle.textContent = `Pay ₹${state.currentAmount.toLocaleString()}`;
    }

    // Open QR / UPI checkout modal
    const modal = document.getElementById('modal-qr-checkout');
    if (modal) modal.classList.add('show');

    startQRCountdown();
  };

  function startQRCountdown() {
    clearInterval(state.qrInterval);
    state.qrTimerSeconds = 299; // 5 mins

    const timerEl = document.getElementById('qr-expiry-timer');

    state.qrInterval = setInterval(() => {
      state.qrTimerSeconds--;
      if (state.qrTimerSeconds <= 0) {
        clearInterval(state.qrInterval);
        closeDepositModal('modal-qr-checkout');
        showToast('Payment session expired. Please try again.', '⏱️');
        return;
      }

      const mins = Math.floor(state.qrTimerSeconds / 60);
      const secs = state.qrTimerSeconds % 60;
      if (timerEl) {
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }, 1000);
  }

  window.copyUPIAddress = function () {
    playSound('coin');
    navigator.clipboard.writeText('ludobet.pay@icici').then(() => {
      showToast('UPI ID Copied: ludobet.pay@icici', '📋');
    });
  };

  // Simulated Payment Processing
  window.simulatePaymentProcessing = function () {
    clearInterval(state.qrInterval);
    closeDepositModal('modal-qr-checkout');

    // Open processing modal
    const procModal = document.getElementById('modal-processing-payment');
    if (procModal) procModal.classList.add('show');

    setTimeout(() => {
      if (procModal) procModal.classList.remove('show');
      completeDepositSuccess();
    }, 1600);
  };

  function completeDepositSuccess() {
    playSound('win');

    // Update balances
    state.depositBalance += state.currentAmount;
    state.bonusBalance += state.currentBonus;
    state.totalBalance = state.depositBalance + state.bonusBalance;

    // Update UI Elements
    const totalEl = document.getElementById('wallet-total-val');
    const depositEl = document.getElementById('wallet-deposit-val');
    const bonusEl = document.getElementById('wallet-bonus-val');
    const chipsHeaderEl = document.getElementById('chips-val');

    if (totalEl) totalEl.textContent = state.totalBalance.toLocaleString();
    if (depositEl) depositEl.textContent = `₹${state.depositBalance.toLocaleString()}`;
    if (bonusEl) bonusEl.textContent = `₹${state.bonusBalance.toLocaleString()}`;
    if (chipsHeaderEl) chipsHeaderEl.textContent = state.totalBalance.toLocaleString();

    // Generate Transaction ID
    const newTxnId = `TXN_${Math.floor(1000000 + Math.random() * 9000000)}`;

    // Update Receipt in Modal
    const rTxn = document.getElementById('receipt-txnid');
    const rDep = document.getElementById('receipt-deposit-amt');
    const rBon = document.getElementById('receipt-bonus-amt');
    const rBal = document.getElementById('receipt-new-balance');
    const rHead = document.getElementById('success-modal-heading');

    if (rTxn) rTxn.textContent = newTxnId;
    if (rDep) rDep.textContent = `₹${state.currentAmount.toLocaleString()}`;
    if (rBon) rBon.textContent = `+₹${state.currentBonus.toLocaleString()}`;
    if (rBal) rBal.textContent = `₹${state.totalBalance.toLocaleString()}`;
    if (rHead) rHead.textContent = `₹${state.currentAmount.toLocaleString()} Added Successfully!`;

    // Add to Deposit History
    DEPOSIT_HISTORY.unshift({
      id: newTxnId,
      method: state.selectedMethod.toUpperCase(),
      icon: `assets/icon_${state.selectedMethod === 'card' ? 'cards' : (state.selectedMethod === 'qr' ? 'upi' : state.selectedMethod)}.svg`,
      amount: state.currentAmount,
      bonus: state.currentBonus,
      date: 'Just now',
      status: 'success'
    });
    renderHistory();

    // Show Success Modal
    const succModal = document.getElementById('modal-deposit-success');
    if (succModal) succModal.classList.add('show');
  }

  window.closeDepositModal = function (modalId) {
    playSound('click');
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  };

  // Close backdrops on click
  document.querySelectorAll('.flow-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('show');
      }
    });
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    console.log('Wallet Deposit Page Live & Fully Functional.');
  });

})();
