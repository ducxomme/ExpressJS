const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cart: Object
});

module.exports = mongoose.model('Session', sessionSchema);