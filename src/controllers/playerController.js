const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Battle = require('../models/Battle');

class PlayerController {
  static async renderHome(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    const openBattles = await Battle.getOpenBattles();
    res.render('player/home', {
      title: 'Ludo Tournament King — 1v1 Real Cash Gaming',
      user,
      wallet,
      openBattles,
      activeNav: 'home'
    });
  }

  static async renderRanking(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    const topPlayers = await User.getTopPlayers(10);
    res.render('player/ranking', {
      title: 'Leaderboard & Top Winners',
      user,
      wallet,
      topPlayers,
      activeNav: 'ranking'
    });
  }

  static async renderProfile(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo', mobile: '+919876543210', player_level: 5, kyc_status: 'VERIFIED' };
    const wallet = await Wallet.getByUserId(user.id);
    res.render('player/profile', {
      title: 'Player Profile & Statistics',
      user,
      wallet,
      activeNav: 'profile'
    });
  }

  static async renderKyc(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo', kyc_status: 'PENDING' };
    res.render('player/kyc', {
      title: 'KYC Document Verification',
      user,
      activeNav: 'profile'
    });
  }

  static async renderRefer(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo', referral_code: 'LUDO999' };
    res.render('player/refer-earn', {
      title: 'Refer & Earn Real Cash Rewards',
      user,
      activeNav: 'refer'
    });
  }
}

module.exports = PlayerController;
