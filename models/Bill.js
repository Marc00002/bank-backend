const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  email: { type: String, required: true }, // to identify the user
  biller: { type: String, required: true },
  account: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);
