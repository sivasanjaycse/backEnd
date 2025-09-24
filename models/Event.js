const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  externalLink: { type: String },
  
  // New Fields
  eventType: { type: String, enum: ['Free', 'Paid'], required: true },
  image: { type: String }, // Base64 string
  audience: { type: String, enum: ['Students', 'Faculty', 'Research Scholars', 'All'], required: true },

}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);