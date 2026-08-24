const SAFE_ZONES = [1, 9, 14, 22, 27, 35, 40, 48]; // 8 Star Safe Cells

// 1v1 Starting & Home Entry Cells
// Player 1 (Red): Starts at 1, enters home corridor after 51
// Player 2 (Yellow): Starts at 27, enters home corridor after 25
const P1_START = 1;
const P2_START = 27;

function calculateNextPosition(currentPos, steps, playerIndex) {
  // Base Exit (Need a 6)
  if (currentPos === 0) {
    if (steps === 6) {
      return (playerIndex === 1) ? P1_START : P2_START;
    }
    return 0;
  }

  // Already in Home Corridor (53 to 58)
  if (currentPos >= 53 && currentPos <= 58) {
    if (currentPos + steps <= 58) {
      return currentPos + steps;
    }
    return currentPos;
  }

  // Circuit Traversal (1 to 52)
  if (playerIndex === 1) {
    if (currentPos <= 51 && (currentPos + steps) > 51) {
      const homeSteps = (currentPos + steps) - 51;
      return (homeSteps <= 6) ? 52 + homeSteps : currentPos;
    }
    let next = (currentPos + steps);
    if (next > 52) next = next % 52;
    return next;
  } else {
    if (currentPos <= 25 && (currentPos + steps) > 25) {
      const homeSteps = (currentPos + steps) - 25;
      return (homeSteps <= 6) ? 52 + homeSteps : currentPos;
    }
    let next = (currentPos + steps);
    if (next > 52) next = next % 52;
    return next;
  }
}

function checkForPawnCapture(newPos, opponentPositions) {
  if (SAFE_ZONES.includes(newPos) || newPos >= 53) {
    return -1;
  }
  return opponentPositions.findIndex(pos => pos === newPos && pos > 0 && pos < 53);
}

function checkWinCondition(pawnPositions, isQuickMode = false) {
  const finishedCount = pawnPositions.filter(p => p === 58).length;
  if (isQuickMode) {
    return finishedCount >= 1;
  }
  return finishedCount >= 4;
}

module.exports = {
  SAFE_ZONES,
  calculateNextPosition,
  checkForPawnCapture,
  checkWinCondition
};
