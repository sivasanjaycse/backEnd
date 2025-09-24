const express = require('express');
const router = express.Router();
const { getMyProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/profile', protect, getMyProfile);

module.exports = router;