const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');

router.get('/', messagesController.getMessages);
router.post('/', messagesController.sendMessage);

module.exports = router;
