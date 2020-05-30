const express = require("express");
const app = express();
const PORT = 3000;
const shortid = require("shortid");
const bodyParser = require("body-parser");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
const db = low(adapter)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "./views");


app.get("/", (req, res) => {
   res.send('Hello')
});

app.get('/books', (req, res) => {
   let books = db.get('books').value();
   if (books.length > 0) {
      res.render('books/index', {
         books: books
      })
   } else {
      res.send('Books Empty <a href="/book/create">Create book</a>');
   }
})

app.get('/book/create', (req, res) => {
   res.render('books/create');
})

app.post('/book/create', (req, res) => {
   req.body.id = shortid.generate();
   db.get('books')
      .push(req.body)
      .write();
   res.redirect("/books");
})

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
