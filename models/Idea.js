const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema({
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

const IdeaSchema = new mongoose.Schema({
  ideaId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  
  // New Merged/Added Fields
  supportNeeded: { type: String, required: true },
  category: { type: String, required: true },
  categoryOther: { type: String },
  proposalFilePath: { type: String },
  trlLevel: { type: Number, min: 1, max: 7, required: true },
  isWomanLed: { type: Boolean, default: false },
  hasWomanInTeam: { type: Boolean, default: false },
  isFromTier2or3: { type: Boolean, default: false },
  productLink: { type: String },
  
  isTeam: { type: Boolean, default: false },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  adminActions: [AdminActionSchema],
}, { timestamps: true });

IdeaSchema.pre('save', async function(next) {
  if (this.isNew) {
    const ideaCount = await mongoose.model('Idea', IdeaSchema).countDocuments();
    this.ideaId = 'IDEA' + String(ideaCount + 1).padStart(5, '0');
  }
  next();
});

module.exports = mongoose.model('Idea', IdeaSchema);