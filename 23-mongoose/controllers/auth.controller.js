require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../db");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require("../models/user");

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.render("auth/login", {
      errors: ["The fill is required"],
      values: req.body,
    });
    return;
  }
  // let user = db.get("users").find({ email: req.body.email }).value();
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (!result) {
          if (user.wrongLoginCount >= 4) {
            res.render("auth/login", {
              errors: ["Too much wrong! User have been blocked!"],
              values: req.body,
              emailReset: true,
            });
            return;
          } else {
            db.get("users")
              .find({ email: user.email })
              .assign({ wrongLoginCount: user.wrongLoginCount + 1 })
              .write();
            res.render("auth/login", {
              errors: ["Password is wrong"],
              values: req.body,
            });
            return;
          }
        } else {
          res.cookie("userId", user.id, { signed: true });
          res.redirect("/");
        }
      });
    })
    .catch((e) => {
      console.log("Error in post Login, ", e);
      res.render("auth/login", {
        errors: ["User does not exist"],
        values: req.body,
      });
      return;
    });
};

module.exports.resetPass = (req, res) => {
  db.get("users").find({ email: req.body.email }).assign({
    password: "$2b$10$lzXwlYLvR5lXnQOnQO7VUeAd14oeRDIIRB9gXc4K1kmTMrpeWMCVy",
    wrongLoginCount: 0,
  }).write;

  let user = db.get("users").find({ email: req.body.email }).value();
  let toEmail = user.email;
  console.log(user, " and Email: ", toEmail);

  sgMail
    .send({
      to: toEmail,
      from: "ducxomme@gmail.com",
      subject: `Reset password for ${toEmail}`,
      text: "Your new password: asdasdasd",
    })
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch((e) => {
      res.render("auth/error");
    });
};
