// Happy coding :D!
// Happy coding :D
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getCloudinarySignature = (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const upload_preset = 'Avartar-Upload';
  const transformation = 'f_auto';

  try {
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        upload_preset: upload_preset,
        transformation: transformation,
      },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({ timestamp, signature, upload_preset, transformation });
  } catch (err) {
    console.error('Error generating Cloudinary signature:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateAvatar = async (req, res) => {
  const { avatarUrl } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If user already has an avatar, delete it from Cloudinary
    if (user.avatarUrl) {
      try {
        const publicId = user.avatarUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Failed to delete old avatar:', err.message);
        // Don't block the update if deletion fails, just log the error
      }
    }

    user.avatarUrl = avatarUrl;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Error updating avatar:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

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

exports.updateUsername = async (req, res) => {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ msg: 'Username is required' });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 3 || trimmedName.length > 30) {
        return res.status(400).json({ msg: 'Username must be between 3 and 30 characters' });
    }

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if username is already taken (if uniqueness is required)
        const existingUser = await User.findOne({ name: trimmedName, _id: { $ne: req.user.id } });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        user.name = trimmedName;

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Input validation
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: 'Both old and new passwords are required' });
    }

    // Password length validation
    if (newPassword.length < 6) {
        return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
    }

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Check if new password is same as old
        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) {
            return res.status(400).json({ msg: 'New password must be different from current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Increment password version to invalidate old sessions
        user.passwordVersion = (user.passwordVersion || 0) + 1;

        await user.save();

        // TODO: Implement email notification
        // For now, just log it
        console.log(`Password changed for user ${user.email}`);

        res.json({ 
            msg: 'Password updated successfully. Please log in again with your new password.',
            requireRelogin: true
        });
    } catch (err) {
        console.error('Password update error:', err.message);
        res.status(500).json({ msg: 'An error occurred while updating the password' });
    }
};
