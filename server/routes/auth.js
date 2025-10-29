// Happy coding :D!
// Happy coding :D
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { rateLimit } = require('express-rate-limit');
const LRUCache = require('lru-cache');

const User = require('../models/User');
const Workspace = require('../models/Workspace');

// Rate limiter for registration
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per hour from an IP
});

// Manual rate limiting for login
const failedAttempts = new LRUCache({
  max: 1000,
  ttl: 20 * 60 * 1000, // 20 minutes
});

const blockedIps = new LRUCache({ max: 500 });

const MAX_FAILED_ATTEMPTS = 10;

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  authLimiter,
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
      let existingUser = await User.findOne({ $or: [{ email }, { name }] });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ msg: 'User with this email already exists' });
        }
        if (existingUser.name === name) {
          return res.status(400).json({ msg: 'This username is already taken' });
        }
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

      const existingWorkspace = await Workspace.findOne({ userId: user.id, name: 'Your workspace' });

      if (!existingWorkspace) {
        const newWorkspace = new Workspace({
          userId: user.id,
          name: 'Your workspace',
        });
        await newWorkspace.save();
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
      res.status(500).json({ msg: 'Server error' });
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
    const ip = req.ip;
    const blockedUntil = blockedIps.get(ip);

    if (blockedUntil && blockedUntil > Date.now()) {
      const timeLeft = Math.ceil((blockedUntil - Date.now()) / 1000);
      return res.status(429).json({
        msg: `Too many failed login attempts. You are blocked.`,
        timeLeft: timeLeft,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
      let user;
      if (login.includes('@')) {
        user = await User.findOne({ email: login });
      } else {
        user = await User.findOne({ name: login });
      }

      const isMatch = user ? await bcrypt.compare(password, user.password) : false;

      if (!isMatch) {
        const currentAttempts = (failedAttempts.get(ip) || 0) + 1;
        failedAttempts.set(ip, currentAttempts);

        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
          const blockDuration = 20 * 60 * 1000; // 20 minutes
          blockedIps.set(ip, Date.now() + blockDuration, blockDuration);
          const timeLeft = Math.ceil(blockDuration / 1000);
          return res.status(429).json({
            msg: `Too many failed login attempts. You are blocked.`,
            timeLeft: timeLeft,
          });
        }

        const remaining = MAX_FAILED_ATTEMPTS - currentAttempts;
        return res.status(400).json({
          msg: `Wrong email/username or password. ${remaining} attempts remaining.`,
        });
      }

      // On success, reset the counters
      failedAttempts.del(ip);
      blockedIps.del(ip);

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
      res.status(500).json({ msg: 'Server error' });
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
    res.status(500).json({ msg: 'Server Error' });
  }
});

