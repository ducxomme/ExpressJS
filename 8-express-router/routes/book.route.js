const express = require('express');
const shortid = require("shortid");

const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
   let books = db.get('books').value();
   if (books.length > 0) {
      res.render('books/index', {
         books: books
      })
   } else {
      res.send('Books Empty <a href="/book/create">Create book</a>');
   }
})

router.get('/create', (req, res) => {
   res.render('books/create');
})

router.post('/create', (req, res) => {
   req.body.id = shortid.generate();
   db.get('books')
      .push(req.body)
      .write();
   res.redirect("/books");
})

router.get('/:id/update', (req, res) => {
   let book = db.get('books').find({id: req.params.id}).value();
   res.render('books/update', {
      book: book
   });
})

router.post('/update', (req, res) => {
   
   db.get('books')
      .find({ id: req.body.id })
      .assign({title: req.body.title})
      .write();
   res.redirect("/books");   
})

router.get('/:id/delete', (req, res) => {
   db.get('books')
    .remove({id : req.params.id})
    .write();
   res.redirect("/books");
})

module.exports = router;