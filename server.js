const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const { Server } = require('socket.io');

const config = require('./src/config/env');
const db = require('./src/config/db');
const webRoutes = require('./src/routes/webRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const { setupGameSockets } = require('./src/sockets/gameServer');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Server
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup EJS Template Engine with Master Layout
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('layout', 'layouts/main');

// Serve Static Assets & CSS/JS from public/
app.use(express.static(path.join(__dirname, 'public')));

// Health Check for Hostinger Container Proxies
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/healthz', (req, res) => res.status(200).send('OK'));

// Mount Routes
app.use('/', webRoutes);
app.use('/admin', (req, res, next) => {
  // Use admin master layout for admin routes
  res.locals.layout = 'layouts/admin';
  next();
}, adminRoutes);
app.use('/api', apiRoutes);

// Setup Real-Time Socket.IO 1v1 Engine
setupGameSockets(io);

// Global Error Handler (Prevents 503 crash)
app.use((err, req, res, next) => {
  console.error('[EXPRESS ERROR HANDLER]', err.stack || err.message);
  if (!res.headersSent) {
    res.status(500).render('player/home', {
      title: 'Ludo Tournament King — 1v1 Real Cash Gaming',
      user: { id: 1, name: 'Player_Guest' },
      wallet: { deposit_balance: 0, winning_balance: 0 },
      openBattles: [],
      activeNav: 'home'
    });
  }
});

// 404 Fallback
app.use((req, res) => {
  res.redirect('/');
});

// Start Full-Stack Server on 0.0.0.0
const PORT = process.env.PORT || config.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, async () => {
  console.log(`========================================================`);
  console.log(`👑 LUDO BET - ENTERPRISE FULL-STACK NODE.JS MVC PLATFORM`);
  console.log(`🚀 Listening on: http://${HOST}:${PORT}`);
  console.log(`========================================================`);

  try {
    const isOk = await db.testConnection();
    if (isOk) {
      const { runMigrations } = require('./src/database/migrate');
      const { runSeeds } = require('./src/database/seed');
      await runMigrations();
      await runSeeds();
    }
  } catch (err) {
    console.warn('[DB AUTO-SETUP WARNING]', err.message);
  }
});

module.exports = { app, server, io };
