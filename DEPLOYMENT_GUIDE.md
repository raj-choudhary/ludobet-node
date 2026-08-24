# 🚀 HOSTINGER 1-CLICK DEPLOYMENT GUIDE: LUDO BET NODE.JS MVC PLATFORM

Deploy your production-ready Real-Money Gaming Platform to Hostinger (VPS / Cloud / cPanel Node.js Selector) in 4 simple steps:

---

## 📋 Pre-requisites on Hostinger:
1. Node.js v18+ or v20+ / v22+
2. MySQL 8.0 Database created via Hostinger hPanel

---

## 🛠️ Step 1: Upload & Extract Code
1. Upload `ludobet-app-production.zip` to your Hostinger server directory (e.g. `/public_html` or `/var/www/ludobet`).
2. Extract the zip file:
   ```bash
   unzip ludobet-app-production.zip
   ```

---

## 🗄️ Step 2: Import MySQL Database
1. Open Hostinger **phpMyAdmin**.
2. Select your database (e.g. `u123456789_ludobet_master`).
3. Import `src/database/schema.sql` (Creates 8 ACID tables).
4. Import `src/database/seed.sql` (Creates default Super Admin & 10 Indian bot personas).

---

## ⚙️ Step 3: Configure `.env`
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Hostinger MySQL DB credentials:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=u123456789_ludo
   DB_PASSWORD=YourDatabasePassword
   DB_NAME=u123456789_ludobet_master
   ```

---

## 🚀 Step 4: Install Dependencies & Start Server
Run the following commands:
```bash
# 1. Install production dependencies
npm install --production

# 2. Start server with PM2 Process Manager (Auto-restart on crash)
pm2 start server.js --name "ludobet"

# 3. Save PM2 startup state
pm2 save
pm2 startup
```

---

## 🌐 Production URLs & Default Credentials:
- 📱 **Player Web App**: `https://yourdomain.com/`
- 💰 **Luxury Wallet**: `https://yourdomain.com/wallet`
- ⚔️ **1v1 Classic Arena**: `https://yourdomain.com/ludo-classic`
- 🛡️ **Master Admin Console**: `https://yourdomain.com/admin/login`
- 👑 **Super Admin Login**:
  - **Username**: `superadmin`
  - **Password**: `Admin@12345`
  - **2FA Code**: `123456`
