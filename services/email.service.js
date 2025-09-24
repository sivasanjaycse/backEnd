const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP Code for CED Platform',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2>CED Platform Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = { sendOtpEmail };