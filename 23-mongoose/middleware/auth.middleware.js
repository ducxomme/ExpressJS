const db = require('../db');
const User = require('../models/user');

module.exports.auth = (req, res, next) => {
   if (!req.signedCookies.userId) {
      res.redirect('/auth/login');
      return;
   }
  User.findOne({
    _id: req.signedCookies.userId
  }).then(user => {
    res.locals.user = user;
    next();
  })
  .catch(e => {
    res.redirect('/auth/login');
    return;
  })
};