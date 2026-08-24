const express = require('express');
const router = express.Router();

const Wallet = require('../models/Wallet');
const Battle = require('../models/Battle');
const User = require('../models/User');

// Helper to fetch user data for views
async function getContext(req) {
  const user = req.user || { id: 1, name: 'Player_Demo', mobile: '+919876543210', player_level: 5, kyc_status: 'VERIFIED', referral_code: 'LUDO999' };
  let wallet = null;
  try {
    wallet = await Wallet.getByUserId(user.id);
  } catch (e) {
    wallet = { deposit_balance: 10250, winning_balance: 2200, bonus_balance: 0 };
  }
  return { user, wallet };
}

// 1. Core Player Navigation Routes (Pure Native EJS rendering)
router.get('/', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/home', { layout: false, ...ctx, title: 'Ludo Tournament King — Win Real Cash' });
});

router.get('/ranking', async (req, res) => {
  const ctx = await getContext(req);
  let topPlayers = [];
  try { topPlayers = await User.getTopPlayers(10); } catch(e) {}
  res.render('player/ranking', { layout: false, ...ctx, topPlayers, title: 'Leaderboard & Rankings — Ludo Bet' });
});

router.get('/wallet', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/wallet', { layout: false, ...ctx, title: 'My Wallet — Ludo Bet' });
});

router.get('/withdraw', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/withdraw', { layout: false, ...ctx, title: 'Instant Withdraw — Ludo Bet' });
});

router.get('/profile', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/profile', { layout: false, ...ctx, title: 'Player Profile & Stats — Ludo Bet' });
});

router.get('/refer-earn', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/refer-earn', { layout: false, ...ctx, title: 'Refer & Earn — Ludo Bet' });
});

router.get('/kyc', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/kyc', { layout: false, ...ctx, title: 'KYC Document Verification — Ludo Bet' });
});

// 2. 1v1 Battle Arenas
router.get('/ludo-classic', async (req, res) => {
  const ctx = await getContext(req);
  let openBattles = [];
  try { openBattles = await Battle.getOpenBattles('CLASSIC'); } catch(e) {}
  res.render('player/ludo-classic', { layout: false, ...ctx, openBattles, title: 'Ludo Classic Battle Arena' });
});

router.get('/ludo-quick', async (req, res) => {
  const ctx = await getContext(req);
  let openBattles = [];
  try { openBattles = await Battle.getOpenBattles('QUICK'); } catch(e) {}
  res.render('player/ludo-quick', { layout: false, ...ctx, openBattles, title: 'Ludo Quick Blitz Arena' });
});

router.get('/snake-ladders', async (req, res) => {
  const ctx = await getContext(req);
  let openBattles = [];
  try { openBattles = await Battle.getOpenBattles('SNAKE'); } catch(e) {}
  res.render('player/snake-ladders', { layout: false, ...ctx, openBattles, title: 'Snake & Ladders Duel' });
});

// 3. Game Play Canvas Engines
router.get('/game-play', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/game-play', { layout: false, ...ctx, title: 'Live Ludo Canvas Game Play' });
});

router.get('/snake-gameplay', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/snake-gameplay', { layout: false, ...ctx, title: 'Live Snake & Ladders Game Play' });
});

// 4. Matchmaking & Result Flows
router.get('/match-room', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/match-room', { layout: false, ...ctx, title: '1v1 Matchmaking Room' });
});

router.get('/match-result', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/match-result', { layout: false, ...ctx, title: 'Match Result & Winnings' });
});

router.get('/my-battles', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/my-battles', { layout: false, ...ctx, title: 'My Match Records' });
});

// 5. Utility & Information Pages
router.get('/transactions', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/transactions', { layout: false, ...ctx, title: 'Transaction History Passbook' });
});

router.get('/notifications', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/notifications', { layout: false, ...ctx, title: 'Notifications Center' });
});

router.get('/payment-gateway', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/payment-gateway', { layout: false, ...ctx, title: 'Secure Payment Gateway' });
});

router.get('/how-to-play', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/how-to-play', { layout: false, ...ctx, title: 'How To Play & Win' });
});

router.get('/rules', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/rules', { layout: false, ...ctx, title: 'Official Game Rules' });
});

router.get('/settings', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/settings', { layout: false, ...ctx, title: 'Game Settings' });
});

router.get('/terms', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/terms', { layout: false, ...ctx, title: 'Terms & Conditions' });
});

router.get('/privacy', async (req, res) => {
  const ctx = await getContext(req);
  res.render('player/privacy', { layout: false, ...ctx, title: 'Privacy Policy' });
});

router.get('/login', async (req, res) => {
  res.render('player/login', { layout: false, title: 'Player Login & Registration' });
});

module.exports = router;
