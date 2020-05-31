const db = require("../db");
const shortid = require("shortid");

module.exports.index =  (req, res) => {
  let transactions = db.get('transactions').value();
  res.render("transactions/index", {
    transactions: transactions,
  });
};

module.exports.create = (req, res) => {
  let users = db.get('users').value();
  let books = db.get('books').value();
  console.log('books', books)
  res.render("transactions/create", {
    users: users,
    books: books
  });
};

module.exports.postCreate = (req, res) => {
  console.log(req.body);
  req.body.id = shortid.generate();
  db.get("transactions").push(req.body).write();
  res.redirect("/transactions");
};