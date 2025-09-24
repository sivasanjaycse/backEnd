const User = require('../models/User');
const Idea = require('../models/Idea');

// @desc    Get user profile with their ideas and support requests
// @route   GET /api/user/profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ===== MODIFIED QUERY =====
    // Find ideas where the user is the submitter OR their ID is in the teamMembers array
    const ideas = await Idea.find({
      $or: [{ user: req.user._id }, { teamMembers: req.user._id }]
    })
    .populate('user', 'userId') // Populate submitter info to display it
    .sort({ createdAt: -1 });
    // ==========================

    res.json({
      user,
      ideas,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};