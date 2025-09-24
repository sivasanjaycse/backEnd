const express = require('express');
const router = express.Router();
const { submitIdea, getAllIdeas, updateIdea } = require('../controllers/idea.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

router.route('/')
  .post(protect, (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      submitIdea(req, res);
    });
  })
  .get(protect, admin, getAllIdeas);
  
router.route('/:id').put(protect, admin, updateIdea);

module.exports = router;