const express = require("express");
const app = express();
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

app.get("/", (request, response) => {
  response.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  res.render("todos/index", {
    todos: db.get("todos").value()
  });
});

app.get("/todos/search", (req, res) => {
  let data = db.get('todos').value()
  var q = req.query.text;
  var matched = data.filter(item => {
    return item.text.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  })
  res.render('todos/index', {
    todos: matched
  });
});

app.post("/todos/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("todos")
    .push(req.body)
    .write();
  res.redirect("back");
});

app.get('/todos/:id/delete', (req, res) => {
  db.get('todos')
    .remove({id : req.params.id})
    .write();
  res.redirect("back");
})

app.listen(3000, () => {
  console.log("Server listening on port " + 3000);
});
