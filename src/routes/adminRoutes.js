const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');
const User = require('../models/User');
const Battle = require('../models/Battle');

// All 46 Enterprise Admin Pages
const adminPages = [
  'dashboard',
  'login',
  'players',
  'players-banned',
  'player-view',
  'finance',
  'finance-deposits',
  'finance-withdrawals',
  'finance-adjustments',
  'finance-ledger',
  'kyc',
  'kyc-history',
  'games-classic',
  'games-quick',
  'games-snake',
  'battles',
  'battles-open',
  'battles-running',
  'battles-completed',
  'battles-cancelled',
  'battles-disputes',
  'tournaments',
  'rewards',
  'rewards-bonuses',
  'rewards-referrals',
  'rewards-spin',
  'marketing',
  'marketing-banners',
  'marketing-notifications',
  'support',
  'security',
  'employees',
  'settings',
  'settings-financial',
  'settings-game-engine',
  'settings-payment-gateways',
  'settings-sms-gateways',
  'settings-notifications-templates',
  'settings-system-security',
  'audit-logs',
  'emergency',
  'bonuses',
  'disputes',
  'withdrawals'
];

router.get('/', (req, res) => {
  res.render('admin/dashboard', { layout: false, title: 'Ludo Bet — Super Admin Cockpit' });
});

adminPages.forEach(page => {
  router.get(`/${page}`, async (req, res) => {
    let stats = null;
    let bots = [];
    let openBattles = [];
    try {
      stats = await Admin.getFinancialStats();
      bots = await User.getBots();
      openBattles = await Battle.getOpenBattles();
    } catch(e) {}
    res.render(`admin/${page}`, { layout: false, stats, bots, openBattles, title: `Ludo Bet Admin — ${page}` });
  });

  router.get(`/${page}.html`, async (req, res) => {
    let stats = null;
    let bots = [];
    let openBattles = [];
    try {
      stats = await Admin.getFinancialStats();
      bots = await User.getBots();
      openBattles = await Battle.getOpenBattles();
    } catch(e) {}
    res.render(`admin/${page}`, { layout: false, stats, bots, openBattles, title: `Ludo Bet Admin — ${page}` });
  });
});

module.exports = router;
