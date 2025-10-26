const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/users');

// @route   PUT api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, userController.updateSettings);

// @route   POST api/users/avatar/signature
// @desc    Get Cloudinary signature for avatar upload
// @access  Private
router.post('/avatar/signature', auth, userController.getCloudinarySignature);

// @route   PUT api/users/avatar
// @desc    Update user avatar
// @access  Private
router.put('/avatar', auth, userController.updateAvatar);

module.exports = router;
