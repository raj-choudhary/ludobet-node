/**
 * LUDO QUICK BATTLE ARENA - ADMIN PREBUILT CONTEST ENGINE
 * Features:
 * 1. Mode 1: 1-Pawn Home (Speed Instant Finish)
 * 2. Mode 2: 5-Minute Turbo Blitz (Timer Score Leader)
 * 3. 2 Players (1v1) & 4 Players (2 Winners) Admin Contests
 * 4. Running Battles (● LIVE) with Spectate
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

  // --- 3. Datasets for Admin Prebuilt Battles ---
  let currentMode = '1pawn'; // '1pawn' or 'timer'
  let currentTab = 'open'; // 'open' or 'running'

  const ADMIN_CONTESTS = {
    '1pawn': [
      // 2 Players Duels
      { id: 'ap_1p_5', name: 'Starter Duel', entry: 5, prize: 9, players: 2, current: 1, tag: '⚡ 1-Pawn Home', split: null },
      { id: 'ap_1p_10', name: 'Rapid Clash', entry: 10, prize: 18, players: 2, current: 1, tag: '⚡ 1-Pawn Home', split: null },
      { id: 'ap_1p_25', name: 'Speed Master', entry: 25, prize: 45, players: 2, current: 1, tag: '⚡ 1-Pawn Home', split: null },
      { id: 'ap_1p_50', name: 'Pro Arena', entry: 50, prize: 90, players: 2, current: 1, tag: '⚡ 1-Pawn Home', split: null },
      { id: 'ap_1p_100', name: 'Champion Clash', entry: 100, prize: 180, players: 2, current: 1, tag: '⚡ 1-Pawn Home', split: null },
      { id: 'ap_1p_250', name: 'High Roller', entry: 250, prize: 450, players: 2, current: 0, tag: '⚡ 1-Pawn Home', split: null },
      { id: 'ap_1p_500', name: 'Grand Diamond', entry: 500, prize: 900, players: 2, current: 0, tag: '⚡ 1-Pawn Home', split: null },
      // 4 Players Contests (2 Winners)
      { id: 'ap_1p_4p_10', name: '4-Player Speed Rumble', entry: 10, prize: 36, players: 4, current: 3, tag: '⚡ 1-Pawn Home', split: '🏆 2 Winners • 1st: ₹25, 2nd: ₹11' },
      { id: 'ap_1p_4p_50', name: '4-Player Mega Clash', entry: 50, prize: 180, players: 4, current: 2, tag: '⚡ 1-Pawn Home', split: '🏆 2 Winners • 1st: ₹125, 2nd: ₹55' },
      { id: 'ap_1p_4p_100', name: '4-Player Elite Arena', entry: 100, prize: 360, players: 4, current: 1, tag: '⚡ 1-Pawn Home', split: '🏆 2 Winners • 1st: ₹250, 2nd: ₹110' }
    ],
    'timer': [
      // 2 Players Duels
      { id: 'ap_tm_5', name: 'Turbo Blitz ₹5', entry: 5, prize: 9, players: 2, current: 1, tag: '⏱️ 5-Min Score Race', split: null },
      { id: 'ap_tm_20', name: 'Speed Rush ₹20', entry: 20, prize: 36, players: 2, current: 1, tag: '⏱️ 5-Min Score Race', split: null },
      { id: 'ap_tm_50', name: 'Turbo Duel ₹50', entry: 50, prize: 90, players: 2, current: 1, tag: '⏱️ 5-Min Score Race', split: null },
      { id: 'ap_tm_100', name: 'High Score Clash', entry: 100, prize: 180, players: 2, current: 1, tag: '⏱️ 5-Min Score Race', split: null },
      { id: 'ap_tm_250', name: 'Blitz Grand Prix', entry: 250, prize: 450, players: 2, current: 0, tag: '⏱️ 5-Min Score Race', split: null },
      // 4 Players Contests (2 Winners)
      { id: 'ap_tm_4p_20', name: '4-Player Blitz Rush', entry: 20, prize: 72, players: 4, current: 3, tag: '⏱️ 5-Min Score Race', split: '🏆 2 Winners • 1st: ₹50, 2nd: ₹22' },
      { id: 'ap_tm_4p_100', name: '4-Player Super Blitz', entry: 100, prize: 360, players: 4, current: 2, tag: '⏱️ 5-Min Score Race', split: '🏆 2 Winners • 1st: ₹250, 2nd: ₹110' }
    ]
  };

  const RUNNING_QUICK_BATTLES = [
    { id: 'rq_1', p1Name: 'Rahul Kumar', p1Avatar: 'assets/avatar_rahul.png', p2Name: 'Amit Singh', p2Avatar: 'assets/avatar_amit.png', entry: 50, prize: 90, duration: '01:24', mode: '1-Pawn Home' },
    { id: 'rq_2', p1Name: 'Neha Sharma', p1Avatar: 'assets/avatar_neha.png', p2Name: 'Vikash Yadav', p2Avatar: 'assets/avatar_vikash.png', entry: 100, prize: 180, duration: '03:15', mode: '5-Min Blitz' },
    { id: 'rq_3', p1Name: 'Rohan Gupta', p1Avatar: 'assets/avatar_rahul.png', p2Name: 'Pooja Verma', p2Avatar: 'assets/avatar_neha.png', entry: 20, prize: 36, duration: '00:48', mode: '1-Pawn Home' }
  ];

  // --- 4. Render Contests ---
  function renderContests() {
    const listContainer = document.getElementById('quick-battles-container');
    if (!listContainer) return;

    if (currentTab === 'running') {
      listContainer.innerHTML = RUNNING_QUICK_BATTLES.map(rb => `
        <div class="running-battle-card" id="card-${rb.id}">
          <div class="running-top-row">
            <div class="running-live-status">
              <span class="badge-live-pulse">● LIVE</span>
              <span>${rb.duration}</span>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #1e88e5; background: #e3f2fd; padding: 2px 8px; border-radius: 6px;">
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
            <button class="btn-watch-battle" onclick="window.location.href='game-play.html'">
              👁 SPECTATE
            </button>
          </div>
        </div>
      `).join('');
      return;
    }

    // Open Contests Rendering
    const sortSelect = document.getElementById('quick-sort-select');
    const sortVal = sortSelect ? sortSelect.value : 'low';

    let list = [...ADMIN_CONTESTS[currentMode]];

    if (sortVal === 'low') list.sort((a, b) => a.entry - b.entry);
    else if (sortVal === 'high') list.sort((a, b) => b.entry - a.entry);
    else if (sortVal === 'prize') list.sort((a, b) => b.prize - a.prize);

    listContainer.innerHTML = list.map(c => {
      const fillPct = (c.current / c.players) * 100;
      return `
        <div class="admin-contest-card" id="card-${c.id}">
          <div class="contest-card-meta-top">
            <span class="contest-tag-pill">
              <span>${c.tag}</span>
            </span>
            <span class="contest-fair-badge">🛡️ 100% VERIFIED FAIR</span>
          </div>

          <div class="contest-card-main-grid">
            <div class="contest-stat-box">
              <span class="contest-stat-lbl">Entry</span>
              <span class="contest-stat-val-entry">₹${c.entry}</span>
            </div>

            <div class="contest-stat-box">
              <span class="contest-stat-lbl">Prize Pool</span>
              <span class="contest-stat-val-prize">₹${c.prize}</span>
            </div>

            <div class="contest-stat-box">
              <span class="contest-stat-val-players">${c.current} / ${c.players} Joined</span>
              <div class="slots-progress-row">
                <div class="slots-mini-bar">
                  <div class="slots-mini-fill" style="width: ${fillPct}%;"></div>
                </div>
                <span class="slots-mini-text">${fillPct}%</span>
              </div>
            </div>

            <div class="contest-action-box">
              <button class="btn-contest-join" onclick="handleJoinContest('${c.id}', ${c.entry})">
                ⚡ JOIN
              </button>
            </div>
          </div>

          ${c.split ? `<div class="winner-rank-breakdown">${c.split}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // --- 5. Mode Switcher (1-Pawn Home vs 5-Min Blitz) ---
  window.switchQuickMode = function (mode) {
    playSound('click');
    currentMode = mode;

    const tab1p = document.getElementById('tab-mode-1pawn');
    const tabTm = document.getElementById('tab-mode-timer');

    if (mode === '1pawn') {
      if (tab1p) tab1p.classList.add('active');
      if (tabTm) tabTm.classList.remove('active');
    } else {
      if (tabTm) tabTm.classList.add('active');
      if (tab1p) tab1p.classList.remove('active');
    }

    renderContests();
  };

  // --- 6. Tab Switcher (Open vs Running) ---
  window.switchQuickTab = function (tab) {
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

    renderContests();
  };

  // --- 7. Filters & Refresh ---
  window.handleSortChange = function () {
    playSound('click');
    renderContests();
  };

  window.handlePlayerFilterChange = function () {
    playSound('click');
    renderContests();
  };

  window.refreshQuickBattlesList = function () {
    playSound('click');
    const btn = document.getElementById('btn-quick-refresh');
    if (btn) btn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      if (btn) btn.style.transform = 'none';
      renderContests();
      showToast('Admin Contests Refreshed!', '⚡');
    }, 350);
  };

  // --- 8. Join Battle Flow ---
  window.handleJoinContest = function (id, entry) {
    playSound('coin');
    showToast(`Joining Contest ₹${entry}... Finding Match!`, '⚡');
    setTimeout(() => {
      window.location.href = 'game-play.html';
    }, 800);
  };

  // --- 9. Sponsored Banner Countdown Timer ---
  function startSponsoredTimer() {
    let seconds = 225; // 03:45
    const timerElem = document.getElementById('sponsored-timer');
    if (!timerElem) return;

    setInterval(() => {
      seconds--;
      if (seconds < 0) seconds = 300;
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      timerElem.textContent = `${m}:${s}`;
    }, 1000);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderContests();
    startSponsoredTimer();
    console.log('Ludo Quick Admin Prebuilt Battles Lobby Initialized.');
  });

})();
