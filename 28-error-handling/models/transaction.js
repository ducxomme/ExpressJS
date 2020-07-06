const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  bookId: mongoose.Schema.Types.ObjectId,
  isComplete: Boolean 
});

module.exports = mongoose.model('Transaction', transactionSchema);