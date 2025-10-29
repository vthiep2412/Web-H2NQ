// Happy coding :D!
// Happy coding :D

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');

// Helper to calculate context size (simple character count for now)
const calculateContextSize = (messages) => {
  return messages.reduce((sum, msg) => sum + msg.content.length, 0);
};

// @route   POST api/conversations
// @desc    Save a new conversation
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, messages, workspaceId } = req.body;
  const userId = req.user.id;
  const userTier = req.user.tier;

  try {
    const conversationCount = await Conversation.countDocuments({ userId, workspaceId });
    const maxConversations = userTier === 'free' ? 5 : 10; // 5 for free, 10 for pro/admin

    if (conversationCount >= maxConversations) {
      return res.status(403).json({ msg: `You have reached the maximum of ${maxConversations} conversations for your ${userTier} tier in this workspace.` });
    }

    const contextSize = calculateContextSize(messages);
    const maxContextSize = userTier === 'free' ? 256000 : 1000000;

    if (contextSize > maxContextSize) {
      return res.status(403).json({ msg: `Conversation context exceeds ${maxContextSize / 1000}K character limit for your ${userTier} tier.` });
    }

    const newConversation = new Conversation({
      userId,
      workspaceId,
      title: title || 'New Chat',
      messages,
    });

    const conversation = await newConversation.save();
    res.json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/conversations
// @desc    Get all conversations for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { workspaceId } = req.query;

  if (!workspaceId) {
    return res.json([]);
  }

  try {
    const conversations = await Conversation.find({ userId, workspaceId }).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/conversations/:id
// @desc    Get a single conversation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(400).json({ msg: 'Workspace ID is required' });
    }
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.id, workspaceId });

    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/conversations/:id
// @desc    Delete a conversation by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(400).json({ msg: 'Workspace ID is required' });
    }
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.id, workspaceId });

    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    await conversation.deleteOne();
    res.json({ msg: 'Conversation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
