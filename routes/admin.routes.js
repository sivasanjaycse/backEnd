const express = require('express');
const router = express.Router();
const { getDashboardStats, getUserProfile } = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/user/:id', protect, admin, getUserProfile); // New route

module.exports = router;