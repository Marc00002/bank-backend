const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  balance:  { type: Number, default: 100000 },
  expenses: { type: Number, default: 0 },
  savings:  { type: Number, default: 20000 },           

});

module.exports = mongoose.model('User', userSchema);
