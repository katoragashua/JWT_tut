require("express-async-errors");
const express = require("express");
const app = express();
const connection = require("./connectDB/connectDB");
const { config } = require("dotenv");
config();
const authRouter = require("./routes/authRouter");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const {
  authenticator,
  checkUser,
} = require("./middlewares/authAndUserMiddleware");

// View Engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(authRouter);
app.use(cookieParser());
app.get("*", checkUser);

app.get("/", authenticator, (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/main", authenticator, (req, res) => {
  res.render("main", { title: "Main" });
});

// Error middlewares
app.use(errorHandler);
app.use(notFound);

const port = 3000;

const start = async () => {
  try {
    await connection(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
// app.listen(port, () => console.log(`Server listening on port ${port}...`));
