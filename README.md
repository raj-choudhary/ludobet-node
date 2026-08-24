# 👑 Ludo Bet — Enterprise Full-Stack Node.js MVC Real-Money Gaming Platform

An enterprise-grade Real-Money Gaming (RMG) web application built with **Node.js, Express, EJS, MySQL 8.0 (ACID InnoDB), and Socket.IO**.

---

## 🎮 Game Modes (Strictly 1v1 Format)
- 🎲 **Ludo Classic (1v1)**: Traditional 52-cell board, 4 tokens each, safe stars, 15-second turn timer.
- ⚡ **Ludo Quick Blitz (1v1)**: 1-token blitz mode where the first pawn to reach home wins instantly.
- 🪜 **Snakes & Ladders (1v1)**: Interactive 1-100 hazard board duel.

---

## 🏗️ Architecture & Features
- **MVC Architecture**: Clean separation of `models/` (MySQL row locks), `controllers/`, and modular dynamic `views/` (EJS).
- **Double-Entry Accounting**: Segregated Real User Bank Escrow Liability vs House Bot GGR Profits.
- **Server Authority**: 100% Server-Authoritative cryptographic dice RNG (18.5% six bias) and move validation.
- **2FA Admin Cockpit**: Super Admin portal with 2FA TOTP authentication, financial matrix, player controls, and 1-click ghost battle injectors.
- **Section 194BA Compliant**: 30% TDS calculation on net winnings for 24x7 instant withdrawals.

---

## 🚀 Quick Start (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and set your MySQL database credentials:
```bash
cp .env.example .env
```

### 3. Setup Database
Import the SQL files into MySQL 8.0:
- `src/database/schema.sql` (Creates 8 tables)
- `src/database/seed.sql` (Creates Super Admin and Bot Personas)

### 4. Run Server
```bash
# Start production server
npm start

# Or with nodemon for development
npm run dev
```

---

## 🌐 Default Access Points:
- 📱 **Player App**: `http://localhost:3000/`
- 💰 **Luxury Vault Wallet**: `http://localhost:3000/wallet`
- ⚔️ **1v1 Classic Arena**: `http://localhost:3000/ludo-classic`
- 🛡️ **Admin Portal**: `http://localhost:3000/admin/login`
- 👑 **Super Admin Credentials**:
  - **Username**: `superadmin`
  - **Password**: `Admin@12345`
  - **2FA Code**: `123456`
