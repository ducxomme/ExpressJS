const mongoose = require("mongoose");
const Session = require("../../models/session");
const Book = require("../../models/book");
const Transaction = require("../../models/transaction");

module.exports.addToCart = (req, res, next) => {
  let bookId = req.params.bookId;
  Session.findOne({
    _id: req.body.sessionId,
  })
    .then((sess) => {
      if (!sess.cart.hasOwnProperty(bookId)) {
        // Create default cart
        console.log('here')
        Session.updateOne(
          {
            _id: sess._id,
          },
          {
            $set: {
              cart: {
                [bookId]: 1,
              },
            },
          }
        ).then((result) => {
          res.status(200).json({
            message: "Update cart successfully",
            book: result,
          });
        })
        .catch((err) => {
          res.status(404).json({
            error: err,
          });
        });;
      } else {
        // Add cart count
        Session.updateOne(
          {
            _id: sess._id,
          },
          {
            $set: {
              cart: {
                [bookId]: sess.cart[bookId] + 1,
              },
            },
          }
        )
        .then(result => {
          res.status(200).json({
            message: "Update cart successfully",
            book: result,
          });
        })
        .catch((err) => {
          res.status(404).json({
            error: err,
          });
        });;
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
};

module.exports.postCheckout = (req, res, next) => {
  // let userId = req.signedCookies.userId;

  Session.findOne({
    _id: req.body.sessionId,
  })
    .then((session) => {
      let bookIdList = session.cart;

      for (let bookId in bookIdList) {
        let transaction = new Transaction({
          _id: mongoose.Types.ObjectId(),
          userId: req.userData.userId,
          bookId: bookId,
          isComplete: false,
        });

        transaction.save().then((result) => {
          console.log("saved transaction ", result);
          Session.updateOne(
            {
              _id: req.body.sessionId
            },
            {
              $set: {
                cart: {},
              },
            }
          ).then((result) => {
            console.log("unset session cart ok");
            res.status(200).json({
              message: 'Save transactions successfully'
            })
          });
        });
      }
      // res.locals.cartCount = 0;
    })
    .catch((err) => {
      console.log("error in postCheckout", err);
      res.status(500).json({
        error: err,
      });
    });
};
