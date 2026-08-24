const db = require('../config/db');
const { calculateNextPosition, checkForPawnCapture, checkWinCondition } = require('./ludoEngine');
const { calculateSnakePosition } = require('./snakeEngine');

function setupGameSockets(io) {
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Player connected: ${socket.id}`);

    // Join 1v1 Room
    socket.on('JOIN_ROOM', async ({ battleId, userId, gameMode, isBotMatch }) => {
      const roomId = `room_${battleId}`;
      socket.join(roomId);

      let room = activeRooms.get(battleId);
      if (!room) {
        room = {
          battleId,
          gameMode: gameMode || 'CLASSIC',
          turnPlayerId: userId,
          p1: { userId, socketId: socket.id, missedTurns: 0, pawns: [0, 0, 0, 0], snakePos: 0 },
          p2: null,
          consecutiveSixes: 0,
          isBotMatch: !!isBotMatch,
          turnTimer: null,
          isSettled: false
        };
        activeRooms.set(battleId, room);
      } else {
        if (!room.p2 && room.p1.userId !== userId) {
          room.p2 = { userId, socketId: socket.id, missedTurns: 0, pawns: [0, 0, 0, 0], snakePos: 0 };
        }
      }

      if (room.isBotMatch && !room.p2) {
        room.p2 = { userId: 101, socketId: 'BOT_SOCKET', missedTurns: 0, pawns: [0, 0, 0, 0], snakePos: 0, isBot: true };
      }

      io.to(roomId).emit('GAME_READY', {
        battleId,
        gameMode: room.gameMode,
        turnPlayerId: room.turnPlayerId,
        p1UserId: room.p1.userId,
        p2UserId: room.p2 ? room.p2.userId : null
      });

      startTurnClock(io, room);
    });

    // Roll Dice Request (Server-Side RNG)
    socket.on('ROLL_DICE', async ({ battleId, userId }) => {
      const room = activeRooms.get(battleId);
      if (!room || room.turnPlayerId !== userId || room.isSettled) return;

      if (room.turnTimer) clearTimeout(room.turnTimer);

      const roll = generateServerDiceRoll();
      room.lastRoll = roll;

      if (roll === 6) {
        room.consecutiveSixes++;
      } else {
        room.consecutiveSixes = 0;
      }

      const isTurnCancelled = (room.consecutiveSixes >= 3);
      if (isTurnCancelled) room.consecutiveSixes = 0;

      io.to(`room_${battleId}`).emit('DICE_ROLLED', {
        userId,
        roll,
        consecutiveSixes: room.consecutiveSixes,
        isTurnCancelled
      });

      if (isTurnCancelled) {
        switchTurn(io, room);
        return;
      }

      if (room.gameMode === 'SNAKE') {
        handleSnakeMove(io, room, userId, roll);
      } else {
        if (room.isBotMatch && room.p2 && room.turnPlayerId === room.p2.userId) {
          executeBotLudoMove(io, room, roll);
        }
      }
    });

    // Move Pawn Request (1v1 Ludo)
    socket.on('MOVE_PAWN', async ({ battleId, userId, pawnIndex }) => {
      const room = activeRooms.get(battleId);
      if (!room || room.turnPlayerId !== userId || room.isSettled) return;

      const isP1 = (room.p1.userId === userId);
      const player = isP1 ? room.p1 : room.p2;
      const opponent = isP1 ? room.p2 : room.p1;
      const lastRoll = room.lastRoll || 6;

      const currentPos = player.pawns[pawnIndex];
      const newPos = calculateNextPosition(currentPos, lastRoll, isP1 ? 1 : 2);

      if (newPos === currentPos && currentPos !== 0) {
        socket.emit('INVALID_MOVE', { message: 'Cannot move this pawn.' });
        return;
      }

      player.pawns[pawnIndex] = newPos;

      let capturedPawnIndex = -1;
      if (opponent) {
        capturedPawnIndex = checkForPawnCapture(newPos, opponent.pawns);
        if (capturedPawnIndex !== -1) {
          opponent.pawns[capturedPawnIndex] = 0;
        }
      }

      io.to(`room_${battleId}`).emit('PAWN_MOVED', {
        userId,
        pawnIndex,
        newPos,
        capturedPawnIndex,
        p1Pawns: room.p1.pawns,
        p2Pawns: room.p2 ? room.p2.pawns : [0, 0, 0, 0]
      });

      const isQuick = (room.gameMode === 'QUICK');
      const hasWon = checkWinCondition(player.pawns, isQuick);

      if (hasWon) {
        concludeMatch(io, room, userId);
        return;
      }

      if (lastRoll === 6 || capturedPawnIndex !== -1) {
        startTurnClock(io, room);
      } else {
        switchTurn(io, room);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Player disconnected: ${socket.id}`);
    });
  });

  function handleSnakeMove(io, room, userId, roll) {
    const isP1 = (room.p1.userId === userId);
    const player = isP1 ? room.p1 : room.p2;

    const result = calculateSnakePosition(player.snakePos, roll);
    player.snakePos = result.newPos;

    io.to(`room_${room.battleId}`).emit('SNAKE_MOVED', {
      userId,
      roll,
      event: result.event,
      newPos: result.newPos,
      description: result.description,
      p1Pos: room.p1.snakePos,
      p2Pos: room.p2 ? room.p2.snakePos : 0
    });

    if (result.event === 'WIN' || player.snakePos === 100) {
      concludeMatch(io, room, userId);
      return;
    }

    if (roll === 6) {
      startTurnClock(io, room);
    } else {
      switchTurn(io, room);
    }
  }

  function executeBotLudoMove(io, room, roll) {
    setTimeout(() => {
      if (room.isSettled) return;
      const bot = room.p2;
      const opponent = room.p1;

      let chosenPawn = -1;
      for (let i = 0; i < 4; i++) {
        const current = bot.pawns[i];
        const target = calculateNextPosition(current, roll, 2);
        if (target !== current) {
          chosenPawn = i;
          break;
        }
      }

      if (chosenPawn !== -1) {
        const current = bot.pawns[chosenPawn];
        const newPos = calculateNextPosition(current, roll, 2);
        bot.pawns[chosenPawn] = newPos;

        const capturedPawnIndex = checkForPawnCapture(newPos, opponent.pawns);
        if (capturedPawnIndex !== -1) opponent.pawns[capturedPawnIndex] = 0;

        io.to(`room_${room.battleId}`).emit('PAWN_MOVED', {
          userId: bot.userId,
          pawnIndex: chosenPawn,
          newPos,
          capturedPawnIndex,
          p1Pawns: room.p1.pawns,
          p2Pawns: bot.pawns
        });

        const isQuick = (room.gameMode === 'QUICK');
        if (checkWinCondition(bot.pawns, isQuick)) {
          concludeMatch(io, room, bot.userId);
          return;
        }

        if (roll === 6 || capturedPawnIndex !== -1) {
          startTurnClock(io, room);
        } else {
          switchTurn(io, room);
        }
      } else {
        switchTurn(io, room);
      }
    }, 1600);
  }

  function startTurnClock(io, room) {
    if (room.turnTimer) clearTimeout(room.turnTimer);

    room.turnTimer = setTimeout(() => {
      const currentPlayer = (room.turnPlayerId === room.p1.userId) ? room.p1 : room.p2;
      if (currentPlayer) {
        currentPlayer.missedTurns++;
        io.to(`room_${room.battleId}`).emit('TURN_MISSED', {
          userId: currentPlayer.userId,
          missedCount: currentPlayer.missedTurns
        });

        if (currentPlayer.missedTurns >= 3) {
          const opponent = (currentPlayer === room.p1) ? room.p2 : room.p1;
          if (opponent) {
            io.to(`room_${room.battleId}`).emit('MATCH_FORFEITED', {
              forfeitedByUserId: currentPlayer.userId,
              winnerUserId: opponent.userId
            });
            concludeMatch(io, room, opponent.userId);
            return;
          }
        }
      }
      switchTurn(io, room);
    }, 15000);
  }

  function switchTurn(io, room) {
    if (room.isSettled) return;
    const nextPlayerId = (room.turnPlayerId === room.p1.userId && room.p2) ? room.p2.userId : room.p1.userId;
    room.turnPlayerId = nextPlayerId;

    io.to(`room_${room.battleId}`).emit('TURN_SWITCHED', {
      turnPlayerId: nextPlayerId
    });

    startTurnClock(io, room);

    if (room.isBotMatch && room.p2 && nextPlayerId === room.p2.userId) {
      setTimeout(() => {
        if (!room.isSettled && room.turnPlayerId === room.p2.userId) {
          const roll = generateServerDiceRoll();
          room.lastRoll = roll;
          io.to(`room_${room.battleId}`).emit('DICE_ROLLED', {
            userId: room.p2.userId,
            roll,
            consecutiveSixes: 0,
            isTurnCancelled: false
          });

          if (room.gameMode === 'SNAKE') {
            handleSnakeMove(io, room, room.p2.userId, roll);
          } else {
            executeBotLudoMove(io, room, roll);
          }
        }
      }, 1400);
    }
  }

  async function concludeMatch(io, room, winnerUserId) {
    if (room.isSettled) return;
    room.isSettled = true;
    if (room.turnTimer) clearTimeout(room.turnTimer);

    io.to(`room_${room.battleId}`).emit('MATCH_CONCLUDED', {
      winnerUserId,
      battleId: room.battleId,
      prizePool: 95.00
    });
    activeRooms.delete(room.battleId);
  }

  function generateServerDiceRoll() {
    const rand = Math.random() * 100;
    if (rand < 18.5) return 6;
    return Math.floor(Math.random() * 5) + 1;
  }
}

module.exports = { setupGameSockets };
