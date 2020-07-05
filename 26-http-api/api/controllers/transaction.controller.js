const mongoose = require("mongoose");
const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const Book = require("../../models/book");

module.exports.index = (req, res) => {
  Transaction.find({
    userId: req.userData.userId,
  })
    .then((transactions) => {
      res.status(200).json({
        count: transactions.length,
        transactions: transactions,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
};

module.exports.postCreate = (req, res) => {
  const transaction = new Transaction({
    _id: mongoose.Types.ObjectId(),
    userId: req.body.userId,
    bookId: req.body.bookId,
    isComplete: false,
  });
  transaction
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Create Transaction successfully",
        transaction: result,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
};

module.exports.complete = (req, res) => {
  Transaction.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        isComplete: true,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        message: "Complete transaction successfully",
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
};
