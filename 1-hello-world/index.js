const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const shortid = require("shortid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");

const db = low(adapter);

db.defaults({ users: {} }).write();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "./views");


app.get("/", (req, res) => {
  res.render("index", {
    name: "XXX",
  });
});

app.get("/users", (req, res) => {
  res.render("users/index", {
    users: db.get("users").value(),
  });
});

app.get("/users/search", (req, res) => {
  let users = db.get("users").value();
  let q = req.query.q;
  let matchedUser = users.filter((user) => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render("users/index", {
    users: matchedUser,
  });
});

app.get("/users/create", (req, res) => {
  res.render("users/create");
});

app.post("/users/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("users").push(req.body).write();
  // res.render('users/index', {
  //    users: db.get('users').value()
  // })
  res.redirect("/users");
});

app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  let user = db.get("users").find({ id: id }).value();

  res.render("users/view", {
    user: user,
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
