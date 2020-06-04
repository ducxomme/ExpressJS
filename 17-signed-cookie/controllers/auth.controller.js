const bcrypt = require("bcrypt");
const db = require("../db");

module.exports.login = (req, res) => {
  res.render("auth/login", {
    users: db.get("users").value(),
  });
};

module.exports.postLogin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.render("auth/login", {
      errors: ["The fill is required"],
      values: req.body,
    });
    return;
  }
  let user = db.get("users").find({ email: req.body.email }).value();
  if (!user) {
    res.render("auth/login", {
      errors: ["User does not exist"],
      values: req.body,
    });
    return;
  }

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (!result) {
       if (user.wrongLoginCount >= 4) {
         res.render("auth/login", {
            errors: ["Too much wrong! User have been blocked!"]
          });
          return;
       } else {
          db.get('users').find({email: user.email}).assign({wrongLoginCount: user.wrongLoginCount + 1}).write();
          res.render("auth/login", {
            errors: ["Password is wrong"],
            values: req.body,
          });
       }
    } else {
      res.cookie("userId", user.id, {signed: true});
      res.redirect("/");
    }
  });
};
