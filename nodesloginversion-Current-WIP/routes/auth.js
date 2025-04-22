// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/signup – Create a new user account
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    
    // Create a new user (password is hashed automatically in the User model)
    const user = await User.create({ email, password });
    
    // Generate a JWT for authentication (expires in 1 hour)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.status(201).json({ message: 'User created successfully.', token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during signup.', details: error.message });
  }
});

// POST /api/auth/login – Authenticate an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    // Compare candidate password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    // Generate a token on successful login
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.json({ message: 'Login successful.', token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during login.', details: error.message });
  }
});

module.exports = router;
