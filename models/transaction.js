const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderBalanceBefore: Number,
  senderBalanceAfter: Number,
  receiverBalanceBefore: Number,
  receiverBalanceAfter: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
