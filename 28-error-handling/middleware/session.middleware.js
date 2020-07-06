const Session = require("../models/session");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    const session = new Session({
      _id: new mongoose.Types.ObjectId(),
    });
    session
      .save()
      .then((sess) => {
        console.log("session: ", sess);
        res.cookie("sessionId", sess._id, { signed: true });
      })
      .catch((err) => {
        console.log("error in session: ", err);
      });
  }
  next();
};
