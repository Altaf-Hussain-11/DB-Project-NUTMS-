/**
 * auth.routes.js
 * ==============
 * Login and profile management.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { callProc, callProcSingle } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const rows = await callProcSingle('sp_GetUserByEmail', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Sample/seed users have placeholder hashes (not real bcrypt hashes).
    // Support both: real bcrypt hashes, and a dev fallback where password === 'password'.
  let passwordMatches = false;
const isRealHash = user.Password_Hash.startsWith('$2') && 
                   user.Password_Hash.length > 30 &&
                   !user.Password_Hash.includes('HashedPw');

if (isRealHash) {
  passwordMatches = await bcrypt.compare(password, user.Password_Hash);
} else {
  passwordMatches = password === 'password';
}

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        userId: user.User_ID,
        role: user.role_id,
        fullName: user.Full_Name,
        email: user.Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      user: {
        userId: user.User_ID,
        fullName: user.Full_Name,
        email: user.Email,
        role: user.role_id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * GET /api/auth/profile
 * Returns the full profile (role-specific fields included) for the logged-in user.
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const rows = await callProcSingle('sp_GetUserProfile', [req.user.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

/**
 * PUT /api/auth/profile
 * body: { fullName, email }
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'fullName and email are required' });
    }
    await callProc('sp_UpdateProfile', [req.user.userId, fullName, email]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

/**
 * PUT /api/auth/password
 * body: { newPassword }
 */
router.put('/password', authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await callProc('sp_ChangePassword', [req.user.userId, hash]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error changing password' });
  }
});

module.exports = router;
