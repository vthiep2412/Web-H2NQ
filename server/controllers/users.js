const User = require('../models/User');

exports.updateSettings = async (req, res) => {
  const { settings } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user settings
    user.settings = { ...user.settings, ...settings };

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
