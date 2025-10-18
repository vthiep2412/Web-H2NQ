const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/users');

// @route   PUT api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, userController.updateSettings);

module.exports = router;
