const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const User = require('../models/User');
const Transaction = require('../models/transaction'); 

// POST /api/bills/pay
router.post('/pay-bill', async (req, res) => {
  const { email, amount, biller, account } = req.body;  // ✅ Extract first

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const description = `${biller.charAt(0).toUpperCase() + biller.slice(1)} Bill`;

    const newTransaction = new Transaction({
      description,
      amount,
      type: 'expense',
      sender: user._id,
      receiver: user._id,
      senderBalanceBefore: user.balance,
      senderBalanceAfter: user.balance - amount,
      receiverBalanceBefore: user.balance,
      receiverBalanceAfter: user.balance - amount
    });

    user.balance -= amount;
    user.expenses += amount;

    await user.save();
    await newTransaction.save();

    const bill = new Bill({ email, biller, account, amount }); // ✅ Now they're defined
    await bill.save();

    res.status(200).json({ message: 'Bill paid and transaction saved successfully', transaction: newTransaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
