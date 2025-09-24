const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Proprietorship', 'Partnership', 'Private Limited'], required: true },
  description: { type: String },
  fundsRaised: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profilePicture: { type: String }, // Base64 string
  course: { type: String, required: true },
  stream: { type: String, enum: ['Engineering', 'Arts', 'Management'], required: true },
  collegeCode: { type: String, required: true },
  collegeName: { type: String, required: true },
  district: { type: String, required: true },
  hasCompany: { type: Boolean, default: false },
  company: CompanySchema,
  teamIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    const userCount = await mongoose.model('User', UserSchema).countDocuments();
    this.userId = 'CED' + String(userCount + 1).padStart(4, '0');
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);