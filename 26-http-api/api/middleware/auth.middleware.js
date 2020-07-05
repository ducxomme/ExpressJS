require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch(error) {
    return res.status(401).json({
      error: 'Auth failed'
    })
  }
  // if (!req.signedCookies.userId) {
  //   res.redirect("/auth/login");
  //   return;
  // }
  // User.findOne({
  //   _id: req.signedCookies.userId,
  // })
  //   .then((user) => {
  //     res.locals.user = user;
  //     next();
  //   })
  //   .catch((e) => {
  //     res.redirect("/auth/login");
  //     return;
  //   });
};
