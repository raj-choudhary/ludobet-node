/**
 * LUDO CLASSIC BATTLE ARENA - INTERACTIVE FLOW ENGINE
 * Handles Battle Creation (Public/Private), Room Code Joining, Dynamic Battle List,
 * Countdown Timers, Sound Effects, and State Management.
 */

(function () {
  'use strict';

  // --- 1. Synthesized Web Audio Engine ---
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
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.2, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.07 + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.18);
      });
    } else if (type === 'tick') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
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

  // --- 3. Battles State (Open & Running) ---
  let currentTab = 'open'; // 'open' or 'running'

  let battlesData = [
    { id: 'b1', name: 'Rahul Kumar', trophy: 1250, avatar: 'assets/avatar_rahul.png', entry: 10, prize: 18, players: '1 / 2', mode: '2 Players' },
    { id: 'b2', name: 'Amit Singh', trophy: 980, avatar: 'assets/avatar_amit.png', entry: 20, prize: 36, players: '1 / 2', mode: '2 Players' },
    { id: 'b3', name: 'Vikash Yadav', trophy: 760, avatar: 'assets/avatar_vikash.png', entry: 50, prize: 90, players: '1 / 2', mode: '2 Players' },
    { id: 'b4', name: 'Neha Sharma', trophy: 1130, avatar: 'assets/avatar_neha.png', entry: 100, prize: 180, players: '1 / 2', mode: '2 Players' },
    { id: 'b5', name: 'Player 45', trophy: 640, avatar: 'assets/avatar_player45.png', entry: 200, prize: 360, players: '1 / 2', mode: '2 Players' }
  ];

  let runningBattlesData = [
    { id: 'rb1', p1Name: 'Rahul Kumar', p1Avatar: 'assets/avatar_rahul.png', p2Name: 'Amit Singh', p2Avatar: 'assets/avatar_amit.png', entry: 50, prize: 90, duration: '03:42' },
    { id: 'rb2', p1Name: 'Vikash Yadav', p1Avatar: 'assets/avatar_vikash.png', p2Name: 'Neha Sharma', p2Avatar: 'assets/avatar_neha.png', entry: 100, prize: 180, duration: '07:15' },
    { id: 'rb3', p1Name: 'Sanjay Roy', p1Avatar: 'assets/avatar_player45.png', p2Name: 'Deepak Rao', p2Avatar: 'assets/avatar_rahul.png', entry: 20, prize: 36, duration: '02:08' },
    { id: 'rb4', p1Name: 'Pooja Verma', p1Avatar: 'assets/avatar_neha.png', p2Name: 'Karan Mehra', p2Avatar: 'assets/avatar_amit.png', entry: 200, prize: 360, duration: '11:50' }
  ];

  let currentCreatedBattle = {
    amount: 20,
    prize: 36,
    type: 'public', // 'public' or 'private'
    roomCode: '84721'
  };

  // --- 4. Tab Switcher (Open vs Running) ---
  window.switchBattleTab = function (tabName) {
    playSound('click');
    currentTab = tabName;

    const openTabBtn = document.getElementById('tab-open-battles');
    const runningTabBtn = document.getElementById('tab-running-battles');

    if (tabName === 'open') {
      if (openTabBtn) openTabBtn.classList.add('active');
      if (runningTabBtn) runningTabBtn.classList.remove('active');
    } else {
      if (runningTabBtn) runningTabBtn.classList.add('active');
      if (openTabBtn) openTabBtn.classList.remove('active');
    }

    renderBattles();
  };

  window.handleWatchBattle = function (id) {
    playSound('click');
    window.location.href = 'game-play.html';
  };

  // --- 5. Render Battles List ---
  function renderBattles() {
    const listContainer = document.getElementById('battles-list-container');
    if (!listContainer) return;

    if (currentTab === 'running') {
      // Render Live Running Battles
      listContainer.innerHTML = runningBattlesData.map(rb => `
        <div class="running-battle-card" id="card-${rb.id}">
          <div class="running-top-row">
            <div class="running-live-status">
              <span class="badge-live-pulse">● LIVE</span>
              <span>${rb.duration}</span>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #627d98;">
              2 Players Match
            </div>
          </div>

          <div class="running-players-duel">
            <div class="duel-player">
              <img class="duel-avatar" src="${rb.p1Avatar}" alt="${rb.p1Name}">
              <span class="duel-name">${rb.p1Name}</span>
            </div>
            <span class="duel-vs-badge">VS</span>
            <div class="duel-player">
              <span class="duel-name">${rb.p2Name}</span>
              <img class="duel-avatar" src="${rb.p2Avatar}" alt="${rb.p2Name}">
            </div>
          </div>

          <div class="running-bottom-row">
            <div style="display: flex; gap: 14px;">
              <div>
                <span class="battle-data-label">Entry: </span>
                <span class="battle-data-val-entry">₹${rb.entry}</span>
              </div>
              <div>
                <span class="battle-data-label">Prize: </span>
                <span class="battle-data-val-prize">₹${rb.prize}</span>
              </div>
            </div>
            <button class="btn-watch-battle" onclick="handleWatchBattle('${rb.id}')">
              👁 SPECTATE
            </button>
          </div>
        </div>
      `).join('');
      return;
    }

    // Otherwise Render Open Battles
    const sortSelect = document.getElementById('sort-select');
    const sortVal = sortSelect ? sortSelect.value : 'low';

    let list = [...battlesData];

    if (sortVal === 'low') {
      list.sort((a, b) => a.entry - b.entry);
    } else if (sortVal === 'high') {
      list.sort((a, b) => b.entry - a.entry);
    } else if (sortVal === 'prize') {
      list.sort((a, b) => b.prize - a.prize);
    }

    listContainer.innerHTML = list.map(b => `
      <div class="battle-item-card" id="card-${b.id}">
        <div class="player-info-col">
          <div class="player-avatar-wrapper">
            <img class="player-avatar-img" src="${b.avatar}" alt="${b.name}">
            <span class="online-indicator"></span>
          </div>
          <div class="player-details">
            <span class="player-name">${b.name}</span>
            <span class="player-trophy">🏆 ${b.trophy}</span>
          </div>
        </div>
        <div class="battle-data-col">
          <span class="battle-data-label">Entry</span>
          <span class="battle-data-val-entry">₹${b.entry}</span>
        </div>
        <div class="battle-data-col">
          <span class="battle-data-label">Prize</span>
          <span class="battle-data-val-prize">₹${b.prize}</span>
        </div>
        <div class="battle-data-col">
          <span class="battle-data-val-players">${b.players}</span>
          <span class="battle-data-sub-players">👥 2 Players</span>
        </div>
        <div>
          <button class="btn-join-battle" onclick="handleJoinOpenBattle('${b.id}', ${b.entry}, ${b.prize}, '${b.name}')">JOIN</button>
        </div>
      </div>
    `).join('');
  }

  // --- 5. Modal Helpers ---
  function openFlowModal(modalId) {
    playSound('click');
    const m = document.getElementById(modalId);
    if (m) m.classList.add('show');
  }

  function closeFlowModal(modalId) {
    playSound('click');
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('show');
  }

  // Close backdrops on click
  document.querySelectorAll('.flow-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('show');
      }
    });
  });

  // --- 6. Create Battle Flow ---
  window.setPresetAmount = function (amount, btn) {
    playSound('click');
    document.querySelectorAll('.preset-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const input = document.getElementById('create-entry-amount');
    if (input) input.value = amount;
  };

  window.startCreateBattleFlow = function () {
    const input = document.getElementById('create-entry-amount');
    let val = parseInt(input ? input.value : '20', 10);
    if (isNaN(val) || val < 1) {
      showToast('Please enter a valid entry amount', '⚠️');
      return;
    }

    playSound('coin');
    currentCreatedBattle.amount = val;
    // Calculate Prize: (Entry * 2) - 10% platform fee
    currentCreatedBattle.prize = Math.round(val * 2 * 0.9);
    // Generate 5-digit room code
    currentCreatedBattle.roomCode = Math.floor(10000 + Math.random() * 90000).toString();

    // Open Step 2: Choose Battle Type
    openFlowModal('modal-step2-choose-type');
  };

  window.selectBattleTypeOption = function (card, type) {
    playSound('click');
    document.querySelectorAll('.battle-type-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    currentCreatedBattle.type = type;
  };

  window.confirmBattleType = function () {
    closeFlowModal('modal-step2-choose-type');
    playSound('success');

    if (currentCreatedBattle.type === 'public') {
      // Step 3A: Public Battle Created
      document.getElementById('public-created-entry').textContent = `₹${currentCreatedBattle.amount}`;
      document.getElementById('public-created-prize').textContent = `₹${currentCreatedBattle.prize}`;
      openFlowModal('modal-step3a-public-created');

      // Add to Open Battles list
      const newBattle = {
        id: 'b_' + Date.now(),
        name: 'You (Host)',
        trophy: 1280,
        avatar: 'assets/avatar_rahul.png',
        entry: currentCreatedBattle.amount,
        prize: currentCreatedBattle.prize,
        players: '1 / 2',
        mode: '2 Players'
      };
      battlesData.unshift(newBattle);
      renderBattles();
    } else {
      // Step 3B: Private Battle Created
      document.getElementById('private-created-entry').textContent = `₹${currentCreatedBattle.amount}`;
      document.getElementById('private-created-prize').textContent = `₹${currentCreatedBattle.prize}`;
      
      const codeDigits = currentCreatedBattle.roomCode.split('');
      const digitsContainer = document.getElementById('private-code-digits');
      if (digitsContainer) {
        digitsContainer.innerHTML = codeDigits.map(d => `<div class="pin-digit-box">${d}</div>`).join('');
      }

      openFlowModal('modal-step3b-private-created');
    }
  };

  window.copyRoomCode = function () {
    playSound('click');
    navigator.clipboard.writeText(currentCreatedBattle.roomCode).then(() => {
      showToast(`Room Code ${currentCreatedBattle.roomCode} copied!`, '📋');
    }).catch(() => {
      showToast(`Room Code: ${currentCreatedBattle.roomCode}`, '📋');
    });
  };

  window.shareRoomCode = function () {
    playSound('click');
    const shareText = `Play Ludo with me! Join my Private Battle with Room Code: ${currentCreatedBattle.roomCode} (Entry ₹${currentCreatedBattle.amount}, Win ₹${currentCreatedBattle.prize})!`;
    if (navigator.share) {
      navigator.share({ title: 'Ludo Tournament', text: shareText });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // --- 7. Join Private Battle Flow ---
  window.openJoinPrivateModal = function () {
    playSound('click');
    // Clear PIN inputs
    for (let i = 1; i <= 5; i++) {
      const pin = document.getElementById(`pin-${i}`);
      if (pin) pin.value = '';
    }
    openFlowModal('modal-step4-enter-code');
    setTimeout(() => {
      const p1 = document.getElementById('pin-1');
      if (p1) p1.focus();
    }, 200);
  };

  window.handlePinInput = function (currIndex, e) {
    const curr = document.getElementById(`pin-${currIndex}`);
    if (e.inputType === 'deleteContentBackward') {
      if (currIndex > 1) {
        document.getElementById(`pin-${currIndex - 1}`).focus();
      }
      return;
    }
    if (curr && curr.value.length >= 1) {
      curr.value = curr.value.slice(-1);
      if (currIndex < 5) {
        document.getElementById(`pin-${currIndex + 1}`).focus();
      }
    }
  };

  window.submitJoinPrivateCode = function () {
    let code = '';
    for (let i = 1; i <= 5; i++) {
      const pin = document.getElementById(`pin-${i}`);
      if (pin) code += pin.value;
    }

    if (code.length < 5) {
      showToast('Please enter complete 5-digit Room Code', '⚠️');
      return;
    }

    playSound('click');
    closeFlowModal('modal-step4-enter-code');

    // Step 5: Joining Battle Verification Animation
    openFlowModal('modal-step5-joining-loader');
    const chk1 = document.getElementById('chk-1');
    const chk2 = document.getElementById('chk-2');
    const chk3 = document.getElementById('chk-3');

    chk1.classList.remove('active');
    chk2.classList.remove('active');
    chk3.classList.remove('active');

    setTimeout(() => {
      chk1.classList.add('active');
      playSound('tick');
    }, 400);

    setTimeout(() => {
      chk2.classList.add('active');
      playSound('tick');
    }, 800);

    setTimeout(() => {
      chk3.classList.add('active');
      playSound('tick');
    }, 1200);

    // After verification, proceed to Step 6: Joined Successfully
    setTimeout(() => {
      closeFlowModal('modal-step5-joining-loader');
      playSound('success');
      openFlowModal('modal-step6-joined-success');
      startMatchCountdown();
    }, 1600);
  };

  // --- 8. Join Open Battle Action ---
  window.handleJoinOpenBattle = function (id, entry, prize, name) {
    playSound('coin');
    document.getElementById('joined-entry-amount').textContent = `₹${entry}`;
    document.getElementById('joined-prize-amount').textContent = `₹${prize}`;
    openFlowModal('modal-step6-joined-success');
    startMatchCountdown();
  };

  // --- 9. Match Start Countdown Timer ---
  function startMatchCountdown() {
    let count = 3;
    const countdownElem = document.getElementById('match-countdown-num');
    if (countdownElem) countdownElem.textContent = count;

    const timer = setInterval(() => {
      count--;
      playSound('tick');
      if (countdownElem) countdownElem.textContent = count;

      if (count <= 0) {
        clearInterval(timer);
        closeFlowModal('modal-step6-joined-success');
        playSound('success');
        openFlowModal('modal-step7-game-starting');
        showToast('Game Starting! Good Luck!', '🎲');
        setTimeout(() => {
          window.location.href = 'match-room.html';
        }, 1800);
      }
    }, 1000);
  }

  // --- 10. Refresh and Filters ---
  window.refreshBattles = function () {
    playSound('click');
    const btn = document.getElementById('btn-refresh');
    if (btn) btn.classList.add('spinning');
    setTimeout(() => {
      if (btn) btn.classList.remove('spinning');
      renderBattles();
      showToast('Battles list refreshed', '🔄');
    }, 400);
  };

  window.handleSortChange = function () {
    playSound('click');
    renderBattles();
  };

  window.handlePlayerFilterChange = function () {
    playSound('click');
    renderBattles();
  };

  window.openHowItWorks = function () {
    playSound('click');
    openFlowModal('modal-how-it-works');
  };

  window.closeAllFlowModals = function (id) {
    closeFlowModal(id);
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderBattles();
    console.log('Ludo Classic Battle Arena Flow initialized.');
  });

})();
