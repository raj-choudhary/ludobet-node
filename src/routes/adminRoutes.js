const express = require('express');
const path = require('path');
const router = express.Router();
const AdminController = require('../controllers/adminController');

router.get('/login', AdminController.renderLogin);
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/index.html')));
router.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/index.html')));
router.get('/players', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/players.html')));
router.get('/finance', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/finance.html')));
router.get('/kyc', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/kyc.html')));
router.get('/emergency', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/emergency.html')));
router.get('/settings', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/settings.html')));
router.get('/tournaments', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/tournaments.html')));
router.get('/battles', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/battles.html')));
router.get('/support', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/support.html')));
router.get('/security', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/security.html')));
router.get('/employees', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/employees.html')));
router.get('/audit-logs', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin/audit-logs.html')));

module.exports = router;
