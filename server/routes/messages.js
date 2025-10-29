// Happy coding :D
const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');
const auth = require('../middleware/auth');

router.get('/', messagesController.getMessages);
router.post('/', auth, messagesController.sendMessage);

module.exports = router;
