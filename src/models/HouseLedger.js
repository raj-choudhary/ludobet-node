const db = require('../config/db');

class HouseLedger {
  static async getAuditSummary() {
    try {
      const realEscrow = await db.query(
        `SELECT 
           COALESCE(SUM(deposit_balance), 0) AS total_real_deposits_held,
           COALESCE(SUM(winning_balance), 0) AS total_real_winnings_held,
           COALESCE(SUM(deposit_balance + winning_balance), 0) AS total_real_bank_escrow_liability
         FROM wallets w
         JOIN users u ON w.user_id = u.id
         WHERE u.is_bot = 0`
      );

      const rakeReport = await db.query(
        `SELECT COALESCE(SUM(credit_amount), 0) AS total_p2p_rake
         FROM house_ledger
         WHERE entry_type = 'ORGANIC_P2P_RAKE'`
      );

      const botProfitReport = await db.query(
        `SELECT 
           COALESCE(SUM(credit_amount), 0) AS bot_gross_winnings,
           COALESCE(SUM(debit_amount), 0) AS player_winnings_paid_by_house,
           COALESCE(SUM(net_profit_impact), 0) AS house_bot_net_profit
         FROM house_ledger
         WHERE entry_type IN ('HOUSE_BOT_WIN_PROFIT', 'HOUSE_BOT_LOSS_PAYOUT')`
      );

      const p2pRake = parseFloat(rakeReport?.[0]?.total_p2p_rake || 0);
      const botNetProfit = parseFloat(botProfitReport?.[0]?.house_bot_net_profit || 0);

      return {
        realUserEscrowLiability: realEscrow?.[0] || { total_real_bank_escrow_liability: 0 },
        p2pOrganicRakeRevenue: p2pRake,
        houseBotAccounting: {
          botGrossWinnings: parseFloat(botProfitReport?.[0]?.bot_gross_winnings || 0),
          playerWinningsPaid: parseFloat(botProfitReport?.[0]?.player_winnings_paid_by_house || 0),
          houseBotNetProfit: botNetProfit
        },
        totalPlatformNetRevenue: p2pRake + botNetProfit
      };
    } catch (err) {
      return {
        realUserEscrowLiability: { total_real_bank_escrow_liability: 0 },
        p2pOrganicRakeRevenue: 0,
        houseBotAccounting: { botGrossWinnings: 0, playerWinningsPaid: 0, houseBotNetProfit: 0 },
        totalPlatformNetRevenue: 0
      };
    }
  }
}

module.exports = HouseLedger;
