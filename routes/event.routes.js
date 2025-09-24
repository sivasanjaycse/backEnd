const express = require('express');
const router = express.Router();
const { getAllEvents, createEvent } = require('../controllers/event.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/').get(protect, getAllEvents).post(protect, admin, createEvent);

module.exports = router;