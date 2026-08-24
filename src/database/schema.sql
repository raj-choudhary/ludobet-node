-- ====================================================================
-- LUDO BET - ENTERPRISE PRODUCTION DATABASE SCHEMA (MySQL 8.0+)
-- Architecture: 1v1 Battles, Double-Entry Shadow Accounting & RBAC
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `ludobet_master` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `ludobet_master`;

-- 1. USERS TABLE (Players & Bot Personas)
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(15) NOT NULL,
  `name` VARCHAR(60) NOT NULL,
  `password_hash` VARCHAR(255) NULL,
  `avatar_id` VARCHAR(50) NOT NULL DEFAULT 'avatar_1',
  `player_level` INT UNSIGNED NOT NULL DEFAULT 1,
  `referral_code` VARCHAR(20) NOT NULL,
  `referred_by_id` BIGINT UNSIGNED NULL,
  `is_bot` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0: Real Player, 1: Stealth Bot Persona',
  `is_banned` TINYINT(1) NOT NULL DEFAULT 0,
  `ban_reason` VARCHAR(255) NULL,
  `kyc_status` ENUM('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `device_id` VARCHAR(128) NULL,
  `last_ip` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_mobile` (`mobile`),
  UNIQUE KEY `idx_users_referral` (`referral_code`),
  KEY `idx_users_is_bot` (`is_bot`),
  KEY `idx_users_kyc` (`kyc_status`),
  CONSTRAINT `fk_users_referred_by` FOREIGN KEY (`referred_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WALLETS TABLE (Real Money Balances with Row-Level Locking)
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `deposit_balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Unwithdrawable real deposit fund',
  `winning_balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Withdrawable net winnings',
  `bonus_balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Promotional gameplay bonus',
  `locked_balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Currently locked in active 1v1 battles',
  `total_deposited` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_withdrawn` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_won` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_wallets_user_id` (`user_id`),
  CONSTRAINT `fk_wallets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BATTLES TABLE (Strictly 1v1 2-Player Battles: Classic, Quick, Snake)
CREATE TABLE IF NOT EXISTS `battles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `battle_code` VARCHAR(32) NOT NULL,
  `game_mode` ENUM('CLASSIC', 'QUICK', 'SNAKE') NOT NULL,
  `entry_fee` DECIMAL(10,2) NOT NULL,
  `prize_pool` DECIMAL(10,2) NOT NULL,
  `rake_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `creator_id` BIGINT UNSIGNED NOT NULL,
  `joiner_id` BIGINT UNSIGNED NULL,
  `winner_id` BIGINT UNSIGNED NULL,
  `room_code` VARCHAR(20) NULL,
  `status` ENUM('OPEN', 'RUNNING', 'COMPLETED', 'DISPUTED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
  `is_bot_match` TINYINT(1) NOT NULL DEFAULT 0,
  `bot_win_rate_target` INT UNSIGNED NOT NULL DEFAULT 55,
  `game_state_json` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `started_at` TIMESTAMP NULL DEFAULT NULL,
  `ended_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_battles_code` (`battle_code`),
  KEY `idx_battles_status` (`status`),
  KEY `idx_battles_mode` (`game_mode`),
  KEY `idx_battles_creator` (`creator_id`),
  KEY `idx_battles_joiner` (`joiner_id`),
  KEY `idx_battles_winner` (`winner_id`),
  CONSTRAINT `fk_battles_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_battles_joiner` FOREIGN KEY (`joiner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_battles_winner` FOREIGN KEY (`winner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TRANSACTIONS TABLE (Double-Entry Financial Ledger)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_code` VARCHAR(40) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM(
    'DEPOSIT', 
    'WITHDRAWAL', 
    'BATTLE_ENTRY', 
    'BATTLE_WIN', 
    'BATTLE_REFUND', 
    'BONUS_CREDIT', 
    'TDS_DEDUCTION', 
    'MANUAL_ADJUSTMENT'
  ) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `fee_deducted` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tds_deducted` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '30% Sec 194BA',
  `net_amount` DECIMAL(12,2) NOT NULL,
  `payment_gateway` VARCHAR(40) NULL,
  `gateway_order_id` VARCHAR(100) NULL,
  `utr_number` VARCHAR(100) NULL,
  `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `closing_balance` DECIMAL(12,2) NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_transactions_code` (`transaction_code`),
  KEY `idx_transactions_user_id` (`user_id`),
  KEY `idx_transactions_type` (`type`),
  KEY `idx_transactions_status` (`status`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. HOUSE_LEDGER TABLE (Platform P&L & Shadow Bot Accounting)
CREATE TABLE IF NOT EXISTS `house_ledger` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `battle_id` BIGINT UNSIGNED NULL,
  `transaction_id` BIGINT UNSIGNED NULL,
  `entry_type` ENUM(
    'ORGANIC_P2P_RAKE', 
    'HOUSE_BOT_WIN_PROFIT', 
    'HOUSE_BOT_LOSS_PAYOUT', 
    'TDS_RESERVE'
  ) NOT NULL,
  `credit_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `debit_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `net_profit_impact` DECIMAL(12,2) NOT NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_house_battle` (`battle_id`),
  KEY `idx_house_type` (`entry_type`),
  CONSTRAINT `fk_house_battle` FOREIGN KEY (`battle_id`) REFERENCES `battles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_house_txn` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ADMIN_EMPLOYEES TABLE (Super Admin & 8-Role RBAC)
CREATE TABLE IF NOT EXISTS `admin_employees` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_EXECUTIVE', 'DISPUTE_ARBITRATOR', 'GAME_OPERATOR', 'MARKETING_MANAGER', 'SUPPORT_AGENT', 'SECURITY_ANALYST') NOT NULL DEFAULT 'ADMIN',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `two_factor_secret` VARCHAR(100) NULL,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_admin_username` (`username`),
  UNIQUE KEY `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PLATFORM_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `platform_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `setting_group` ENUM('FINANCIAL', 'GAME_ENGINE', 'PAYMENT_GATEWAYS', 'SMS_GATEWAYS', 'SECURITY_RULES') NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_name` VARCHAR(60) NOT NULL,
  `actor_role` VARCHAR(40) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
