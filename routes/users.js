const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Transaction = require('../models/transaction');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phone, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save all user details
    const user = new User({
      fullname,
      email,
      phone,
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST /api/users/login
// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




// routes/user.js
router.get('/dashboard/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recentTransactions = await Transaction.find({ sender: user._id })
      .sort({ date: -1 })
      .limit(3);

    res.json({
      fullname: user.fullname,
      balance: user.balance,
      savings: user.savings || 0,
      expenses: user.expenses || 0,
      transactions: recentTransactions
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
