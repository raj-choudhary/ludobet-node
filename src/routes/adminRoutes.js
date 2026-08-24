const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

router.get('/login', AdminController.renderLogin);
router.get('/', AdminController.renderDashboard);
router.get('/dashboard', AdminController.renderDashboard);
router.get('/finance', AdminController.renderFinance);
router.get('/players', AdminController.renderPlayers);

module.exports = router;
