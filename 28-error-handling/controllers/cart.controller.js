const mongoose = require("mongoose");
const Session = require("../models/session");
const Book = require("../models/book");
const Transaction = require("../models/transaction");

module.exports.addToCart = (req, res, next) => {
  let bookId = req.params.bookId;
  let sessionId = req.signedCookies.sessionId;

  if (!sessionId) {
    res.redirect("/books");
    return;
  }

  Session.findOne({
    _id: sessionId,
  })
    .then((sess) => {
      if (!sess._doc.cart.bookId) {
        // Create default cart
        Session.updateOne(
          {
            _id: sess._doc._id,
          },
          {
            $set: {
              cart: {
                [bookId]: 1,
              },
            },
          }
        ).then((result) => {
          console.log(result);
        });
      } else {
        // Add cart count
        Session.updateOne(
          {
            _id: sess._doc._id,
          },
          {
            $set: {
              cart: {
                [bookId]: sess._doc.cart.bookId + 1,
              },
            },
          }
        );
      }
      res.redirect("/books");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.checkout = (req, res, next) => {
  let cartCount = res.locals.cartCount;

  Session.findOne({
    _id: req.signedCookies.sessionId,
  }).then((session) => {
    let bookIdList = session.cart;

    let bookNameList = [];
    for (let item in bookIdList) {

      Book.findOne({
        _id: item,
      })
        .then((book) => {
          console.log("book find success");
          bookNameList.push({
            title: book.title,
            imageUrl: book.imageUrl,
            quality: bookIdList[item],
          });

          res.render("cart/checkout", {
            cartCount: cartCount,
            bookNameList: bookNameList,
          });
        })
        .catch((err) => {
          console.log("error in checkout, ", err);
        });
    }
  });
};

module.exports.postCheckout = (req, res, next) => {
  let userId = req.signedCookies.userId;

  Session.findOne({
    _id: req.signedCookies.sessionId,
  })
    .then((session) => {
      let bookIdList = session.cart;

      for (let bookId in bookIdList) {
        let transaction = new Transaction({
          _id: mongoose.Types.ObjectId(),
          userId: userId,
          bookId: bookId,
          isComplete: false,
        });

        transaction.save().then((result) => {
          console.log("saved transaction ", result);
        });
      }

      res.locals.cartCount = 0;

      Session.updateOne(
        {
          _id: req.signedCookies.sessionId,
        },
        {
          $set: {
            cart: {},
          },
        }
      ).then((result) => {
        console.log("unset session cart ok");
      });
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("error in postCheckout", err);
    });
};
