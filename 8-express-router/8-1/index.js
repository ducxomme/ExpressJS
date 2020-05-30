const express = require("express");
const app = express();
const PORT = 3000;
const shortid = require("shortid");
const bodyParser = require("body-parser");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("./db.json");
const db = low(adapter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/books", (req, res) => {
  let books = db.get("books").value();
  if (books.length > 0) {
    res.render("books/index", {
      books: books,
    });
  } else {
    res.send('Books Empty <a href="/book/create">Create book</a>');
  }
});

app.get("/book/create", (req, res) => {
  res.render("books/create");
});

app.post("/book/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("books").push(req.body).write();
  res.redirect("/books");
});

app.get("/book/:id/update", (req, res) => {
  let book = db.get("books").find({ id: req.params.id }).value();
  res.render("books/update", {
    book: book,
  });
});

app.post("/book/update", (req, res) => {
  db.get("books")
    .find({ id: req.body.id })
    .assign({ title: req.body.title })
    .write();
  res.redirect("/books");
});

app.get("/book/:id/delete", (req, res) => {
  db.get("books").remove({ id: req.params.id }).write();
  res.redirect("back");
});

// =========================USER=====================

app.get("/users", (req, res) => {
  let users = db.get("users").value();
  console.log("users", users);
  res.render("users/index", {
    users: db.get("users").value(),
  });
});

app.get("/users/create", (req, res) => {
  res.render("users/create");
});

app.post("/users/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("users").push(req.body).write();
  res.redirect("/users");
});

app.get("/users/:id", (req, res) => {
  console.log("user", db.get("users").find({ id: req.params.id }).value());
  res.render("users/view", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
});

app.get("/users/:id/update", (req, res) => {
  res.render("users/update", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
});

app.post("/users/update", (req, res) => {
  console.log("body", req.body);
  db.get("users")
    .find({ id: req.body.id })
    .assign({ name: req.body.name })
    .write();

  res.redirect("/users");
});

app.get("/users/:id/delete", (req, res) => {
  db.get("users").remove({ id: req.params.id }).write();
  res.redirect("/users");
});

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
