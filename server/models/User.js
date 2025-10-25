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
  date: {
    type: Date,
    default: Date.now,
  },
  tier: {
    type: String,
    default: 'free',
  },
  avatarUrl: {
    type: String,
    default: '', // Default to empty string
  },
  tokenLeft: {
    type: Number,
    default: 1000,
  },
  settings: {
    theme: { type: String, default: 'dark' },
    primaryColor: { type: String, default: '#007bff' },
    gradientColor1: { type: String, default: '#ff0000' },
    gradientColor2: { type: String, default: '#0000ff' },
    isGradientColor1Enabled: { type: Boolean, default: false },
    isGradientColor2Enabled: { type: Boolean, default: false },
    isGradientAnimated: { type: Boolean, default: false },
    selectedModel: { type: String, default: 'gemini-2.5-flash' },
    selectedBackground: { type: String, default: 'none' },
    language: { type: String, default: 'en' },
    lastActiveWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null },
    darkBackgroundColor: { type: String, default: '#111212' },
    lightBackgroundColor: { type: String, default: '#ffffff' },
    gradientBackgroundColor1: { type: String, default: '#ff0000' },
    gradientBackgroundColor2: { type: String, default: '#0000ff' },
    isGradientBackgroundColor1Enabled: { type: Boolean, default: false },
    isGradientBackgroundColor2Enabled: { type: Boolean, default: false },
    gradientDirection: { type: String, default: 'to bottom' },
  },
});

module.exports = mongoose.model('user', UserSchema);
