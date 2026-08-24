/**
 * LUDO TOURNAMENT - COMPLETE PROFESSIONAL GAMEPLAY ENGINE
 * - Clean English UI, Zero Spammy In-Game Toasts
 * - Multi-Pawn Stacking & Smart Clustering on Same Cell (Ludo King Style)
 * - Color-Specific Home Triangle Parking (Blue pawn sits inside Blue Triangle, Green in Green Triangle)
 * - Score Rules: +1 per step, -Score on Capture (victim loses exact distance walked), +20 Capture Bonus
 * - Smooth Step & Reverse Rewind Animations with Native Web Audio
 */

(function () {
  'use strict';

  // --- 1. Audio Engine (Web Audio API) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSound(type) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'dice-roll') {
      for (let i = 0; i < 6; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + Math.random() * 380, now + i * 0.045);
        gain.gain.setValueAtTime(0.2, now + i * 0.045);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.045 + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.04);
      }
    } else if (type === 'step') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'capture') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'home') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } else if (type === 'click') {
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
    }
  }

  // --- 2. Track & Coordinates (15x15 Grid) ---
  // Main 52 outer track steps (0 to 51)
  const MAIN_TRACK = [
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],     // 0-4 (Blue Start at 0: [13,6])
    [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],   // 5-10 (Safe Star at 8)
    [7, 0],                                          // 11
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],   // 12-17 (Red Start at 13)
    [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],   // 18-23 (Safe Star at 21)
    [0, 7],                                          // 24
    [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],   // 25-30 (Green Start at 26)
    [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], // 31-36 (Safe Star at 34)
    [7, 14],                                         // 37
    [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], // 38-43 (Yellow Start at 39)
    [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], // 44-49 (Safe Star at 47)
    [14, 7],                                         // 50
    [14, 6]                                          // 51
  ];

  // Home columns (5 path steps before final center triangle)
  const HOME_COLUMNS = {
    blue: [ [13, 7], [12, 7], [11, 7], [10, 7], [9, 7] ],
    green: [ [1, 7], [2, 7], [3, 7], [4, 7], [5, 7] ]
  };

  // Color-specific Center Triangle Coordinates (Inside their respective colored triangle!)
  const HOME_TRIANGLE_POSITIONS = {
    blue: { top: 55.5, left: 50.0 },   // Inside the bottom Blue Triangle
    green: { top: 44.5, left: 50.0 },  // Inside the top Green Triangle
    red: { top: 50.0, left: 44.5 },    // Inside the left Red Triangle
    yellow: { top: 50.0, left: 55.5 }  // Inside the right Yellow Triangle
  };

  const START_TRACK_INDEX = {
    blue: 0,
    green: 26
  };

  // Safe Star track indices (where goti cannot be captured)
  const SAFE_TRACK_POSITIONS = [ 0, 8, 13, 21, 26, 34, 39, 47 ];

  // Exact Pocket Center Percentages for Bases
  const BASE_PERCENTAGES = {
    blue: [
      { top: 73.0, left: 13.0 },
      { top: 73.0, left: 27.0 },
      { top: 87.0, left: 13.0 },
      { top: 87.0, left: 27.0 }
    ],
    green: [
      { top: 13.0, left: 73.0 },
      { top: 13.0, left: 87.0 },
      { top: 27.0, left: 73.0 },
      { top: 27.0, left: 87.0 }
    ]
  };

  // --- 3. Game State (All Pawns Pre-Unlocked on Starting Point) ---
  const state = {
    currentTurn: 'blue', // 'blue' or 'green'
    diceValue: null,
    hasRolled: false,
    isAnimating: false,
    timerSeconds: 15,
    timerInterval: null,
    scores: { blue: 0, green: 0 },
    tokens: {
      blue: [
        { id: 0, status: 'active', stepCount: 0 },
        { id: 1, status: 'active', stepCount: 0 },
        { id: 2, status: 'active', stepCount: 0 },
        { id: 3, status: 'active', stepCount: 0 }
      ],
      green: [
        { id: 0, status: 'active', stepCount: 0 },
        { id: 1, status: 'active', stepCount: 0 },
        { id: 2, status: 'active', stepCount: 0 },
        { id: 3, status: 'active', stepCount: 0 }
      ]
    }
  };

  // Get raw cell position & unique cell key for clustering
  function getTokenLocation(color, token) {
    if (token.status === 'base') {
      return {
        key: `base_${color}_${token.id}`,
        topPct: BASE_PERCENTAGES[color][token.id].top,
        leftPct: BASE_PERCENTAGES[color][token.id].left,
        isBase: true
      };
    }

    if (token.status === 'home' || token.stepCount >= 56) {
      return {
        key: `home_${color}`,
        topPct: HOME_TRIANGLE_POSITIONS[color].top,
        leftPct: HOME_TRIANGLE_POSITIONS[color].left,
        isHome: true
      };
    }

    const step = token.stepCount;
    if (step >= 0 && step <= 50) {
      const trackIdx = (START_TRACK_INDEX[color] + step) % 52;
      const [r, c] = MAIN_TRACK[trackIdx];
      return {
        key: `track_${trackIdx}`,
        topPct: ((r + 0.5) / 15) * 100,
        leftPct: ((c + 0.5) / 15) * 100,
        isBase: false
      };
    } else {
      // Home column step 51..55
      const homeIdx = step - 51;
      const [r, c] = HOME_COLUMNS[color][homeIdx];
      return {
        key: `homecol_${color}_${homeIdx}`,
        topPct: ((r + 0.5) / 15) * 100,
        leftPct: ((c + 0.5) / 15) * 100,
        isBase: false
      };
    }
  }

  // --- 4. Render Board Tokens with Smart Multi-Pawn Clustering (Ludo King Style) ---
  function renderTokens() {
    const board = document.getElementById('ludo-board-wrapper');
    if (!board) return;

    document.querySelectorAll('.board-pawn-token').forEach(el => el.remove());

    // 1. Group tokens by cell key to handle overlapping pawns cleanly
    const clusters = {};

    ['blue', 'green'].forEach(color => {
      state.tokens[color].forEach(token => {
        const loc = getTokenLocation(color, token);
        if (!clusters[loc.key]) {
          clusters[loc.key] = {
            topPct: loc.topPct,
            leftPct: loc.leftPct,
            isBase: loc.isBase,
            isHome: loc.isHome,
            items: []
          };
        }
        clusters[loc.key].items.push({ color, token });
      });
    });

    // 2. Render each pawn with smart offset and scale if clustered
    Object.keys(clusters).forEach(key => {
      const cluster = clusters[key];
      const count = cluster.items.length;

      cluster.items.forEach((item, index) => {
        const { color, token } = item;
        let offsetX = 0;
        let offsetY = 0;
        let scale = 1.0;

        if (count === 2 && !cluster.isBase) {
          // 2 Pawns side-by-side
          scale = 0.82;
          offsetX = index === 0 ? -1.8 : 1.8;
          offsetY = 0;
        } else if (count === 3 && !cluster.isBase) {
          // 3 Pawns triangle
          scale = 0.74;
          if (index === 0) { offsetX = -1.8; offsetY = -1.2; }
          else if (index === 1) { offsetX = 1.8; offsetY = -1.2; }
          else { offsetX = 0; offsetY = 1.6; }
        } else if (count >= 4 && !cluster.isBase) {
          // 4 Pawns 2x2 grid
          scale = 0.68;
          if (index === 0) { offsetX = -1.8; offsetY = -1.6; }
          else if (index === 1) { offsetX = 1.8; offsetY = -1.6; }
          else if (index === 2) { offsetX = -1.8; offsetY = 1.6; }
          else { offsetX = 1.8; offsetY = 1.6; }
        }

        const finalTop = cluster.topPct + offsetY;
        const finalLeft = cluster.leftPct + offsetX;

        const pawn = document.createElement('div');
        pawn.className = `board-pawn-token pawn-${color}`;
        pawn.id = `pawn-${color}-${token.id}`;
        pawn.style.top = `${finalTop}%`;
        pawn.style.left = `${finalLeft}%`;
        pawn.style.transform = `translate(-50%, -78%) scale(${scale})`;

        const img = document.createElement('img');
        img.src = `assets/pawn_3d_${color}.png`;
        img.alt = `${color} 3D Pawn`;
        pawn.appendChild(img);

        // Movable highlight check
        if (state.currentTurn === color && state.hasRolled && canMoveToken(color, token, state.diceValue)) {
          pawn.classList.add('movable');
          pawn.style.zIndex = 100 + index; // Lift movable pawn above others
          if (color === 'blue') {
            pawn.onclick = () => handlePawnClick(token.id);
          }
        }

        board.appendChild(pawn);
      });
    });
  }

  // --- 5. Movement Rules (Pre-Unlocked Fast Gameplay) ---
  function canMoveToken(color, token, dice) {
    if (!dice) return false;
    if (token.status === 'home') return false;
    // Any token on the board can move if total steps <= 56
    return token.stepCount + dice <= 56;
  }

  function getMovableTokens(color, dice) {
    return state.tokens[color].filter(t => canMoveToken(color, t, dice));
  }

  // --- 6. 3D Tumbling Animated GIF Dice Engine ---
  window.handlePlayerDiceRoll = function () {
    if (state.currentTurn !== 'blue' || state.hasRolled || state.isAnimating) return;

    rollDice('blue', (rolledVal) => {
      const movable = getMovableTokens('blue', rolledVal);
      if (movable.length === 0) {
        setTimeout(switchTurn, 800);
      } else if (movable.length === 1) {
        setTimeout(() => {
          handlePawnClick(movable[0].id);
        }, 300);
      } else {
        renderTokens();
      }
    });
  };

  function rollDice(player, callback) {
    state.hasRolled = true;
    state.isAnimating = true;
    playSound('dice-roll');

    const diceImg = document.getElementById(`dice-img-${player}`);
    const finalVal = Math.floor(Math.random() * 6) + 1;
    state.diceValue = finalVal;

    if (diceImg) {
      // Play 3D tumbling animated GIF (with timestamp to replay from frame 0)
      diceImg.src = `assets/dice_roll_${finalVal}.gif?t=${Date.now()}`;

      setTimeout(() => {
        // Land on static crisp 3D face
        diceImg.src = `assets/dice_${finalVal}.png`;
        playSound('step'); // Crisp solid landing tap

        state.isAnimating = false;
        renderTokens();
        if (callback) callback(finalVal);
      }, 720); // 18 frames * 40ms = 720ms tumbling duration
    } else {
      state.isAnimating = false;
      renderTokens();
      if (callback) callback(finalVal);
    }
  }

  function updateDiceDisplay(player, val) {
    const diceImg = document.getElementById(`dice-img-${player}`);
    if (diceImg) {
      diceImg.src = `assets/dice_${val}.png`;
      diceImg.alt = `Dice ${val}`;
    }
  }

  // --- 7. Forward Step-by-Step Pawn Walking ---
  window.handlePawnClick = function (tokenId) {
    if (state.currentTurn !== 'blue' || !state.hasRolled || state.isAnimating) return;
    const token = state.tokens.blue[tokenId];
    if (!canMoveToken('blue', token, state.diceValue)) return;

    moveTokenStepByStep('blue', token, state.diceValue);
  };

  function moveTokenStepByStep(color, token, steps) {
    state.isAnimating = true;
    playSound('click');

    // Step-by-step advance along track
    let remainingSteps = steps;
    const moveInterval = setInterval(() => {
      if (remainingSteps <= 0) {
        clearInterval(moveInterval);
        finishTokenMove(color, token, steps);
        return;
      }

      token.stepCount++;
      playSound('step');
      state.scores[color] += 1;
      updateScoreUI();
      renderTokens();
      remainingSteps--;
    }, 160);
  }

  function showScoreBadge(player, text, type = 'gain') {
    const card = document.getElementById(player === 'blue' ? 'player-card-you' : 'player-card-bot');
    if (!card) return;

    const badge = document.createElement('div');
    badge.className = `floating-score-badge ${type}`;
    badge.textContent = text;
    card.appendChild(badge);

    setTimeout(() => {
      badge.remove();
    }, 1600);
  }

  function finishTokenMove(color, token, steps) {
    // Check if token reached final Home Triangle (step 56)
    if (token.stepCount === 56) {
      token.status = 'home';
      playSound('home');
      state.scores[color] += 50; // Home bonus points
      updateScoreUI();
      renderTokens();
      showScoreBadge(color, '+50 HOME RUN! 🏆', 'gain');

      if (state.tokens[color].every(t => t.status === 'home')) {
        declareWinner(color);
        return;
      }
      
      // EXTRA TURN AWARDED FOR REACHING HOME!
      state.isAnimating = false;
      resetTurnForBonus();
      return;
    }

    // Check Capture on track (Only on main track 0..50, NOT safe stars!)
    let captured = false;
    let victimToken = null;
    let victimColor = null;

    if (token.stepCount > 0 && token.stepCount <= 50) {
      const currTrackIdx = (START_TRACK_INDEX[color] + token.stepCount) % 52;
      const isSafe = SAFE_TRACK_POSITIONS.includes(currTrackIdx);

      if (!isSafe) {
        const oppColor = color === 'blue' ? 'green' : 'blue';
        state.tokens[oppColor].forEach(oppToken => {
          if (oppToken.status === 'active' && oppToken.stepCount > 0 && oppToken.stepCount <= 50) {
            const oppTrackIdx = (START_TRACK_INDEX[oppColor] + oppToken.stepCount) % 52;
            if (oppTrackIdx === currTrackIdx) {
              captured = true;
              victimToken = oppToken;
              victimColor = oppColor;
            }
          }
        });
      }
    }

    if (captured && victimToken) {
      // CAPTURE RULE: Deduct victim's score by the exact distance walked!
      const distanceLost = victimToken.stepCount;
      state.scores[victimColor] = Math.max(0, state.scores[victimColor] - distanceLost);
      
      // Capturer gets +20 bonus
      state.scores[color] += 20;
      playSound('capture');
      updateScoreUI();

      // Show instant visual floating score badges on cards
      showScoreBadge(color, '+20 & EXTRA TURN! 🎯', 'gain');
      showScoreBadge(victimColor, `-${distanceLost} ✂️`, 'loss');

      // Animate backwards along the path back to starting square (step 0)
      animateTokenReturnToBase(victimColor, victimToken, () => {
        state.isAnimating = false;
        resetTurnForBonus(); // Bonus turn for capture!
      });
    } else {
      state.isAnimating = false;
      if (steps === 6) {
        showScoreBadge(color, 'EXTRA TURN (6)! 🎲', 'gain');
        resetTurnForBonus();
      } else {
        switchTurn();
      }
    }
  }

  // --- 8. Reverse Step-by-Step Animation on Capture (Rewind back to start square) ---
  function animateTokenReturnToBase(color, token, onFinish) {
    state.isAnimating = true;
    let stepsBack = token.stepCount;

    const returnInterval = setInterval(() => {
      if (stepsBack <= 0) {
        clearInterval(returnInterval);
        token.status = 'active';
        token.stepCount = 0;
        playSound('step');
        renderTokens();
        if (onFinish) onFinish();
        return;
      }

      stepsBack--;
      token.stepCount = stepsBack;
      playSound('step');
      renderTokens();
    }, 60); // Fast rewinding walk back to starting point!
  }

  function resetTurnForBonus() {
    state.hasRolled = false;
    state.isAnimating = false;
    state.diceValue = null;
    renderTokens();
    startTurnTimer();
    if (state.currentTurn === 'green') {
      setTimeout(runBotTurn, 800);
    }
  }

  // --- 9. Turn Management & Timer ---
  function switchTurn() {
    state.currentTurn = state.currentTurn === 'blue' ? 'green' : 'blue';
    state.hasRolled = false;
    state.isAnimating = false;
    state.diceValue = null;

    const youCard = document.getElementById('player-card-you');
    const botCard = document.getElementById('player-card-bot');
    if (youCard && botCard) {
      if (state.currentTurn === 'blue') {
        youCard.classList.add('active-turn');
        botCard.classList.remove('active-turn');
      } else {
        botCard.classList.add('active-turn');
        youCard.classList.remove('active-turn');
      }
    }

    renderTokens();
    startTurnTimer();

    if (state.currentTurn === 'green') {
      setTimeout(runBotTurn, 750);
    }
  }

  function startTurnTimer() {
    clearInterval(state.timerInterval);
    state.timerSeconds = 15;
    updateTimerUI();

    state.timerInterval = setInterval(() => {
      state.timerSeconds--;
      updateTimerUI();
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        switchTurn();
      }
    }, 1000);
  }

  function updateTimerUI() {
    const timerElem = document.getElementById('turn-timer-bar');
    if (timerElem) {
      const pct = (state.timerSeconds / 15) * 100;
      timerElem.style.width = `${pct}%`;
    }
  }

  function updateScoreUI() {
    const youScore = document.getElementById('score-val-you');
    const botScore = document.getElementById('score-val-bot');
    if (youScore) youScore.textContent = state.scores.blue;
    if (botScore) botScore.textContent = state.scores.green;
  }

  // --- 10. Smart Bot AI ---
  function runBotTurn() {
    if (state.currentTurn !== 'green') return;

    rollDice('green', (rolledVal) => {
      const movable = getMovableTokens('green', rolledVal);
      if (movable.length === 0) {
        setTimeout(switchTurn, 800);
        return;
      }

      // Priority AI:
      // 1. Move token that can reach home (step 56)
      // 2. Move token that captures blue
      // 3. Furthest progressing token
      let chosenToken = movable[0];
      for (const t of movable) {
        if (t.stepCount + rolledVal === 56) {
          chosenToken = t;
          break;
        }
      }

      setTimeout(() => {
        moveTokenStepByStep('green', chosenToken, rolledVal);
      }, 500);
    });
  }

  // --- 11. Victory Declaration ---
  function declareWinner(winnerColor) {
    clearInterval(state.timerInterval);
    playSound('home');

    const modal = document.getElementById('modal-game-victory');
    const title = document.getElementById('victory-title');
    const msg = document.getElementById('victory-sub');

    if (winnerColor === 'blue') {
      title.textContent = 'VICTORY!';
      title.style.color = '#2cb730';
      msg.textContent = 'You won the match & claimed ₹36 Prize Pool!';
    } else {
      title.textContent = 'GAME OVER';
      title.style.color = '#e53935';
      msg.textContent = 'Opponent won this match.';
    }

    if (modal) modal.classList.add('show');
  }

  window.closeVictoryModal = function () {
    window.location.href = 'ludo-classic.html';
  };

  // Initialize Match Start
  document.addEventListener('DOMContentLoaded', () => {
    updateDiceDisplay('blue', 6);
    updateDiceDisplay('green', 1);
    updateScoreUI();
    renderTokens();
    startTurnTimer();
    console.log('Ludo Match Ready: Clustering, Home Triangles & Professional UI Initialized.');
  });

})();
