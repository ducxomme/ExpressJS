const express = require("express");
const router = express.Router();

const shortid = require("shortid");

const db = require("../db");

// =========================USER=====================

router.get("/", (req, res) => {
  let users = db.get("users").value();
  console.log("users", users);
  res.render("users/index", {
    users: db.get("users").value(),
  });
});

router.get("/create", (req, res) => {
  res.render("users/create");
});

router.post("/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("users").push(req.body).write();
  res.redirect("/users");
});

router.get("/:id", (req, res) => {
  console.log("user", db.get("users").find({ id: req.params.id }).value());
  res.render("users/view", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
});

router.get("/:id/update", (req, res) => {
  res.render("users/update", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
});

router.post("/update", (req, res) => {
  console.log("body", req.body);
  db.get("users")
    .find({ id: req.body.id })
    .assign({ name: req.body.name })
    .write();

  res.redirect("/users");
});

router.get('/:id/delete', (req, res) => {
  db.get('users')
    .remove({id: req.params.id})
    .write();
  res.redirect('/users');
})

module.exports = router;
