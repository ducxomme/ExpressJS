const db = require("../db");
const shortid = require("shortid");

module.exports.index = (req, res) => {
  let books = db.get("books").value();
  if (books.length > 0) {
    res.render("books/index", {
      books: books,
    });
  } else {
    res.send('Books Empty <a href="/book/create">Create book</a>');
  }
};

module.exports.create = (req, res) => {
  res.render("books/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("books").push(req.body).write();
  res.redirect("/books");
};

module.exports.update = (req, res) => {
  let book = db.get("books").find({ id: req.params.id }).value();
  res.render("books/update", {
    book: book,
  });
};

module.exports.postUpdate = (req, res) => {
  db.get("books")
    .find({ id: req.body.id })
    .assign({ title: req.body.title })
    .write();
  res.redirect("/books");
};

module.exports.delete = (req, res) => {
  db.get("books").remove({ id: req.params.id }).write();
  res.redirect("/books");
};
