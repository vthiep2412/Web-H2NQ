const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');
const auth = require('../middleware/auth');

router.get('/', messagesController.getMessages);
router.post('/', auth, (req, res, next) => {
    console.log('User tier for message sending:', req.user.tier);
    if (req.user.tier === 'free') {
        return res.status(403).json({ msg: 'Free tier users cannot send messages.' });
    }
    messagesController.sendMessage(req, res, next);
});

module.exports = router;
