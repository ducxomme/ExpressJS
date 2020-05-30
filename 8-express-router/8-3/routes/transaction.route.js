const express = require("express");
const router = express.Router();

const shortid = require("shortid");

const db = require("../db");

// =========================USER=====================

router.get("/", (req, res) => {
  let transactions = db.get('transactions').value();
  res.render("transactions/index", {
    transactions: transactions,
  });
});

router.get("/create", (req, res) => {
  let users = db.get('users').value();
  let books = db.get('books').value();
  console.log('books', books)
  res.render("transactions/create", {
    users: users,
    books: books
  });
});

router.post("/create", (req, res) => {
  console.log(req.body);
  req.body.id = shortid.generate();
  db.get("transactions").push(req.body).write();
  res.redirect("/transactions");
});

module.exports = router;
