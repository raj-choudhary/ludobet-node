const LADDERS = {
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
};

const SNAKES = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
};

function calculateSnakePosition(currentPos, steps) {
  let target = currentPos + steps;

  if (target > 100) {
    return { newPos: currentPos, event: 'EXCESS_ROLL', description: 'Need exact roll to reach 100' };
  }

  if (target === 100) {
    return { newPos: 100, event: 'WIN', description: 'Player reached 100!' };
  }

  if (LADDERS[target]) {
    return { newPos: LADDERS[target], event: 'LADDER', from: target, to: LADDERS[target], description: `Climbed ladder to ${LADDERS[target]}!` };
  }

  if (SNAKES[target]) {
    return { newPos: SNAKES[target], event: 'SNAKE', from: target, to: SNAKES[target], description: `Bitten by snake down to ${SNAKES[target]}!` };
  }

  return { newPos: target, event: 'MOVE', description: `Moved ${steps} steps to ${target}` };
}

module.exports = {
  LADDERS,
  SNAKES,
  calculateSnakePosition
};
