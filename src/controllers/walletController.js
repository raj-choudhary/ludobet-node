const Wallet = require('../models/Wallet');

class WalletController {
  static async renderWallet(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    res.render('player/wallet', {
      title: '3D Luxury Vault Wallet — Add Cash & Balances',
      user,
      wallet,
      activeNav: 'wallet'
    });
  }

  static async renderWithdraw(req, res) {
    const user = req.user || { id: 1, name: 'Player_Demo' };
    const wallet = await Wallet.getByUserId(user.id);
    res.render('player/withdraw', {
      title: '24x7 Instant UPI & IMPS Withdrawal',
      user,
      wallet,
      activeNav: 'wallet'
    });
  }

  static async handleDeposit(req, res) {
    try {
      const { userId, amount, gateway, gatewayOrderId, utrNumber } = req.body;
      const result = await Wallet.creditDeposit(userId || 1, amount, gateway, gatewayOrderId, utrNumber);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async handleWithdraw(req, res) {
    try {
      const { userId, amount, payoutMethod, payoutDetails } = req.body;
      const result = await Wallet.requestWithdrawal(userId || 1, amount, payoutMethod, payoutDetails);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = WalletController;
