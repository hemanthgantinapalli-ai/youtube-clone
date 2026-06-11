import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

/**
 * Generate a JWT token for a user.
 * @param {Object} payload - { userId, username, email }
 * @returns {string} Signed JWT token valid for 7 days
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * POST /api/auth/register
 * Validate input, create user, return success message.
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- Validation ---
    if (!username || username.trim().length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    if (/\s/.test(username))
      return res.status(400).json({ message: 'Username must not contain spaces' });
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: 'Please enter a valid email' });
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // --- Check duplicates ---
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase())
        return res.status(400).json({ message: 'Email already in use' });
      return res.status(400).json({ message: 'Username already taken' });
    }

    // --- Create user ---
    const user = await User.create({
      userId: uuidv4(),
      username: username.trim(),
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * POST /api/auth/login
 * Verify credentials, return JWT token + user info.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken({ userId: user.userId, username: user.username, email: user.email });

    res.json({
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channels: user.channels,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * GET /api/auth/me
 * Protected route — returns current user profile.
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
