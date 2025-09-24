const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, adminLogin } = require('../controllers/auth.controller');
const { check } = require('express-validator');

router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  // ... other validations are now handled in the controller as they can be optional
], register);

router.post('/verify-otp', [
  check('temp_userId', 'User identifier is required').not().isEmpty(),
  check('otp', 'OTP is required').isLength({ min: 6, max: 6 }),
], verifyOtp);

router.post('/login', [
  check('loginId', 'Login ID (Email or User ID) is required').not().isEmpty(),
  check('password', 'Password is required').exists(),
], login);
router.post('/admin-access', adminLogin);

module.exports = router; // Make sure to export router if it was missing