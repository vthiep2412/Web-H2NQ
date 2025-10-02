const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    default: 'free',
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  tokenLeft: {
    type: Number,
    default: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
