const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../middlewares/customErrorClass");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const errorHandler = (err) => {
  if (err.code === 11000) {
    throw new CustomError("This user has already signed up.", 11000);
  }
  throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
};

const signup_GET = async (req, res) => {
  console.log("This is a JWT tutorial.");
  const lorem = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, unde.",
    "Eaque deleniti possimus tempora, sapiente rerum quo velit dolorum facere?",
    "Hic, sint consectetur labore debitis ipsum iure repellat eos vel.",
  ];
  // await User.deleteMany();
  // res.setHeader("Set-cookie", "user=Kator")
  res.cookie("user", "Jason");
  res.render("signup", { title: "Signup", lorem });
};

const login_GET = (req, res) => {};

const signup_POST = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Hashing a password in the controller.
  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, salt);
  // const userObj = { ...req.body, password: hash }; // This object is then passed into the mongoose create function below
  try {
    const user = await User.create({ email, password });
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    console.log(error);
    errorHandler(error);
  }
};

const login_POST = (req, res) => {};

module.exports = {
  signup_GET,
  login_GET,
  login_POST,
  signup_POST,
};
