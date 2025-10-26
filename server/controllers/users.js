const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

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
