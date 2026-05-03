const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'text', 'image'], required: true },
  extractedText: { type: String, default: '' },
  imageBase64: { type: String }, // for images
  imageMimeType: { type: String },
  summary: {
    short: String,
    detailed: String,
    keyPoints: [String]
  },
  flashcards: [{
    id: Number,
    front: String,
    back: String,
    topic: String
  }],
  quiz: [{
    id: Number,
    type: { type: String, enum: ['mcq', 'short'] },
    question: String,
    options: [String],
    answer: String,
    explanation: String
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  size: Number
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
