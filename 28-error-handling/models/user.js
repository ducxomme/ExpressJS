const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  isAdmin: Boolean,
  name: String,
  email: String,
  password: String,
  wrongLoginCount: Number,
  avatarUrl: String
});

module.exports = mongoose.model('User', userSchema);