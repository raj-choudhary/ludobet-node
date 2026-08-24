require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  JWT_SECRET: process.env.JWT_SECRET || 'ludobet_super_secure_jwt_token_2026_x89f2',
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || 'ludobet_super_admin_jwt_secret_vault_9921',
  JWT_EXPIRES_IN: '30d',
  
  // MySQL Database Configuration (Strictly MySQL 8.0)
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'ludobet_master',
  
  // Financial Rules
  DEFAULT_RAKE_PERCENT: 5.0,
  QUICK_RAKE_PERCENT: 6.0,
  TDS_RATE_PERCENT: 30.0, // Section 194BA
  
  // Payment Gateways
  MANUAL_UPI_VPA: process.env.MANUAL_UPI_VPA || 'ludobet.business@icici'
};
