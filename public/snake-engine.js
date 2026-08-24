/**
 * SNAKE & LADDERS GAME ENGINE
 * 100-Square Precision Physics, Ladders, Snakes, Floating Badges, and Smart Bot AI.
 */

(function () {
  'use strict';

  // --- 1. Synthesized Audio Engine ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSound(type) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'step') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'ladder') {
      [400, 500, 600, 750, 900, 1100].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } else if (type === 'snake') {
      [600, 500, 420, 320, 240, 160].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
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
    } else if (type === 'dice-roll') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }

  // --- 2. 10x10 Grid Math (Boustrophedon Coordinates) ---
  // Square 1 is bottom-left (Row 9, Col 0), Square 100 is top-left (Row 0, Col 0)
  function getSquareCoordinates(squareNum) {
    const s = Math.max(1, Math.min(100, squareNum));
    const rowFromBottom = Math.floor((s - 1) / 10);
    const row = 9 - rowFromBottom;
    let col;
    if (rowFromBottom % 2 === 0) {
      col = (s - 1) % 10;
    } else {
      col = 9 - ((s - 1) % 10);
    }
    return {
      topPct: ((row + 0.5) / 10) * 100,
      leftPct: ((col + 0.5) / 10) * 100
    };
  }

  // Ladders (Bottom -> Top) & Snakes (Head -> Tail)
  const LADDERS = {
    4: 14,
    9: 31,
    20: 38,
    28: 84,
    40: 59,
    51: 67,
    63: 81,
    71: 91
  };

  const SNAKES = {
    17: 7,
    54: 34,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    99: 78
  };

  // --- 3. Game State ---
  const state = {
    currentTurn: 'you', // 'you' or 'bot'
    hasRolled: false,
    isAnimating: false,
    isGameOver: false,
    diceValue: null,
    timerSeconds: 15,
    timerInterval: null,
    positions: {
      you: 1,
      bot: 1
    },
    scores: {
      you: 0,
      bot: 0
    }
  };

  // --- 4. Render Tokens on 10x10 Board ---
  function renderTokens() {
    const board = document.getElementById('snake-board-wrapper');
    if (!board) return;

    document.querySelectorAll('.snake-token').forEach(el => el.remove());

    const sameSquare = state.positions.you === state.positions.bot;

    ['you', 'bot'].forEach(player => {
      const sq = state.positions[player];
      const coords = getSquareCoordinates(sq);
      const token = document.createElement('div');
      token.className = `snake-token token-${player}`;
      token.id = `snake-token-${player}`;

      // Offset if sharing the same cell
      let offsetX = 0;
      if (sameSquare) {
        offsetX = player === 'you' ? -12 : 12;
      }

      token.style.top = `${coords.topPct}%`;
      token.style.left = `calc(${coords.leftPct}% + ${offsetX}px)`;

      const img = document.createElement('img');
      img.src = player === 'you' ? 'assets/pawn_3d_blue.png' : 'assets/pawn_3d_green.png';
      img.alt = player;
      token.appendChild(img);

      board.appendChild(token);
    });

    // Update Player Scores
    const scoreYou = document.getElementById('score-val-you');
    const scoreBot = document.getElementById('score-val-bot');
    if (scoreYou) scoreYou.textContent = state.scores.you;
    if (scoreBot) scoreBot.textContent = state.scores.bot;
  }

  // --- 5. Floating Badge UI ---
  function showScoreBadge(player, text, type = 'gain') {
    const card = document.getElementById(player === 'you' ? 'player-card-you' : 'player-card-bot');
    if (!card) return;

    const badge = document.createElement('div');
    badge.className = `floating-score-badge ${type}`;
    badge.textContent = text;
    card.appendChild(badge);

    setTimeout(() => {
      badge.remove();
    }, 1600);
  }

  // --- 6. Dice Roll Mechanics ---
  window.handlePlayerDiceRoll = function () {
    if (state.isGameOver || state.currentTurn !== 'you' || state.hasRolled || state.isAnimating) return;

    rollDice('you', (rolledVal) => {
      movePlayerStepByStep('you', rolledVal);
    });
  };

  function rollDice(player, callback) {
    if (state.isGameOver) return;
    state.hasRolled = true;
    state.isAnimating = true;
    playSound('dice-roll');

    const diceImg = document.getElementById(player === 'you' ? 'dice-img-blue' : 'dice-img-green');
    const finalVal = Math.floor(Math.random() * 6) + 1;
    state.diceValue = finalVal;

    if (diceImg) {
      diceImg.src = `assets/dice_roll_${finalVal}.gif?t=${Date.now()}`;

      setTimeout(() => {
        diceImg.src = `assets/dice_${finalVal}.png`;
        playSound('step');

        state.isAnimating = false;
        if (callback) callback(finalVal);
      }, 720);
    } else {
      state.isAnimating = false;
      if (callback) callback(finalVal);
    }
  }

  // --- 7. Step-by-Step Movement & Special Hazard Resolution ---
  function movePlayerStepByStep(player, steps) {
    if (state.isGameOver) return;

    const currentSq = state.positions[player];
    const neededToWin = 100 - currentSq;

    // Rule: If dice roll is greater than steps needed to reach 100, token does NOT move!
    if (steps > neededToWin) {
      playSound('step');
      showScoreBadge(player, `Need ${neededToWin} to reach 100! 🎯`, 'loss');

      state.isAnimating = false;
      if (steps === 6) {
        resetTurnForBonus();
      } else {
        switchTurn();
      }
      return;
    }

    // Valid roll: Advance forward step-by-step
    state.isAnimating = true;
    let stepsLeft = steps;

    const moveInterval = setInterval(() => {
      if (state.isGameOver) {
        clearInterval(moveInterval);
        return;
      }

      if (stepsLeft <= 0) {
        clearInterval(moveInterval);
        resolveSquareHazards(player, state.positions[player], steps);
        return;
      }

      state.positions[player]++;
      state.scores[player] = state.positions[player];
      playSound('step');
      renderTokens();

      // Instant Match Over on reaching 100
      if (state.positions[player] === 100) {
        clearInterval(moveInterval);
        setTimeout(() => {
          declareWinner(player);
        }, 300);
        return;
      }

      stepsLeft--;
    }, 180);
  }

  function resolveSquareHazards(player, finalSq, rolledSteps) {
    if (state.isGameOver) return;

    // 1. Check Victory (Square 100)
    if (finalSq === 100) {
      declareWinner(player);
      return;
    }

    // 2. Check Ladder Climb
    if (LADDERS[finalSq]) {
      const topSq = LADDERS[finalSq];

      setTimeout(() => {
        if (state.isGameOver) return;
        playSound('ladder');
        state.positions[player] = topSq;
        state.scores[player] = topSq;
        renderTokens();

        if (topSq === 100) {
          declareWinner(player);
          return;
        }

        state.isAnimating = false;
        if (rolledSteps === 6) {
          resetTurnForBonus();
        } else {
          switchTurn();
        }
      }, 400);
      return;
    }

    // 3. Check Snake Bite
    if (SNAKES[finalSq]) {
      const tailSq = SNAKES[finalSq];

      setTimeout(() => {
        if (state.isGameOver) return;
        playSound('snake');
        state.positions[player] = tailSq;
        state.scores[player] = tailSq;
        renderTokens();

        state.isAnimating = false;
        if (rolledSteps === 6) {
          resetTurnForBonus();
        } else {
          switchTurn();
        }
      }, 400);
      return;
    }

    // Normal move complete
    state.isAnimating = false;
    if (rolledSteps === 6) {
      resetTurnForBonus();
    } else {
      switchTurn();
    }
  }

  function resetTurnForBonus() {
    if (state.isGameOver) return;
    state.hasRolled = false;
    state.isAnimating = false;
    state.diceValue = null;
    startTurnTimer();
    if (state.currentTurn === 'bot') {
      setTimeout(runBotTurn, 800);
    }
  }

  // --- 8. Turn Management & Timer ---
  function switchTurn() {
    if (state.isGameOver) return;
    state.currentTurn = state.currentTurn === 'you' ? 'bot' : 'you';
    state.hasRolled = false;
    state.isAnimating = false;
    state.diceValue = null;

    const youCard = document.getElementById('player-card-you');
    const botCard = document.getElementById('player-card-bot');

    if (youCard && botCard) {
      if (state.currentTurn === 'you') {
        youCard.classList.add('active-turn');
        botCard.classList.remove('active-turn');
      } else {
        botCard.classList.add('active-turn');
        youCard.classList.remove('active-turn');
      }
    }

    startTurnTimer();

    if (state.currentTurn === 'bot') {
      setTimeout(runBotTurn, 800);
    }
  }

  function startTurnTimer() {
    if (state.isGameOver) return;
    clearInterval(state.timerInterval);
    state.timerSeconds = 15;
    const bar = document.getElementById('turn-timer-bar');
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '100%';
      setTimeout(() => {
        bar.style.transition = 'width 15s linear';
        bar.style.width = '0%';
      }, 50);
    }

    state.timerInterval = setInterval(() => {
      if (state.isGameOver) {
        clearInterval(state.timerInterval);
        return;
      }
      state.timerSeconds--;
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        if (!state.hasRolled && !state.isAnimating) {
          switchTurn();
        }
      }
    }, 1000);
  }

  // --- 9. Bot AI ---
  function runBotTurn() {
    if (state.isGameOver || state.currentTurn !== 'bot') return;

    rollDice('bot', (rolledVal) => {
      movePlayerStepByStep('bot', rolledVal);
    });
  }

  // --- 10. Grand Confetti Celebration Particle Engine ---
  function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ffcc00', '#00e676', '#00e5ff', '#ff3d00', '#e040fb', '#ffffff', '#ffd700'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 3,
        d: Math.random() * 90 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.07) + 0.05
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - (i / 3)) * 15;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      }
      if (state.isGameOver) {
        requestAnimationFrame(draw);
      }
    }
    draw();
  }

  // --- 11. Grand Celebration Match Over / Winner & Loser Screen ---
  function declareWinner(winner) {
    if (state.isGameOver) return;
    state.isGameOver = true;
    state.isAnimating = false;
    clearInterval(state.timerInterval);
    playSound('win');

    // Remove active turn glow from player cards
    const youCard = document.getElementById('player-card-you');
    const botCard = document.getElementById('player-card-bot');
    if (youCard) youCard.classList.remove('active-turn');
    if (botCard) botCard.classList.remove('active-turn');

    const modal = document.getElementById('modal-game-victory');
    const title = document.getElementById('victory-title');
    const msg = document.getElementById('victory-sub');
    const trophyIcon = document.getElementById('celebration-icon');

    const winnerName = winner === 'you' ? 'You' : 'Bot';
    const winnerAvatar = winner === 'you' ? 'assets/avatar_rahul.png' : 'assets/avatar_amit.png';
    const loserName = winner === 'you' ? 'Bot' : 'You';
    const loserAvatar = winner === 'you' ? 'assets/avatar_amit.png' : 'assets/avatar_rahul.png';
    const loserSquare = state.positions[winner === 'you' ? 'bot' : 'you'];

    const winnerNameEl = document.getElementById('winner-name');
    const winnerAvatarEl = document.getElementById('winner-avatar');
    const winnerScoreEl = document.getElementById('winner-score-info');
    const loserNameEl = document.getElementById('loser-name');
    const loserAvatarEl = document.getElementById('loser-avatar');
    const loserScoreEl = document.getElementById('loser-score-info');

    if (winnerNameEl) winnerNameEl.textContent = winnerName;
    if (winnerAvatarEl) winnerAvatarEl.src = winnerAvatar;
    if (winnerScoreEl) winnerScoreEl.textContent = 'Square 100 • Score 100';

    if (loserNameEl) loserNameEl.textContent = loserName;
    if (loserAvatarEl) loserAvatarEl.src = loserAvatar;
    if (loserScoreEl) loserScoreEl.textContent = `Square ${loserSquare} • Score ${loserSquare}`;

    if (winner === 'you') {
      if (trophyIcon) trophyIcon.textContent = '🏆';
      if (title) {
        title.textContent = '🎉 VICTORY! 🎉';
        title.style.color = '#2cb730';
      }
      if (msg) msg.textContent = 'Congratulations! You conquered the board and won ₹36 Prize Pool!';
      startConfetti();
    } else {
      if (trophyIcon) trophyIcon.textContent = '💀';
      if (title) {
        title.textContent = 'GAME OVER';
        title.style.color = '#e53935';
      }
      if (msg) msg.textContent = 'Bot reached Square 100 first. Better luck in the next battle!';
    }

    if (modal) modal.classList.add('show');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    renderTokens();
    startTurnTimer();
    console.log('Snake & Ladders Engine Live with 10x10 Grid & Physics.');
  });

})();
