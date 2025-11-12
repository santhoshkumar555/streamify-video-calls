const mongoose = require('mongoose');

const RecordingSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  s3Key: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number },
  durationSeconds: { type: Number }, // optional, if you measure duration on client
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recording', RecordingSchema);
