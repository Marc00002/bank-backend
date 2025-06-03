const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const User = require('../models/User');

// POST: Create a transaction between 2 users
router.post('/', async (req, res) => {
  const { description, amount, type, sender, receiver } = req.body;

  try {

        // Validation: check all fields present
    // if (!receiverId || !amount) {
    //   return res.status(400).json({ message: 'All fields are required' });
    // }

    // Validation: cannot send to self
    // if (senderId === receiverId) {
    //   return res.status(400).json({ message: 'Cannot transfer to yourself' });
    // }

    // Validation: amount must be a number and > 0
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Validation: maximum transfer limit
    if (amount > 20000) {
      return res.status(400).json({ message: 'Transfer limit exceeded (max 20,000)' });
    }

    if (sender === receiver) {
      return res.status(400).json({ message: 'Sender and receiver cannot be the same user' });
    }

    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    if (senderUser.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

const senderBalanceBefore = senderUser.balance;
const receiverBalanceBefore = receiverUser.balance;

senderUser.balance -= amount;
receiverUser.balance += amount;

const senderBalanceAfter = senderUser.balance;
const receiverBalanceAfter = receiverUser.balance;

const transaction = new Transaction({
  description,
  amount,
  type: 'transfer',
  sender,
  receiver,
  senderBalanceBefore,
  senderBalanceAfter,
  receiverBalanceBefore,
  receiverBalanceAfter,
  date: new Date()
});


    await transaction.save();
    await senderUser.save();
    await receiverUser.save();

    res.status(201).json({ message: 'Transaction successful', transaction });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Get all transactions
// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('sender', 'fullname')
      .populate('receiver', 'fullname')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load transactions' });
  }
});



router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'fullname')
    .populate('receiver', 'fullname')
    .sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load user transactions' });
  }
});




module.exports = router;
