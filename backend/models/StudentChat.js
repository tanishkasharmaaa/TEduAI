const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const studentChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema]
});

module.exports = mongoose.model('StudentChat', studentChatSchema);
