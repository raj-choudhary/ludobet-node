const express = require('express');
const path = require('path');
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

// Extra Player Sub-pages & Utilities
router.get('/game-play', (req, res) => res.sendFile(path.join(__dirname, '../../public/game-play.html')));
router.get('/snake-gameplay', (req, res) => res.sendFile(path.join(__dirname, '../../public/snake-gameplay.html')));
router.get('/match-room', (req, res) => res.sendFile(path.join(__dirname, '../../public/match-room.html')));
router.get('/match-result', (req, res) => res.sendFile(path.join(__dirname, '../../public/match-result.html')));
router.get('/my-battles', (req, res) => res.sendFile(path.join(__dirname, '../../public/my-battles.html')));
router.get('/transactions', (req, res) => res.sendFile(path.join(__dirname, '../../public/transactions.html')));
router.get('/notifications', (req, res) => res.sendFile(path.join(__dirname, '../../public/notifications.html')));
router.get('/how-to-play', (req, res) => res.sendFile(path.join(__dirname, '../../public/how-to-play.html')));
router.get('/rules', (req, res) => res.sendFile(path.join(__dirname, '../../public/rules.html')));
router.get('/settings', (req, res) => res.sendFile(path.join(__dirname, '../../public/settings.html')));
router.get('/terms', (req, res) => res.sendFile(path.join(__dirname, '../../public/terms.html')));
router.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, '../../public/privacy.html')));

module.exports = router;
