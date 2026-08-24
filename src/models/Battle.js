const db = require('../config/db');

class Battle {
  static async getOpenBattles(gameMode = null) {
    let sql = `
      SELECT b.*, u.name AS creator_name, u.avatar_id, u.is_bot AS is_creator_bot
      FROM battles b
      JOIN users u ON b.creator_id = u.id
      WHERE b.status = 'OPEN'
    `;
    const params = [];
    if (gameMode) {
      sql += ' AND b.game_mode = ?';
      params.push(gameMode.toUpperCase());
    }
    sql += ' ORDER BY b.id DESC LIMIT 50';
    return await db.query(sql, params);
  }

  static async getRunningBattles() {
    return await db.query(`
      SELECT b.*, u1.name AS creator_name, u2.name AS joiner_name
      FROM battles b
      JOIN users u1 ON b.creator_id = u1.id
      LEFT JOIN users u2 ON b.joiner_id = u2.id
      WHERE b.status = 'RUNNING'
      ORDER BY b.started_at DESC LIMIT 30
    `);
  }

  static async findById(battleId) {
    const rows = await db.query(`
      SELECT b.*, u1.name AS creator_name, u2.name AS joiner_name
      FROM battles b
      JOIN users u1 ON b.creator_id = u1.id
      LEFT JOIN users u2 ON b.joiner_id = u2.id
      WHERE b.id = ?
    `, [battleId]);
    return rows[0] || null;
  }

  static async create({ userId, gameMode, entryFee }) {
    const fee = parseFloat(entryFee);
    const rakePercent = (gameMode.toUpperCase() === 'QUICK') ? 0.06 : 0.05;
    const rake = fee * 2 * rakePercent;
    const prizePool = (fee * 2) - rake;
    const battleCode = 'BTL-' + Math.floor(10000 + Math.random() * 90000);

    return await db.executeTransaction(async (conn) => {
      // 1. Lock creator balance
      const [wallets] = await conn.query('SELECT * FROM wallets WHERE user_id = ? FOR UPDATE', [userId]);
      if (!wallets.length || (parseFloat(wallets[0].deposit_balance) + parseFloat(wallets[0].winning_balance)) < fee) {
        throw new Error('Insufficient wallet balance to create challenge.');
      }

      await conn.query(
        'UPDATE wallets SET locked_balance = locked_balance + ?, deposit_balance = GREATEST(0, deposit_balance - ?) WHERE user_id = ?',
        [fee, fee, userId]
      );

      // 2. Insert battle record
      const [ins] = await conn.query(
        `INSERT INTO battles (battle_code, game_mode, entry_fee, prize_pool, rake_amount, creator_id, status)
         VALUES (?, ?, ?, ?, ?, ?, 'OPEN')`,
        [battleCode, gameMode.toUpperCase(), fee, prizePool, rake, userId]
      );

      return {
        battleId: ins.insertId,
        battleCode,
        entryFee: fee,
        prizePool,
        gameMode: gameMode.toUpperCase()
      };
    });
  }

  static async join({ userId, battleId }) {
    return await db.executeTransaction(async (conn) => {
      const [battles] = await conn.query('SELECT * FROM battles WHERE id = ? AND status = "OPEN" FOR UPDATE', [battleId]);
      if (!battles.length) throw new Error('Battle is no longer available.');

      const battle = battles[0];
      if (battle.creator_id === userId) throw new Error('Cannot join your own challenge.');

      const fee = parseFloat(battle.entry_fee);
      const [wallets] = await conn.query('SELECT * FROM wallets WHERE user_id = ? FOR UPDATE', [userId]);
      if (!wallets.length || (parseFloat(wallets[0].deposit_balance) + parseFloat(wallets[0].winning_balance)) < fee) {
        throw new Error('Insufficient wallet balance to join challenge.');
      }

      await conn.query(
        'UPDATE wallets SET locked_balance = locked_balance + ?, deposit_balance = GREATEST(0, deposit_balance - ?) WHERE user_id = ?',
        [fee, fee, userId]
      );

      await conn.query(
        'UPDATE battles SET joiner_id = ?, status = "RUNNING", started_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId, battleId]
      );

      return {
        battleId,
        battleCode: battle.battle_code,
        gameMode: battle.game_mode,
        entryFee: fee,
        prizePool: battle.prize_pool
      };
    });
  }
}

module.exports = Battle;
