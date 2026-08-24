const express = require('express');
const path = require('path');
const router = express.Router();

const adminDir = path.join(__dirname, '../../public/admin');

// Serve all 46 Admin Pages (Both clean URLs and .html extensions)
const adminPages = [
  'index',
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

router.get('/', (req, res) => res.sendFile(path.join(adminDir, 'index.html')));

adminPages.forEach(page => {
  const targetFile = page === 'dashboard' ? 'index.html' : `${page}.html`;
  router.get(`/${page}`, (req, res) => res.sendFile(path.join(adminDir, targetFile)));
  router.get(`/${page}.html`, (req, res) => res.sendFile(path.join(adminDir, targetFile)));
});

module.exports = router;
