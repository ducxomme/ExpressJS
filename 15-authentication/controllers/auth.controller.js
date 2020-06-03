const db = require("../db");

module.exports.login = (req, res) => {
  res.render("auth/login", {
    users: db.get("users").value(),
  });
};

module.exports.postLogin = (req, res) => {
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
  } else if (user.password !== req.body.password) {
    res.render("auth/login", {
      errors: ["Password is wrong"],
      values: req.body,
    });
    return;
  }
  res.cookie('userId', user.id);
  res.render("index");
};
