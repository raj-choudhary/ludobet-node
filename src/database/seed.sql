USE `ludobet_master`;

-- 1. Default Super Admin (Default pass: Admin@12345)
INSERT INTO `admin_employees` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`)
VALUES (1, 'superadmin', 'admin@ludobet.in', '$2a$10$wN3vDkl89oZzY1Y3Y2vOwe8uO5v3sQZ6jD2X1cK5.V1uX1q2w3e4r', 'SUPER_ADMIN', 1)
ON DUPLICATE KEY UPDATE `username`=`username`;

-- 2. Initial Realistic 1v1 Bot Personas Pool
INSERT INTO `users` (`id`, `mobile`, `name`, `avatar_id`, `player_level`, `referral_code`, `is_bot`, `kyc_status`)
VALUES 
  (101, '+919810100001', 'Rahul_Gamer', 'avatar_1', 24, 'BOTREF101', 1, 'VERIFIED'),
  (102, '+919810100002', 'Pooja_Patel', 'avatar_2', 19, 'BOTREF102', 1, 'VERIFIED'),
  (103, '+919810100003', 'Aman_Gamer', 'avatar_3', 31, 'BOTREF103', 1, 'VERIFIED'),
  (104, '+919810100004', 'Sneha_99', 'avatar_4', 15, 'BOTREF104', 1, 'VERIFIED'),
  (105, '+919810100005', 'Vikas_Pro', 'avatar_5', 28, 'BOTREF105', 1, 'VERIFIED'),
  (106, '+919810100006', 'Rohit_King', 'avatar_6', 22, 'BOTREF106', 1, 'VERIFIED'),
  (107, '+919810100007', 'Suraj_Ludo', 'avatar_7', 17, 'BOTREF107', 1, 'VERIFIED'),
  (108, '+919810100008', 'Priya_Singh', 'avatar_8', 25, 'BOTREF108', 1, 'VERIFIED'),
  (109, '+919810100009', 'Deepak_UP', 'avatar_9', 20, 'BOTREF109', 1, 'VERIFIED'),
  (110, '+919810100010', 'Manish_Star', 'avatar_10', 35, 'BOTREF110', 1, 'VERIFIED')
ON DUPLICATE KEY UPDATE `is_bot`=1;

-- 3. Initialize Wallets for Bot Personas (Infinite Virtual Balance)
INSERT INTO `wallets` (`user_id`, `deposit_balance`, `winning_balance`, `bonus_balance`, `locked_balance`)
VALUES 
  (101, 999999.00, 999999.00, 0.00, 0.00),
  (102, 999999.00, 999999.00, 0.00, 0.00),
  (103, 999999.00, 999999.00, 0.00, 0.00),
  (104, 999999.00, 999999.00, 0.00, 0.00),
  (105, 999999.00, 999999.00, 0.00, 0.00),
  (106, 999999.00, 999999.00, 0.00, 0.00),
  (107, 999999.00, 999999.00, 0.00, 0.00),
  (108, 999999.00, 999999.00, 0.00, 0.00),
  (109, 999999.00, 999999.00, 0.00, 0.00),
  (110, 999999.00, 999999.00, 0.00, 0.00)
ON DUPLICATE KEY UPDATE `deposit_balance`=999999.00;

-- 4. Default Platform Settings Matrix
INSERT INTO `platform_settings` (`setting_key`, `setting_value`, `setting_group`)
VALUES
  ('rake_classic_percent', '5.0', 'FINANCIAL'),
  ('rake_quick_percent', '6.0', 'FINANCIAL'),
  ('rake_snake_percent', '5.0', 'FINANCIAL'),
  ('min_deposit_amount', '50.00', 'FINANCIAL'),
  ('min_withdrawal_amount', '100.00', 'FINANCIAL'),
  ('tds_percent', '30.0', 'FINANCIAL'),
  ('global_bot_win_rate', '55', 'GAME_ENGINE'),
  ('dice_six_probability', '18.5', 'GAME_ENGINE'),
  ('consecutive_sixes_cap', '2', 'GAME_ENGINE'),
  ('turn_clock_seconds', '15', 'GAME_ENGINE'),
  ('manual_upi_vpa', 'ludobet.business@icici', 'PAYMENT_GATEWAYS')
ON DUPLICATE KEY UPDATE `setting_group`=VALUES(`setting_group`);
