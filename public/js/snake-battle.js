/**
 * SNAKE & LADDERS BATTLE ARENA - ENGINE & DATA
 * Matches 100% with Classic Battle Theme & CSS Grid Architecture.
 * Features 2 Contest Modes (Race to 100 & 24-Move Rush), Open & Running Battles Tabs.
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

  // --- 3. Datasets for Snake & Ladders ---
  let currentSnakeMode = 'race'; // 'race' or 'rush'
  let currentTab = 'open'; // 'open' or 'running'

  const SNAKE_OPEN_BATTLES = {
    'race': [
      { id: 'snk_r_1', name: 'Rahul Kumar', trophy: 1250, avatar: 'assets/avatar_rahul.png', entry: 10, prize: 18, players: '1 / 2' },
      { id: 'snk_r_2', name: 'Amit Singh', trophy: 1420, avatar: 'assets/avatar_amit.png', entry: 20, prize: 36, players: '1 / 2' },
      { id: 'snk_r_3', name: 'Neha Sharma', trophy: 1380, avatar: 'assets/avatar_neha.png', entry: 50, prize: 90, players: '1 / 2' },
      { id: 'snk_r_4', name: 'Vikash Yadav', trophy: 1550, avatar: 'assets/avatar_vikash.png', entry: 100, prize: 180, players: '1 / 2' },
      { id: 'snk_r_5', name: 'Pooja Verma', trophy: 1190, avatar: 'assets/avatar_neha.png', entry: 200, prize: 360, players: '1 / 2' },
      { id: 'snk_r_6', name: 'Rohan Gupta', trophy: 1600, avatar: 'assets/avatar_rahul.png', entry: 500, prize: 900, players: '1 / 2' }
    ],
    'rush': [
      { id: 'snk_ru_1', name: 'Ladder Climber', trophy: 1490, avatar: 'assets/avatar_rahul.png', entry: 10, prize: 18, players: '1 / 2' },
      { id: 'snk_ru_2', name: 'Turbo Rusher', trophy: 1340, avatar: 'assets/avatar_amit.png', entry: 20, prize: 36, players: '1 / 2' },
      { id: 'snk_ru_3', name: 'Snake Dodger', trophy: 1520, avatar: 'assets/avatar_neha.png', entry: 50, prize: 90, players: '1 / 2' },
      { id: 'snk_ru_4', name: 'Venom King', trophy: 1680, avatar: 'assets/avatar_vikash.png', entry: 100, prize: 180, players: '1 / 2' },
      { id: 'snk_ru_5', name: 'Grand Master', trophy: 1750, avatar: 'assets/avatar_rahul.png', entry: 200, prize: 360, players: '1 / 2' }
    ]
  };

  const RUNNING_SNAKE_BATTLES = [
    { id: 'run_s_1', p1Name: 'Rahul Kumar', p1Avatar: 'assets/avatar_rahul.png', p2Name: 'Amit Singh', p2Avatar: 'assets/avatar_amit.png', entry: 50, prize: 90, duration: '02:14', mode: 'Race to 100' },
    { id: 'run_s_2', p1Name: 'Neha Sharma', p1Avatar: 'assets/avatar_neha.png', p2Name: 'Vikash Yadav', p2Avatar: 'assets/avatar_vikash.png', entry: 100, prize: 180, duration: '04:05', mode: '24-Move Rush' },
    { id: 'run_s_3', p1Name: 'Rohan Gupta', p1Avatar: 'assets/avatar_rahul.png', p2Name: 'Pooja Verma', p2Avatar: 'assets/avatar_neha.png', entry: 20, prize: 36, duration: '01:30', mode: 'Race to 100' }
  ];

  // --- 4. Render Battles List ---
  function renderBattles() {
    const listContainer = document.getElementById('snake-battles-container');
    if (!listContainer) return;

    if (currentTab === 'running') {
      listContainer.innerHTML = RUNNING_SNAKE_BATTLES.map(rb => `
        <div class="running-battle-card" id="card-${rb.id}">
          <div class="running-top-row">
            <div class="running-live-status">
              <span class="badge-live-pulse">● LIVE</span>
              <span>${rb.duration}</span>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #2e7d32; background: #e8f5e9; padding: 2px 8px; border-radius: 6px;">
              ${rb.mode}
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
            <button class="btn-watch-battle" onclick="window.location.href='snake-gameplay.html'">
              👁 SPECTATE
            </button>
          </div>
        </div>
      `).join('');
      return;
    }

    // Open Battles Mode
    const sortSelect = document.getElementById('snake-sort-select');
    const sortVal = sortSelect ? sortSelect.value : 'low';

    let list = [...SNAKE_OPEN_BATTLES[currentSnakeMode]];

    if (sortVal === 'low') list.sort((a, b) => a.entry - b.entry);
    else if (sortVal === 'high') list.sort((a, b) => b.entry - a.entry);
    else if (sortVal === 'prize') list.sort((a, b) => b.prize - a.prize);

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
          <button class="btn-join-battle" onclick="handleJoinSnake('${b.id}', ${b.entry})">JOIN</button>
        </div>
      </div>
    `).join('');
  }

  // --- 5. Mode Switcher (Race to 100 vs 24-Move Rush) ---
  window.switchSnakeMode = function (mode) {
    playSound('click');
    currentSnakeMode = mode;

    const tabRace = document.getElementById('tab-snake-race');
    const tabRush = document.getElementById('tab-snake-rush');
    const badgeText = document.getElementById('create-badge-text');

    if (mode === 'race') {
      if (tabRace) tabRace.classList.add('active');
      if (tabRush) tabRush.classList.remove('active');
      if (badgeText) badgeText.textContent = 'RACE TO 100 BATTLE';
    } else {
      if (tabRush) tabRush.classList.add('active');
      if (tabRace) tabRace.classList.remove('active');
      if (badgeText) badgeText.textContent = '24-MOVE RUSH BATTLE';
    }

    renderBattles();
  };

  // --- 6. Tab Switcher (Open vs Running) ---
  window.switchSnakeTab = function (tab) {
    playSound('click');
    currentTab = tab;

    const tabOpen = document.getElementById('tab-open-battles');
    const tabRunning = document.getElementById('tab-running-battles');

    if (tab === 'open') {
      if (tabOpen) tabOpen.classList.add('active');
      if (tabRunning) tabRunning.classList.remove('active');
    } else {
      if (tabRunning) tabRunning.classList.add('active');
      if (tabOpen) tabOpen.classList.remove('active');
    }

    renderBattles();
  };

  // --- 7. Presets & Controls ---
  window.setPresetSnakeAmount = function (val, btn) {
    playSound('click');
    const input = document.getElementById('snake-entry-amount');
    if (input) input.value = val;

    document.querySelectorAll('.preset-chip-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.handleSortChange = function () {
    playSound('click');
    renderBattles();
  };

  window.refreshSnakeBattlesList = function () {
    playSound('click');
    const btn = document.getElementById('btn-snake-refresh');
    if (btn) btn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      if (btn) btn.style.transform = 'none';
      renderBattles();
      showToast('Snake Battles Refreshed!', '🐍');
    }, 350);
  };

  // --- 8. Join & Create Handlers ---
  window.handleJoinSnake = function (id, entry) {
    playSound('coin');
    showToast(`Joining Snake Battle ₹${entry}...`, '🎲');
    setTimeout(() => {
      window.location.href = 'snake-gameplay.html';
    }, 700);
  };

  window.startSnakeBattleCreation = function () {
    playSound('coin');
    const input = document.getElementById('snake-entry-amount');
    const amt = input ? input.value : '20';
    showToast(`Snake Battle of ₹${amt} Created! Finding Opponent...`, '🚀');
    setTimeout(() => {
      window.location.href = 'snake-gameplay.html';
    }, 900);
  };

  window.openSnakeRulesModal = function () {
    playSound('click');
    const m = document.getElementById('modal-snake-rules');
    if (m) m.classList.add('show');
  };

  window.closeSnakeRulesModal = function () {
    playSound('click');
    const m = document.getElementById('modal-snake-rules');
    if (m) m.classList.remove('show');
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderBattles();
    console.log('Snake & Ladders Arena Initialized with Classic Battle Design System.');
  });

})();
