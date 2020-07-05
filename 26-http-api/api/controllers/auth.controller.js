require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require("../../models/user");
const SALT = 10;

module.exports.postLogin = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        bcrypt.compare(req.body.password, user.password, function (
          err,
          result
        ) {
          if (!result) {
            if (user.wrongLoginCount >= 4) {
              res.status(403).json({
                error: 'Too much wrong! User have been blocked!'
              })
            } else {
              User.updateOne({
                email: user.email
              }, {
                $set: {
                  wrongLoginCount: user.wrongLoginCount + 1
                }
              })
              .then(res.status(401).json({
                errors: "Auth failed"
              }))
            }
          } else {
            const token = jwt.sign(
            {
              userId: user._id,
              email: user.email
            }, process.env.JWT_KEY, 
            {
              expiresIn: '2h'
            })

            res.status(200).json({
              token: token,
              message: 'Auth successful'
            })
          }
        });
      })
      .catch((e) => {
        console.log("Error in post Login, ", e);
        res.status(401).json({
          error: "Auth failed"
        })
      });
  } else {
    res.status(400).json({
      error: 'Can not understand the request due to invalid syntax'
    })
  }
};

module.exports.signUp = (req, res, next) => {
  User.find({
    email: req.body.email,
  }).then((user) => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Email have existed",
      });
    } else {
      bcrypt.hash(req.body.password, SALT, (err, hashedPass) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hashedPass,
            wrongLoginCount: 0,
            isAdmin: false,
          });

          user
            .save()
            .then((result) => {
              console.log("Created user successful: ", result);
              res.status(201).json({
                message: "Created user successful",
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: "Created user unsuccessfully " + err,
              });
            });
        }
      });
    }
  });
};

// module.exports.resetPass = (req, res) => {
//   db.get("users").find({ email: req.body.email }).assign({
//     password: "$2b$10$lzXwlYLvR5lXnQOnQO7VUeAd14oeRDIIRB9gXc4K1kmTMrpeWMCVy",
//     wrongLoginCount: 0,
//   }).write;

//   let user = db.get("users").find({ email: req.body.email }).value();
//   let toEmail = user.email;
//   console.log(user, " and Email: ", toEmail);

//   sgMail
//     .send({
//       to: toEmail,
//       from: "ducxomme@gmail.com",
//       subject: `Reset password for ${toEmail}`,
//       text: "Your new password: asdasdasd",
//     })
//     .then(() => {
//       res.redirect("/auth/login");
//     })
//     .catch((e) => {
//       res.render("auth/error");
//     });
// };
