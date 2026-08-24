const express = require('express');
const path = require('path');
const router = express.Router();

const publicDir = path.join(__dirname, '../../public');

// 1. Core Navigation Tabs
router.get('/', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
router.get('/index.html', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
router.get('/ranking', (req, res) => res.sendFile(path.join(publicDir, 'ranking.html')));
router.get('/ranking.html', (req, res) => res.sendFile(path.join(publicDir, 'ranking.html')));
router.get('/wallet', (req, res) => res.sendFile(path.join(publicDir, 'wallet.html')));
router.get('/wallet.html', (req, res) => res.sendFile(path.join(publicDir, 'wallet.html')));
router.get('/withdraw', (req, res) => res.sendFile(path.join(publicDir, 'withdraw.html')));
router.get('/withdraw.html', (req, res) => res.sendFile(path.join(publicDir, 'withdraw.html')));
router.get('/refer-earn', (req, res) => res.sendFile(path.join(publicDir, 'refer-earn.html')));
router.get('/refer-earn.html', (req, res) => res.sendFile(path.join(publicDir, 'refer-earn.html')));
router.get('/profile', (req, res) => res.sendFile(path.join(publicDir, 'profile.html')));
router.get('/profile.html', (req, res) => res.sendFile(path.join(publicDir, 'profile.html')));
router.get('/kyc', (req, res) => res.sendFile(path.join(publicDir, 'kyc.html')));
router.get('/kyc.html', (req, res) => res.sendFile(path.join(publicDir, 'kyc.html')));

// 2. 1v1 Battle Lobby Arenas
router.get('/ludo-classic', (req, res) => res.sendFile(path.join(publicDir, 'ludo-classic.html')));
router.get('/ludo-classic.html', (req, res) => res.sendFile(path.join(publicDir, 'ludo-classic.html')));
router.get('/ludo-quick', (req, res) => res.sendFile(path.join(publicDir, 'ludo-quick.html')));
router.get('/ludo-quick.html', (req, res) => res.sendFile(path.join(publicDir, 'ludo-quick.html')));
router.get('/snake-ladders', (req, res) => res.sendFile(path.join(publicDir, 'snake-ladders.html')));
router.get('/snake-ladders.html', (req, res) => res.sendFile(path.join(publicDir, 'snake-ladders.html')));

// 3. Game Play Canvas Engines
router.get('/game-play', (req, res) => res.sendFile(path.join(publicDir, 'game-play.html')));
router.get('/game-play.html', (req, res) => res.sendFile(path.join(publicDir, 'game-play.html')));
router.get('/snake-gameplay', (req, res) => res.sendFile(path.join(publicDir, 'snake-gameplay.html')));
router.get('/snake-gameplay.html', (req, res) => res.sendFile(path.join(publicDir, 'snake-gameplay.html')));

// 4. Matchmaking & Result Flows
router.get('/match-room', (req, res) => res.sendFile(path.join(publicDir, 'match-room.html')));
router.get('/match-room.html', (req, res) => res.sendFile(path.join(publicDir, 'match-room.html')));
router.get('/match-result', (req, res) => res.sendFile(path.join(publicDir, 'match-result.html')));
router.get('/match-result.html', (req, res) => res.sendFile(path.join(publicDir, 'match-result.html')));
router.get('/my-battles', (req, res) => res.sendFile(path.join(publicDir, 'my-battles.html')));
router.get('/my-battles.html', (req, res) => res.sendFile(path.join(publicDir, 'my-battles.html')));

// 5. Utility & Information Pages
router.get('/transactions', (req, res) => res.sendFile(path.join(publicDir, 'transactions.html')));
router.get('/transactions.html', (req, res) => res.sendFile(path.join(publicDir, 'transactions.html')));
router.get('/notifications', (req, res) => res.sendFile(path.join(publicDir, 'notifications.html')));
router.get('/notifications.html', (req, res) => res.sendFile(path.join(publicDir, 'notifications.html')));
router.get('/payment-gateway', (req, res) => res.sendFile(path.join(publicDir, 'payment-gateway.html')));
router.get('/payment-gateway.html', (req, res) => res.sendFile(path.join(publicDir, 'payment-gateway.html')));
router.get('/how-to-play', (req, res) => res.sendFile(path.join(publicDir, 'how-to-play.html')));
router.get('/how-to-play.html', (req, res) => res.sendFile(path.join(publicDir, 'how-to-play.html')));
router.get('/rules', (req, res) => res.sendFile(path.join(publicDir, 'rules.html')));
router.get('/rules.html', (req, res) => res.sendFile(path.join(publicDir, 'rules.html')));
router.get('/settings', (req, res) => res.sendFile(path.join(publicDir, 'settings.html')));
router.get('/settings.html', (req, res) => res.sendFile(path.join(publicDir, 'settings.html')));
router.get('/terms', (req, res) => res.sendFile(path.join(publicDir, 'terms.html')));
router.get('/terms.html', (req, res) => res.sendFile(path.join(publicDir, 'terms.html')));
router.get('/privacy', (req, res) => res.sendFile(path.join(publicDir, 'privacy.html')));
router.get('/privacy.html', (req, res) => res.sendFile(path.join(publicDir, 'privacy.html')));
router.get('/login', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));
router.get('/login.html', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));

module.exports = router;
