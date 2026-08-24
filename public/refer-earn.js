/**
 * REFER & EARN ENGINE
 * Interactive referral code copying, social sharing, partner tiers, and rewards claiming.
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

  // --- 3. Datasets for Recent Referrals ---
  const REFERRALS_DATA = [
    { name: 'Rohan Gupta', avatar: 'assets/avatar_rahul.png', time: '10 mins ago', status: 'credited', amount: '₹100' },
    { name: 'Vikash Yadav', avatar: 'assets/avatar_vikash.png', time: '2 hours ago', status: 'credited', amount: '₹100' },
    { name: 'Neha Sharma', avatar: 'assets/avatar_neha.png', time: '5 hours ago', status: 'credited', amount: '₹100' },
    { name: 'Suresh Raina', avatar: 'assets/avatar_amit.png', time: 'Yesterday', status: 'pending', amount: 'Pending 1st Game' },
    { name: 'Pooja Verma', avatar: 'assets/avatar_neha.png', time: '2 days ago', status: 'credited', amount: '₹100' }
  ];

  function renderRecentReferrals() {
    const container = document.getElementById('referrals-list-container');
    if (!container) return;

    container.innerHTML = REFERRALS_DATA.map(r => `
      <div class="referral-activity-item">
        <div class="activity-user-col">
          <img class="activity-avatar-img" src="${r.avatar}" alt="${r.name}">
          <div class="activity-user-details">
            <span class="activity-user-name">${r.name}</span>
            <span class="activity-user-time">${r.time}</span>
          </div>
        </div>
        <div class="activity-reward-badge ${r.status}">
          ${r.status === 'credited' ? `+${r.amount} Credited ✅` : `⏳ ${r.amount}`}
        </div>
      </div>
    `).join('');
  }

  // --- 4. Copy Referral Code Handler ---
  const REFERRAL_CODE = 'LUDOKING99';
  const REFERRAL_SHARE_TEXT = `🎲 Join me on Ludo Bet & get ₹20 FREE Signup Cash!\nUse my referral code: ${REFERRAL_CODE}\nPlay real-money Ludo & Snake Battles: https://ludobet.app/invite?code=${REFERRAL_CODE}`;

  window.handleCopyReferralCode = function () {
    playSound('coin');
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      showCopyFeedback();
      showToast('Referral Code Copied to Clipboard!', '📋');
    }).catch(() => {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = REFERRAL_CODE;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showCopyFeedback();
      showToast('Referral Code Copied!', '📋');
    });
  };

  function showCopyFeedback() {
    const btn = document.getElementById('btn-copy-code');
    const text = document.getElementById('copy-btn-text');
    if (btn && text) {
      text.textContent = 'COPIED! ✅';
      btn.style.background = '#2cb730';
      setTimeout(() => {
        text.textContent = 'COPY';
        btn.style.background = 'linear-gradient(180deg, #7a39d0 0%, #512da8 100%)';
      }, 2000);
    }
  }

  // --- 5. Social Sharing Handlers ---
  window.shareOnWhatsApp = function () {
    playSound('click');
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(REFERRAL_SHARE_TEXT)}`;
    window.open(url, '_blank');
  };

  window.shareOnTelegram = function () {
    playSound('click');
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://ludobet.app')}&text=${encodeURIComponent(REFERRAL_SHARE_TEXT)}`;
    window.open(url, '_blank');
  };

  window.shareNative = function () {
    playSound('click');
    if (navigator.share) {
      navigator.share({
        title: 'Ludo Bet - Refer & Earn ₹100',
        text: REFERRAL_SHARE_TEXT,
        url: `https://ludobet.app/invite?code=${REFERRAL_CODE}`
      }).catch(() => {});
    } else {
      handleCopyReferralCode();
    }
  };

  // --- 6. Claim Rewards Flow ---
  window.handleClaimEarnings = function () {
    playSound('win');
    const modal = document.getElementById('modal-claim-success');
    if (modal) modal.classList.add('show');

    // Update Header
    const earningsEl = document.getElementById('earnings-val');
    const statClaimable = document.getElementById('stat-claimable');
    const btnClaim = document.getElementById('btn-claim-rewards');

    if (earningsEl) earningsEl.textContent = '0';
    if (statClaimable) statClaimable.textContent = '₹0';
    if (btnClaim) {
      btnClaim.innerHTML = '<span>✅</span><span>ALL EARNINGS CLAIMED</span>';
      btnClaim.style.background = '#6b7280';
      btnClaim.disabled = true;
    }
  };

  window.closeClaimModal = function () {
    playSound('click');
    const modal = document.getElementById('modal-claim-success');
    if (modal) modal.classList.remove('show');
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderRecentReferrals();
    console.log('Refer & Earn Page Initialized.');
  });

})();
