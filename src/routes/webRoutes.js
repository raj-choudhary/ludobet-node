const express = require('express');
const router = express.Router();

const PlayerController = require('../controllers/playerController');
const WalletController = require('../controllers/walletController');
const BattleController = require('../controllers/battleController');

// Player Web Routes
router.get('/', PlayerController.renderHome);
router.get('/ranking', PlayerController.renderRanking);
router.get('/profile', PlayerController.renderProfile);
router.get('/kyc', PlayerController.renderKyc);
router.get('/refer-earn', PlayerController.renderRefer);

// Wallet Web Routes
router.get('/wallet', WalletController.renderWallet);
router.get('/withdraw', WalletController.renderWithdraw);

// 1v1 Battle Web Routes
router.get('/ludo-classic', BattleController.renderClassic);
router.get('/ludo-quick', BattleController.renderQuick);
router.get('/snake-ladders', BattleController.renderSnake);

module.exports = router;
