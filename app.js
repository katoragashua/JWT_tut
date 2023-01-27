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

// View Engine
app.set("view engine", "ejs")

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(authRouter);
app.use(cookieParser())

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
