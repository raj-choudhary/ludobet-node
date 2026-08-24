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

// 404 Fallback
app.use((req, res) => {
  res.redirect('/');
});

// Start Full-Stack Server
server.listen(config.PORT, async () => {
  console.log(`========================================================`);
  console.log(`👑 LUDO BET - ENTERPRISE FULL-STACK NODE.JS MVC PLATFORM`);
  console.log(`🚀 Player App:    http://localhost:${config.PORT}/`);
  console.log(`💰 Luxury Wallet: http://localhost:${config.PORT}/wallet`);
  console.log(`⚔️ 1v1 Classic:   http://localhost:${config.PORT}/ludo-classic`);
  console.log(`🛡️ Admin Console: http://localhost:${config.PORT}/admin/login`);
  console.log(`========================================================`);

  await db.testConnection();
});

module.exports = { app, server, io };
