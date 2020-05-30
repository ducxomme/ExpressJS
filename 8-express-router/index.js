const express = require("express");
const PORT = 3000;
const bodyParser = require("body-parser");

const bookRoute = require('./routes/book.route');
const userRoute = require('./routes/user.route');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");


app.get("/", (req, res) => {
   res.send('Hello')
});


app.use('/books', bookRoute);
app.use('/users', userRoute);






app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
