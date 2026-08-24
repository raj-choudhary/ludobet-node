const db = require('../config/db');

class Wallet {
  static async getByUserId(userId) {
    const rows = await db.query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
    return rows[0] || { deposit_balance: 0, winning_balance: 0, bonus_balance: 0, locked_balance: 0 };
  }

  static async lockBalanceForBattle(userId, fee, connection = null) {
    const queryExecutor = connection ? connection.query.bind(connection) : db.query.bind(db);
    
    const [wallets] = await queryExecutor(
      'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    if (!wallets.length) throw new Error('Wallet not found.');
    const wallet = wallets[0];
    const totalAvail = parseFloat(wallet.deposit_balance) + parseFloat(wallet.winning_balance);

    if (totalAvail < fee) throw new Error('Insufficient wallet balance.');

    // Deduct from deposit first, then winnings
    let depDeduct = Math.min(parseFloat(wallet.deposit_balance), fee);
    let winDeduct = fee - depDeduct;

    await queryExecutor(
      `UPDATE wallets 
       SET deposit_balance = deposit_balance - ?, 
           winning_balance = winning_balance - ?, 
           locked_balance = locked_balance + ? 
       WHERE user_id = ?`,
      [depDeduct, winDeduct, fee, userId]
    );

    return true;
  }

  static async creditDeposit(userId, amount, gateway, gatewayOrderId, utrNumber) {
    return await db.executeTransaction(async (conn) => {
      const parsedAmount = parseFloat(amount);
      if (parsedAmount <= 0) throw new Error('Invalid deposit amount.');

      await conn.query(
        'UPDATE wallets SET deposit_balance = deposit_balance + ?, total_deposited = total_deposited + ? WHERE user_id = ?',
        [parsedAmount, parsedAmount, userId]
      );

      const txnCode = 'TXN-DEP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      await conn.query(
        `INSERT INTO transactions (transaction_code, user_id, type, amount, fee_deducted, net_amount, payment_gateway, gateway_order_id, utr_number, status, closing_balance, notes)
         VALUES (?, ?, 'DEPOSIT', ?, 0.00, ?, ?, ?, ?, 'SUCCESS', (SELECT deposit_balance + winning_balance FROM wallets WHERE user_id = ?), 'Add cash deposit approved')`,
        [txnCode, userId, parsedAmount, parsedAmount, gateway, gatewayOrderId, utrNumber, userId]
      );

      return { success: true, txnCode, amount: parsedAmount };
    });
  }

  static async requestWithdrawal(userId, amount, payoutMethod, payoutDetails) {
    return await db.executeTransaction(async (conn) => {
      const parsedAmount = parseFloat(amount);
      if (parsedAmount < 100) throw new Error('Minimum withdrawal amount is ₹100.00');

      const [wallets] = await conn.query(
        'SELECT winning_balance FROM wallets WHERE user_id = ? FOR UPDATE',
        [userId]
      );

      if (!wallets.length || parseFloat(wallets[0].winning_balance) < parsedAmount) {
        throw new Error('Insufficient withdrawable winning balance.');
      }

      await conn.query(
        'UPDATE wallets SET winning_balance = winning_balance - ?, total_withdrawn = total_withdrawn + ? WHERE user_id = ?',
        [parsedAmount, parsedAmount, userId]
      );

      const txnCode = 'TXN-WTH-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      await conn.query(
        `INSERT INTO transactions (transaction_code, user_id, type, amount, fee_deducted, tds_deducted, net_amount, payment_gateway, status, closing_balance, notes)
         VALUES (?, ?, 'WITHDRAWAL', ?, 0.00, 0.00, ?, ?, 'PENDING', (SELECT deposit_balance + winning_balance FROM wallets WHERE user_id = ?), ?)`,
        [txnCode, userId, parsedAmount, parsedAmount, payoutMethod, userId, `Withdrawal request to ${payoutMethod}: ${payoutDetails}`]
      );

      return { success: true, txnCode, amount: parsedAmount, netPayout: parsedAmount };
    });
  }
}

module.exports = Wallet;
