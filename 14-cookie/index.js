const express = require("express");
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const transactionRoute = require("./routes/transaction.route");
const countMiddleware = require("./middleware/cookie-count.middleware");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.cookie("count", "XXX");
  res.render("index");
});

app.use("/books", countMiddleware.countCookie, bookRoute);
app.use("/users", countMiddleware.countCookie,userRoute);
app.use("/transactions", countMiddleware.countCookie,transactionRoute);

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
