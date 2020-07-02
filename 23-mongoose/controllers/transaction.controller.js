const mongoose = require('mongoose');
const User = require("../models/user");
const Transaction = require("../models/transaction");
const Book = require('../models/book');

module.exports.index = (req, res) => {
  Transaction.find({
    userId: req.signedCookies.userId,
  })
    .then((transactions) => {
      console.log("transactions", transactions);
      res.render("transactions/index", {
        transactions: transactions
      });
    })
    .catch((err) => {
      console.log("error in transaction index: ", err);
    });
};

module.exports.create = (req, res) => {
  User.find()
  .then(users => {
    Book.find()
    .then(books => {
      res.render("transactions/create", {
        users: users,
        books: books,
      });
    })
  })
};

module.exports.postCreate = (req, res) => {
  const transaction = new Transaction({
    _id: mongoose.Types.ObjectId(),
    userId: req.body.userId,
    bookId: req.body.bookId,
    isComplete: false
  })
  transaction.save()
  .then(result =>{
    console.log('saved transaction ', result);
    res.redirect("/transactions");
  })
  .catch(err => {
    console.log('error in postCreate transaction: ', err);
  });
};

module.exports.complete = (req, res) => {
  Transaction.updateOne({
    _id: req.params.id
  }, {
    $set: {
      isComplete: true
    }
  })
  .then(result =>{
    console.log('updated transaction ', result);
    res.redirect("/transactions");
  })
  .catch(err => {
    console.log('error in updated transaction: ', err);
  });
};
