require('dotenv').config();
const express = require("express");
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');

mongoose.connect(
  `mongodb+srv://root:${process.env.MONGO_ATLAS_PW}@library-cluster-neccm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  });

const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const transactionRoute = require("./routes/transaction.route");
const authRoute = require('./routes/auth.route');
const cartRoute = require('./routes/cart.route');

const authMiddleware = require('./middleware/auth.middleware')
const sessionMiddleware = require('./middleware/session.middleware');
const cartMiddleware = require('./middleware/cart.middleware');

const app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
// app.use(sessionMiddleware);

app.get("/", cartMiddleware.cartCount, authMiddleware.auth, (req, res) => {
  res.render("index");
});

app.use("/books", sessionMiddleware, cartMiddleware.cartCount, bookRoute);
app.use("/users", authMiddleware.auth,userRoute);
app.use("/transactions", authMiddleware.auth, transactionRoute);
app.use("/auth", authRoute);
app.use("/cart", cartMiddleware.cartCount, cartRoute);
app.use("/logout", (req, res) => {
   res.clearCookie("userId");
   res.redirect('/auth/login');
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  next(error);
});

app.use((error, req, res, next) => {
  res.render('auth/error');
});

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
