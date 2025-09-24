const Idea = require('../models/Idea');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const ideaStats = await Idea.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const formatStats = (stats) => stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({ ideas: formatStats(ideaStats) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};