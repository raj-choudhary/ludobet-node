const Battle = require('../models/Battle');
const Wallet = require('../models/Wallet');

class BattleController {
  static async renderClassic(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    const openBattles = await Battle.getOpenBattles('CLASSIC');
    const runningBattles = await Battle.getRunningBattles();

    res.render('player/ludo-classic', {
      title: '1v1 Ludo Classic Battle Arena',
      user,
      wallet,
      openBattles,
      runningBattles,
      gameMode: 'CLASSIC',
      activeNav: 'home'
    });
  }

  static async renderQuick(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    const openBattles = await Battle.getOpenBattles('QUICK');
    const runningBattles = await Battle.getRunningBattles();

    res.render('player/ludo-quick', {
      title: '1v1 Ludo Quick Blitz Arena (1-Token Win)',
      user,
      wallet,
      openBattles,
      runningBattles,
      gameMode: 'QUICK',
      activeNav: 'home'
    });
  }

  static async renderSnake(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    const openBattles = await Battle.getOpenBattles('SNAKE');

    res.render('player/snake-ladders', {
      title: '1v1 Snake & Ladders Duel (1-100 Board)',
      user,
      wallet,
      openBattles,
      gameMode: 'SNAKE',
      activeNav: 'home'
    });
  }

  static async createBattle(req, res) {
    try {
      const { userId, gameMode, entryFee } = req.body;
      const result = await Battle.create({
        userId: userId || 1,
        gameMode: gameMode || 'CLASSIC',
        entryFee
      });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async joinBattle(req, res) {
    try {
      const { userId, battleId } = req.body;
      const result = await Battle.join({
        userId: userId || 1,
        battleId
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = BattleController;
