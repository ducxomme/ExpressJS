const mongoose = require("mongoose");
const db = require("../db");
const Session = require("../models/session");

module.exports.cartCount = (req, res, next) => {
  let sessionId = req.signedCookies.sessionId;
  let cartCount = 0;
  if (sessionId) {
    Session.findOne({
      _id: sessionId,
    }).then((sess) => {
      console.log("sess", sess._doc);
      if (sess._doc.cart) {
        cartCount = Object.keys(sess._doc.cart).length;
      }
      res.locals.cartCount = cartCount;
    })
    .catch(err => {
      console.log('err ', err)
    });
  }
  next();
}; 