const db = require("../db");
const shortid = require("shortid");
const cloudinary = require('../utilities/cloudinary');
const fs = require('fs');

module.exports.index = (req, res) => {
  console.log('herein bookCon', req.signedCookies.sessionId);
  let perPage = 8;
  let allBooks = db.get('books').value();
  let maxPage = Math.ceil(allBooks.length/perPage);

  let page = parseInt(req.query.page) || 1;

  if (page > maxPage) {
    page = maxPage;
  } else if (page < 1) {
    page = 1;
  }

  let drop = (page - 1) * perPage;
  // Option 1
  // let books = db.get("books").value().slice(begin, end);

  // Option 2
  let books = db.get('books').drop(drop).take(perPage).value();

  if (books.length > 0) {
    res.render("books/index", {
      books: books,
      page: page,
      first: drop,
      maxPage: maxPage,
      cartCount: res.locals.cartCount
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

  cloudinary.upload(req.file.path)
    .then(url => {
      req.body.imageUrl = url;
      db.get('books').push(req.body).write(); 
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log('err fs: ', err);
        }
        console.log('file was deleted');
      });
      res.redirect("/books");
    })
    .catch(err => {
      console.log('error in postCreate book', err);
    })
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
