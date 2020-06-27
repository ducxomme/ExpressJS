const db = require("../db");
const cloudinary = require("../utilities/cloudinary");
const mongoose = require("mongoose");
const fs = require("fs");

const Book = require("../models/book");

module.exports.index = (req, res) => {
  let user = db.get("users").find({ id: req.signedCookies.userId }).value();
  let perPage = 8;
  Book.find()
    .then((docs) => {
      let maxPage = Math.ceil(docs.length / perPage);

      let page = parseInt(req.query.page) || 1;

      if (page > maxPage) {
        page = maxPage;
      } else if (page < 1) {
        page = 1;
      }

      let drop = (page - 1) * perPage;
      let begin = (page - 1) * perPage;
      let end = begin + perPage;

      let books = docs.slice(begin, end);

      if (docs.length > 0) {
        res.render("books/index", {
          books: books,
          page: page,
          first: drop,
          maxPage: maxPage,
          cartCount: res.locals.cartCount,
          user: user,
        });
      } else {
        res.send('Books Empty <a href="/books/create">Create book</a>');
      }
    })
    .catch((err) => {
      console.log("error in fetch book: ", err);
    });
};

module.exports.create = (req, res) => {
  res.render("books/create");
};

module.exports.postCreate = (req, res) => {
  cloudinary
    .upload(req.file.path)
    .then((url) => {
      const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        imageUrl: url,
      });
      book
        .save()
        .then((result) => {
          console.log("Saved book: ", result);
        })
        .catch((err) => {
          console.log("Error in save book: ", err);
        });

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log("err fs: ", err);
        }
        console.log("file was deleted");
      });
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("error in postCreate book", err);
    });
};

module.exports.update = (req, res) => {
  Book.findOne({
    id: req.params.id
  }).then(book => {
    res.render("books/update", {
      book: book,
    });
  }).catch(err => {
    res.render("auth/error")
  })
  // let book = db.get("books").find({ id: req.params.id }).value();
};

module.exports.postUpdate = (req, res) => {
  db.get("books")
    .find({ _id: req.body.id })
    .assign({ title: req.body.title })
    .write();
  res.redirect("/books");
};

module.exports.delete = (req, res) => {
  db.get("books").remove({ id: req.params.id }).write();
  Book.remove({ _id: req.params.id })
  .then(result => {
    res.redirect("/books");
  })
  .catch(e => {
    console.log(e);
  })
};