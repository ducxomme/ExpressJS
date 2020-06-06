const db = require("../db");
const shortid = require("shortid");

module.exports.index = (req, res) => {
  let perPage = 10;
  let allUsers = db.get('users').value();
  let maxPage = Math.ceil(allUsers.length/perPage);

  let page = parseInt(req.query.page) || 1;

  if (page > maxPage) {
    page = maxPage;
  } else if (page < 1) {
    page = 1;
  }

  let drop = (page - 1) * perPage;
  let users = db.get('users').drop(drop).take(perPage).value();

  res.render("users/index", {
    users: users,
    page: page,
    first: drop,
    maxPage: maxPage
  });
};

module.exports.create = (req, res) => {
  console.log(req.cookies);
  res.render("users/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("users").push(req.body).write();
  res.redirect("/users");
};

module.exports.get = (req, res) => {
  let user = db.get("users").find({ id: req.params.id }).value();
  if (user) {
    res.render("users/view", {
      user: user,
    });
  }
};

module.exports.update = (req, res) => {
  res.render("users/update", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
};

module.exports.postUpdate = (req, res) => {
  console.log(res.locals);
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
