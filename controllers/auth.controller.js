const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../services/email.service');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.register = async (req, res) => {
  const { 
    email, password, profilePicture, course, stream, 
    collegeCode, collegeName, district, hasCompany, company 
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser = {
      email, password, profilePicture, course, stream,
      collegeCode, collegeName, district, hasCompany,
      otp, otpExpires
    };

    if (hasCompany && company) {
      newUser.company = company;
    }

    const user = new User(newUser);
    await user.save();

   await sendOtpEmail(email, otp);

    res.status(201).json({
      message: 'Registration successful. Please check your email for OTP to verify your account.',
      temp_userId: user._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ... (verifyOtp, login, and adminLogin functions remain the same as before)
exports.verifyOtp = async (req, res) => {
  const { temp_userId, otp } = req.body;
  try {
    const user = await User.findById(temp_userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid request. User not found.' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      await User.findByIdAndDelete(temp_userId);
      return res.status(400).json({ message: 'Invalid or expired OTP. Please register again.' });
    }
    
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(200).json({
      message: 'Account verified successfully. You can now log in.',
      _id: user._id,
      userId: user.userId,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { loginId, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email: loginId }, { userId: loginId }] });

    if (user && (await user.comparePassword(password))) {
      if (user.otp) {
        return res.status(401).json({ message: 'Account not verified. Please complete OTP verification.' });
      }
      res.json({
        _id: user._id,
        userId: user.userId,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    try {
      let adminUser = await User.findOne({ email: 'admin@ced.com' });
      if (!adminUser) {
        // Create a dummy admin user with required fields
        adminUser = new User({
          email: 'admin@ced.com',
          password: 'admin',
          role: 'admin',
          course: 'Admin',
          stream: 'Management',
          collegeCode: 'ADMIN',
          collegeName: 'Admin College',
          district: 'Admin District',
        });
        await adminUser.save();
      }
      res.json({
        _id: adminUser._id,
        userId: adminUser.userId,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser._id),
      });
    } catch (error) {
       res.status(500).json({ message: 'Server error creating admin', error: error.message });
    }
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};






