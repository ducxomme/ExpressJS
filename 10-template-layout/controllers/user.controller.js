const db = require("../db");
const shortid = require("shortid");

module.exports.index = (req, res) => {
  let users = db.get("users").value();
  res.render("users/index", {
    users: db.get("users").value(),
  });
};

module.exports.create = (req, res) => {
  res.render("users/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("users").push(req.body).write();
  res.redirect("/users");
};

module.exports.get = (req, res) => {
  res.render("users/view", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
};

module.exports.update = (req, res) => {
  res.render("users/update", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
};

module.exports.postUpdate = (req, res) => {
  db.get("users")
    .find({ id: req.body.id })
    .assign({ name: req.body.name })
    .write();
  res.redirect("/users");
};

module.exports.delete = (req, res) => {
  db.get("users").remove({ id: req.params.id }).write();
  res.redirect("/users");
};
