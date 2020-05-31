const express = require("express");
const PORT = 3000;
const bodyParser = require("body-parser");

const bookRoute = require('./routes/book.route');
const userRoute = require('./routes/user.route');
const transactionRoute = require('./routes/transaction.route');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");


app.get("/", (req, res) => {
  res.render('index');
});


app.use('/books', bookRoute);
app.use('/users', userRoute);
app.use('/transactions', transactionRoute);


app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
