const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const WalletController = require('../controllers/walletController');
const BattleController = require('../controllers/battleController');
const AdminController = require('../controllers/adminController');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'Ludo Bet 1v1 Full-Stack MVC Engine',
    database: 'MySQL 8.0 ACID Protected',
    timestamp: new Date().toISOString()
  });
});

// Auth API
router.post('/auth/login', AuthController.login);

// Wallet APIs
router.post('/wallet/deposit', WalletController.handleDeposit);
router.post('/wallet/withdraw', WalletController.handleWithdraw);

// Battle APIs
router.post('/battles/create', BattleController.createBattle);
router.post('/battles/join', BattleController.joinBattle);

// Admin APIs
router.post('/admin/login', AdminController.handleLogin);
router.post('/admin/inject-ghost-battle', AdminController.handleInjectGhost);

module.exports = router;
