/**
 * PLAYER PROFILE & SIDEBAR DRAWER INTERACTION ENGINE
 * Complete user profile dashboard, passbook transactions ledger, and drawer modals.
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

  // --- 3. Sidebar Drawer Controllers ---
  window.openSidebarDrawer = function () {
    playSound('click');
    const drawer = document.getElementById('sidebar-drawer');
    if (drawer) drawer.classList.add('open');
  };

  window.closeSidebarDrawer = function () {
    playSound('click');
    const drawer = document.getElementById('sidebar-drawer');
    if (drawer) drawer.classList.remove('open');
  };

  // --- 4. Modal Generic Controllers ---
  window.openModal = function (modalId) {
    playSound('click');
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
  };

  window.closeModal = function (modalId) {
    playSound('click');
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  };

  // Specific Modal Openers
  window.openEditProfileModal = function () { openModal('modal-edit-profile'); };
  window.openWithdrawModal = function () { openModal('modal-withdraw-cash'); };
  window.openKycModal = function () { openModal('modal-kyc'); };
  window.openGameRulesModal = function () { openModal('modal-game-rules'); };
  window.openHowToPlayModal = function () { openModal('modal-game-rules'); };
  window.openSettingsModal = function () { openModal('modal-settings'); };
  window.openSupportModal = function () { openModal('modal-support'); };
  window.openTermsModal = function () { showToast('Terms: 100% Fairplay Certified', '⚖️'); };
  window.openPrivacyModal = function () { showToast('Privacy: 256-Bit SSL Encrypted', '🔒'); };
  window.openLogoutModal = function () { openModal('modal-logout'); };
  window.openNotificationsModal = function () { showToast('3 Match Invites & Result Updates', '🔔'); };
  window.openLanguageModal = function () { showToast('Languages: English & Hindi supported', '🌐'); };

  // --- 4B. Game-Wise Breakdown Modal Engine ---
  window.openGamewiseModal = function (filter = 'all') {
    openModal('modal-gamewise-stats');
    const tabChips = document.querySelectorAll('.gw-tab-chip');
    if (tabChips.length) {
      tabChips.forEach(chip => {
        const text = chip.textContent.toLowerCase();
        if ((filter === 'all' && text.includes('all')) ||
            (filter === 'classic' && text.includes('classic')) ||
            (filter === 'quick' && text.includes('quick')) ||
            (filter === 'snake' && text.includes('snake'))) {
          filterGamewiseModal(filter, chip);
        }
      });
    }
  };

  window.filterGamewiseModal = function (category, btn) {
    playSound('click');
    document.querySelectorAll('.gw-tab-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const classicCard = document.getElementById('gw-card-classic');
    const quickCard = document.getElementById('gw-card-quick');
    const snakeCard = document.getElementById('gw-card-snake');

    const totalMatchesEl = document.getElementById('gw-total-matches');
    const totalWinsEl = document.getElementById('gw-total-wins');
    const totalRateEl = document.getElementById('gw-total-rate');
    const totalCashEl = document.getElementById('gw-total-cash');

    if (category === 'all') {
      if (classicCard) classicCard.style.display = 'block';
      if (quickCard) quickCard.style.display = 'block';
      if (snakeCard) snakeCard.style.display = 'block';
      if (totalMatchesEl) totalMatchesEl.textContent = '126';
      if (totalWinsEl) totalWinsEl.textContent = '78';
      if (totalRateEl) totalRateEl.textContent = '61.9%';
      if (totalCashEl) totalCashEl.textContent = '₹8,420';
    } else if (category === 'classic') {
      if (classicCard) classicCard.style.display = 'block';
      if (quickCard) quickCard.style.display = 'none';
      if (snakeCard) snakeCard.style.display = 'none';
      if (totalMatchesEl) totalMatchesEl.textContent = '85';
      if (totalWinsEl) totalWinsEl.textContent = '52';
      if (totalRateEl) totalRateEl.textContent = '61.2%';
      if (totalCashEl) totalCashEl.textContent = '₹5,720';
    } else if (category === 'quick') {
      if (classicCard) classicCard.style.display = 'none';
      if (quickCard) quickCard.style.display = 'block';
      if (snakeCard) snakeCard.style.display = 'none';
      if (totalMatchesEl) totalMatchesEl.textContent = '25';
      if (totalWinsEl) totalWinsEl.textContent = '16';
      if (totalRateEl) totalRateEl.textContent = '64.0%';
      if (totalCashEl) totalCashEl.textContent = '₹1,760';
    } else if (category === 'snake') {
      if (classicCard) classicCard.style.display = 'none';
      if (quickCard) quickCard.style.display = 'none';
      if (snakeCard) snakeCard.style.display = 'block';
      if (totalMatchesEl) totalMatchesEl.textContent = '16';
      if (totalWinsEl) totalWinsEl.textContent = '10';
      if (totalRateEl) totalRateEl.textContent = '62.5%';
      if (totalCashEl) totalCashEl.textContent = '₹940';
    }
  };

  // --- 4C. Achievements & Badges Showcase Engine ---
  window.openAchievementsModal = function (filter = 'all') {
    openModal('modal-achievements');
    const tabChips = document.querySelectorAll('.achieve-tab-chip');
    if (tabChips.length) {
      if (filter === 'all' || filter === 'first_win' || filter === 'streak' || filter === 'big_winner' || filter === 'quick') {
        filterAchievementsModal('all', tabChips[0]);
      } else if (filter === 'unlocked') {
        filterAchievementsModal('unlocked', tabChips[1]);
      } else if (filter === 'locked') {
        filterAchievementsModal('locked', tabChips[2]);
      }
    }
  };

  window.filterAchievementsModal = function (statusFilter, btn) {
    playSound('click');
    document.querySelectorAll('.achieve-tab-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.achieve-badge-card');
    cards.forEach(card => {
      const cardStatus = card.getAttribute('data-status');
      if (statusFilter === 'all') {
        card.style.display = 'flex';
      } else if (statusFilter === 'unlocked') {
        card.style.display = cardStatus === 'unlocked' ? 'flex' : 'none';
      } else if (statusFilter === 'locked') {
        card.style.display = cardStatus === 'locked' ? 'flex' : 'none';
      }
    });
  };

  // --- 5. Edit Profile Logic ---
  let selectedAvatarUrl = 'assets/avatar_rajendra.png';

  window.selectProfileAvatar = function (avatarSrc, wrapEl) {
    playSound('click');
    selectedAvatarUrl = avatarSrc;
    document.querySelectorAll('.avatar-option-wrap').forEach(el => el.classList.remove('active'));
    if (wrapEl) wrapEl.classList.add('active');
  };

  window.saveProfileChanges = function () {
    playSound('coin');
    const newName = document.getElementById('edit-input-name').value.trim() || 'Rajendra';
    const newEmail = document.getElementById('edit-input-email').value.trim() || 'rajendra.pro@gmail.com';

    // Update DOM
    const dNameEl = document.getElementById('user-display-name');
    if (dNameEl) dNameEl.textContent = newName;
    const accNameEl = document.getElementById('acc-name-val');
    if (accNameEl) accNameEl.textContent = newName;
    const accEmailEl = document.getElementById('acc-email-val');
    if (accEmailEl) accEmailEl.textContent = newEmail;
    const dAvatarEl = document.getElementById('user-display-avatar');
    if (dAvatarEl) dAvatarEl.src = selectedAvatarUrl;

    const drawerAvatarEl = document.getElementById('drawer-user-avatar');
    if (drawerAvatarEl) drawerAvatarEl.src = selectedAvatarUrl;
    const drawerNameEl = document.getElementById('drawer-user-name');
    if (drawerNameEl) drawerNameEl.textContent = newName;

    closeModal('modal-edit-profile');
    showToast('Profile updated successfully!', '✅');
  };

  // Copy Player ID & Referral Code
  window.copyPlayerId = function () {
    playSound('click');
    navigator.clipboard.writeText('LD10458').then(() => {
      showToast('Player ID Copied: LD10458', '📋');
    });
  };

  window.copyReferralCode = function () {
    playSound('coin');
    navigator.clipboard.writeText('LD84721').then(() => {
      showToast('Referral Code Copied: LD84721', '🎁');
    });
  };

  window.shareReferralCode = function () {
    playSound('click');
    const text = 'Join me on Ludo Bet! Use my code LD84721 to get ₹100 Free Bonus & win real cash!';
    if (navigator.share) {
      navigator.share({ title: 'Ludo Bet Referral', text: text, url: window.location.origin });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // --- 6. Withdraw Cash Flow ---
  window.selectPayoutMethod = function (cardEl) {
    playSound('click');
    document.querySelectorAll('.payout-method-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');
  };

  window.submitWithdrawalRequest = function () {
    const amt = parseInt(document.getElementById('withdraw-amount-input').value) || 0;
    if (amt < 50) {
      showToast('Minimum withdrawal is ₹50', '⚠️');
      return;
    }
    if (amt > 350) {
      showToast('Insufficient withdrawable balance', '⚠️');
      return;
    }

    playSound('coin');
    closeModal('modal-withdraw-cash');
    document.getElementById('earnings-val').textContent = (350 - amt);
    showToast(`Withdrawal of ₹${amt} initiated to UPI!`, '💸');
  };

  // --- 7. Comprehensive All-In-One Transaction History Ledger ---
  const TRANSACTIONS_DATA = [
    { type: 'won', title: 'Ludo Classic Battle Won', time: 'Today, 03:45 PM', amount: '+₹36.00', status: 'Credited' },
    { type: 'lost', title: 'Ludo Classic Entry Fee', time: 'Today, 01:20 PM', amount: '-₹20.00', status: 'Debited' },
    { type: 'deposit', title: 'Added Cash via GPay UPI', time: 'Yesterday, 07:15 PM', amount: '+₹500.00', status: 'Success' },
    { type: 'withdraw', title: 'Bank Withdrawal to HDFC', time: '21 Aug, 04:30 PM', amount: '-₹400.00', status: 'Transferred' },
    { type: 'refer', title: 'Referral Bonus: Amit Joined', time: '20 Aug, 11:00 AM', amount: '+₹100.00', status: 'Bonus Credited' },
    { type: 'won', title: 'Snake & Ladders Battle Won', time: '19 Aug, 09:12 PM', amount: '+₹90.00', status: 'Credited' },
    { type: 'lost', title: 'Ludo Quick Battle Lost', time: '18 Aug, 06:40 PM', amount: '-₹50.00', status: 'Debited' },
    { type: 'penalty', title: 'Match Disconnect Penalty', time: '15 Aug, 02:10 PM', amount: '-₹10.00', status: 'Auto Deducted' }
  ];

  window.openTransactionHistoryModal = function (filter = 'all') {
    openModal('modal-transaction-history');
    filterTransactions(filter, document.querySelector(`.txn-filter-btn[onclick*="${filter}"]`) || document.querySelector('.txn-filter-btn'));
  };

  window.filterTransactions = function (filter, btn) {
    playSound('click');
    if (btn) {
      document.querySelectorAll('.txn-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    const container = document.getElementById('all-transactions-list');
    if (!container) return;

    const filtered = filter === 'all' 
      ? TRANSACTIONS_DATA 
      : TRANSACTIONS_DATA.filter(t => t.type === filter);

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#78909c; font-size:12px;">No transactions found in this category.</div>';
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isPositive = t.amount.startsWith('+');
      const iconMap = {
        won: '🏆',
        lost: '⚔️',
        deposit: '💳',
        withdraw: '💸',
        refer: '🎁',
        penalty: '⚠️'
      };

      return `
        <div class="txn-card">
          <div class="txn-card-left">
            <div class="txn-type-circle ${t.type}">${iconMap[t.type] || '📜'}</div>
            <div class="txn-meta">
              <span class="txn-title">${t.title}</span>
              <span class="txn-time">${t.time}</span>
            </div>
          </div>
          <div class="txn-card-right">
            <span class="txn-amount ${isPositive ? 'green' : 'red'}">${t.amount}</span>
            <span class="txn-status-tag">${t.status}</span>
          </div>
        </div>
      `;
    }).join('');
  };

  // --- 8. Settings & Logout ---
  window.switchLanguage = function (lang, btn) {
    playSound('click');
    document.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    showToast(lang === 'hi' ? 'भाषा: हिंदी चुनी गई 🇮🇳' : 'Language: English Selected 🇺🇸', '🌐');
  };

  window.toggleSoundSetting = function (checkbox) {
    if (checkbox.checked) {
      playSound('coin');
      showToast('Sound Effects Enabled 🔊', '🔊');
    } else {
      showToast('Sound Effects Muted 🔇', '🔇');
    }
  };

  window.performLogout = function () {
    playSound('click');
    closeModal('modal-logout');
    showToast('Logged out securely. Redirecting...', '🚪');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  };

  // Close backdrops on click
  document.querySelectorAll('.flow-modal-backdrop, .drawer-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('show');
        backdrop.classList.remove('open');
      }
    });
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile & Drawer Engine Initialized.');
  });

})();
