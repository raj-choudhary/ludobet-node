/**
 * LEADERBOARD & RANKINGS ENGINE
 * Dynamic timeframe tab switching, live countdown, podium rendering, and prize rules.
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

  // --- 3. Datasets for Daily, Weekly, and Monthly Leaderboards ---
  const LEADERBOARD_DATA = {
    daily: {
      podium: [
        { rank: 1, name: 'Rahul_King 🌟', avatar: 'assets/avatar_rahul.png', wins: '58 Wins', prize: '₹5,000' },
        { rank: 2, name: 'Amit_Pro', avatar: 'assets/avatar_amit.png', wins: '42 Wins', prize: '₹3,000' },
        { rank: 3, name: 'Priya_Queen', avatar: 'assets/avatar_priya.png', wins: '35 Wins', prize: '₹1,500' }
      ],
      list: [
        { rank: 4, name: 'Vikash_Sniper', avatar: 'assets/avatar_vikash.png', wins: '29 Wins', winrate: '82%', prize: '₹500' },
        { rank: 5, name: 'Neha_Gamer', avatar: 'assets/avatar_neha.png', wins: '26 Wins', winrate: '79%', prize: '₹500' },
        { rank: 6, name: 'Samir_Don', avatar: 'assets/avatar_samir.png', wins: '24 Wins', winrate: '75%', prize: '₹300' },
        { rank: 7, name: 'Anita_Star', avatar: 'assets/avatar_anita.png', wins: '23 Wins', winrate: '74%', prize: '₹300' },
        { rank: 8, name: 'Karan_Ace', avatar: 'assets/avatar_karan.png', wins: '21 Wins', winrate: '71%', prize: '₹300' },
        { rank: 9, name: 'Rohit_Sharma', avatar: 'assets/avatar_rahul.png', wins: '20 Wins', winrate: '70%', prize: '₹300' },
        { rank: 10, name: 'Deepak_Ludo', avatar: 'assets/avatar_amit.png', wins: '19 Wins', winrate: '68%', prize: '₹300' }
      ]
    },
    weekly: {
      podium: [
        { rank: 1, name: 'Vikash_Sniper 👑', avatar: 'assets/avatar_vikash.png', wins: '245 Wins', prize: '₹20,000' },
        { rank: 2, name: 'Rahul_King', avatar: 'assets/avatar_rahul.png', wins: '210 Wins', prize: '₹12,000' },
        { rank: 3, name: 'Anita_Star', avatar: 'assets/avatar_anita.png', wins: '185 Wins', prize: '₹8,000' }
      ],
      list: [
        { rank: 4, name: 'Amit_Pro', avatar: 'assets/avatar_amit.png', wins: '160 Wins', winrate: '84%', prize: '₹2,500' },
        { rank: 5, name: 'Priya_Queen', avatar: 'assets/avatar_priya.png', wins: '142 Wins', winrate: '80%', prize: '₹2,500' },
        { rank: 6, name: 'Neha_Gamer', avatar: 'assets/avatar_neha.png', wins: '130 Wins', winrate: '76%', prize: '₹1,500' },
        { rank: 7, name: 'Samir_Don', avatar: 'assets/avatar_samir.png', wins: '118 Wins', winrate: '73%', prize: '₹1,500' }
      ]
    },
    monthly: {
      podium: [
        { rank: 1, name: 'Rahul_King 🏆', avatar: 'assets/avatar_rahul.png', wins: '890 Wins', prize: '₹75,000' },
        { rank: 2, name: 'Vikash_Sniper', avatar: 'assets/avatar_vikash.png', wins: '760 Wins', prize: '₹45,000' },
        { rank: 3, name: 'Neha_Gamer', avatar: 'assets/avatar_neha.png', wins: '680 Wins', prize: '₹25,000' }
      ],
      list: [
        { rank: 4, name: 'Anita_Star', avatar: 'assets/avatar_anita.png', wins: '590 Wins', winrate: '85%', prize: '₹10,000' },
        { rank: 5, name: 'Amit_Pro', avatar: 'assets/avatar_amit.png', wins: '520 Wins', winrate: '81%', prize: '₹10,000' },
        { rank: 6, name: 'Priya_Queen', avatar: 'assets/avatar_priya.png', wins: '470 Wins', winrate: '78%', prize: '₹6,000' }
      ]
    }
  };

  // --- 4. Render Leaderboard Function ---
  let activeTab = 'daily';

  function renderLeaderboard(timeframe) {
    const data = LEADERBOARD_DATA[timeframe] || LEADERBOARD_DATA.daily;

    // 1. Update Podium 1, 2, 3
    const p1 = data.podium.find(p => p.rank === 1);
    const p2 = data.podium.find(p => p.rank === 2);
    const p3 = data.podium.find(p => p.rank === 3);

    if (p1) {
      document.getElementById('podium-name-1').textContent = p1.name;
      document.getElementById('podium-img-1').src = p1.avatar;
      document.getElementById('podium-score-1').textContent = p1.wins;
      document.getElementById('podium-prize-1').textContent = p1.prize;
    }
    if (p2) {
      document.getElementById('podium-name-2').textContent = p2.name;
      document.getElementById('podium-img-2').src = p2.avatar;
      document.getElementById('podium-score-2').textContent = p2.wins;
      document.getElementById('podium-prize-2').textContent = p2.prize;
    }
    if (p3) {
      document.getElementById('podium-name-3').textContent = p3.name;
      document.getElementById('podium-img-3').src = p3.avatar;
      document.getElementById('podium-score-3').textContent = p3.wins;
      document.getElementById('podium-prize-3').textContent = p3.prize;
    }

    // 2. Update Contenders List (Ranks 4-20)
    const listContainer = document.getElementById('leaderboard-items-list');
    if (listContainer) {
      listContainer.innerHTML = data.list.map(item => `
        <div class="rank-item-row">
          <div class="rank-item-left">
            <span class="rank-num-pill">#${item.rank}</span>
            <img src="${item.avatar}" alt="${item.name}" class="rank-avatar-img">
            <div class="rank-player-details">
              <span class="rank-player-name">${item.name}</span>
              <span class="rank-player-score">${item.wins} • Win Rate ${item.winrate}</span>
            </div>
          </div>
          <div class="rank-item-right">
            <span class="rank-prize-amt">+${item.prize}</span>
            <span class="rank-winrate">Qualified ✅</span>
          </div>
        </div>
      `).join('');
    }
  }

  // --- 5. Tab Switching ---
  window.switchLeaderboardTab = function (timeframe, btn) {
    playSound('click');
    activeTab = timeframe;
    document.querySelectorAll('.rank-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    renderLeaderboard(timeframe);
    showToast(`Loaded ${timeframe.toUpperCase()} Leaderboard!`, '🏆');
  };

  // --- 6. Countdown Reset Timer ---
  function startCountdownTimer() {
    let totalSeconds = 6 * 3600 + 42 * 60 + 15; // 06h 42m 15s
    const timerEl = document.getElementById('rank-countdown-timer');

    setInterval(() => {
      totalSeconds--;
      if (totalSeconds < 0) totalSeconds = 24 * 3600;

      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      if (timerEl) {
        timerEl.textContent = `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
      }
    }, 1000);
  }

  // --- 7. Modal Handlers ---
  window.openPrizeModal = function () {
    playSound('coin');
    const modal = document.getElementById('modal-prize-rules');
    if (modal) modal.classList.add('show');
  };

  window.closePrizeModal = function () {
    playSound('click');
    const modal = document.getElementById('modal-prize-rules');
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
    renderLeaderboard('daily');
    startCountdownTimer();
    console.log('Leaderboard & Rankings Page Initialized.');
  });

})();
