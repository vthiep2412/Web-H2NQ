// Happy coding :D

const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  title: {
    type: String,
    default: 'New Chat',
  },
  messages: [
    {
      role: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      model: {
        type: String,
      },
      thinkingTime: {
        type: Number,
      },
      thoughts: {
        type: [mongoose.Schema.Types.Mixed],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { minimize: false });

module.exports = mongoose.model('Conversation', ConversationSchema);
