const db = require("../db");
const shortid = require("shortid");

module.exports.index =  (req, res) => {
  let user = db.get('users').find({id: req.signedCookies.userId}).value();
  let transactions = db.get('transactions').find({userId: req.signedCookies.userId}).value();
  if (user.isAdmin) {
      transactions = db.get('transactions').value();
  }
  if (!transactions) {
   res.render("transactions/index", {
      transactions: transactions,
      haveItem: false
   });
   return;
  } else {
   res.render("transactions/index", {
      transactions: transactions,
      haveItem: true
   });
  }
};

module.exports.create = (req, res) => {
  let users = db.get('users').value();
  let books = db.get('books').value();
  res.render("transactions/create", {
    users: users,
    books: books
  });
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("transactions").push(req.body).write();
  res.redirect("/transactions");
};

module.exports.complete = (req, res) => {
  db.get('transactions').find({id: req.params.id})
    .assign({ isComplete: true})
    .write();
  res.redirect("/transactions");
}