
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Workspace = require('../models/Workspace');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Please add username').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, avatarUrl } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
        avatarUrl: avatarUrl || undefined, // Use provided avatarUrl or let schema default
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const newWorkspace = new Workspace({
        userId: user.id,
        name: 'Your workspace',
      });

      await newWorkspace.save();

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tier: user.tier,
          avatarUrl: user.avatarUrl,
          tokenLeft: user.tokenLeft,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post(
  '/login',
  [
    check('login', 'Please enter your username or email').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
      let user;
      // Check if login is an email or username
      if (login.includes('@')) {
        user = await User.findOne({ email: login });
      } else {
        user = await User.findOne({ name: login });
      }

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tier: user.tier,
          avatarUrl: user.avatarUrl,
          tokenLeft: user.tokenLeft,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

const auth = require('../middleware/auth'); // Import auth middleware

// @route   GET api/auth/me
// @desc    Get authenticated user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is already populated by the auth middleware with the latest user data from DB
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
