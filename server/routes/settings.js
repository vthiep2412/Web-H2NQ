// Happy coding :D!
// Happy coding :D
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/settings
// @desc    Update user settings
// @access  Private
router.post('/', auth, async (req, res) => {
  const { temperature, thinking } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Validate temperature
    if (temperature !== undefined) {
      if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
        return res.status(400).json({ msg: 'Temperature must be a number between 0 and 2' });
      }
      user.settings.temperature = temperature;
    }

    // Validate thinking
    if (thinking !== undefined) {
      if (typeof thinking !== 'boolean') {
        return res.status(400).json({ msg: 'Thinking must be a boolean value' });
      }
      user.settings.thinking = thinking;
    }

    await user.save();
    res.json({ msg: 'Settings updated successfully', user: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;