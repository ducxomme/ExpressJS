const express = require("express");
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const transactionRoute = require("./routes/transaction.route");
const authRoute = require('./routes/auth.route');


const authMiddleware = require('./middleware/auth.middleware')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", authMiddleware.auth, (req, res) => {
  res.render("index");
});

app.use("/books", authMiddleware.auth, bookRoute);
app.use("/users", authMiddleware.auth,userRoute);
app.use("/transactions", authMiddleware.auth, transactionRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
