const db = require('../config/db');

class User {
  static async findById(id) {
    const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByMobile(mobile) {
    const rows = await db.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
    return rows[0] || null;
  }

  static async create({ mobile, name, avatar_id = 'avatar_1', referral_code, referred_by_id = null }) {
    const refCode = referral_code || 'REF' + Math.floor(100000 + Math.random() * 900000);
    const result = await db.query(
      'INSERT INTO users (mobile, name, avatar_id, referral_code, referred_by_id) VALUES (?, ?, ?, ?, ?)',
      [mobile, name, avatar_id, refCode, referred_by_id]
    );
    const userId = result.insertId;
    // Create initialized wallet with ₹10 welcome bonus
    await db.query(
      'INSERT INTO wallets (user_id, deposit_balance, winning_balance, bonus_balance) VALUES (?, 0.00, 0.00, 10.00)',
      [userId]
    );
    return await this.findById(userId);
  }

  static async getTopPlayers(limit = 10) {
    return await db.query(
      `SELECT u.id, u.name, u.avatar_id, u.player_level, w.total_won 
       FROM users u 
       JOIN wallets w ON u.id = w.user_id 
       WHERE u.is_bot = 0 
       ORDER BY w.total_won DESC LIMIT ?`,
      [limit]
    );
  }

  static async getAllPlayers({ page = 1, limit = 20, search = '' }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT u.*, w.deposit_balance, w.winning_balance, w.bonus_balance, (w.deposit_balance + w.winning_balance) AS total_balance
      FROM users u
      LEFT JOIN wallets w ON u.id = w.user_id
      WHERE 1=1
    `;
    const params = [];
    if (search) {
      sql += ' AND (u.name LIKE ? OR u.mobile LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY u.id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    return await db.query(sql, params);
  }

  static async setBanStatus(userId, isBanned, reason = '') {
    await db.query('UPDATE users SET is_banned = ?, ban_reason = ? WHERE id = ?', [isBanned ? 1 : 0, reason, userId]);
    return true;
  }
}

module.exports = User;
