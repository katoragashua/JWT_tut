const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../middlewares/customErrorClass");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const errorHandler = (err) => {
  if (err.code === 11000) {
    throw new CustomError("This user has already signed up.", 11000);
  }
  throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // Incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // Incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // Duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }
};

/* const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
} */

const errorHandlerFunction = (err) => {
  const errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "The User has already been registered.";
    return errors;
  }

  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 30 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
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
  // res.cookie("user", "Jason");
  res.render("signup", { title: "Signup", lorem });
};

const login_GET = (req, res) => {
  res.render("signin", { title: "Login" });
};

const signup_POST = async (req, res, next) => {
  const { email, password } = req.body;
  // Hashing a password in the controller.
  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, salt);
  // const userObj = { ...req.body, password: hash }; // This object is then passed into the mongoose create function below
  try {
    const user = await User.create({ email, password });
    const token = await createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(StatusCodes.CREATED).json(user);
    console.log(user);
  } catch (err) {
    // console.log(err);
    const error = errorHandlerFunction(err);
    res.status(400).json({ error });
  }
};

const login_POST = async (req, res) => {
  const { email, password } = req.body;
  const userObj = { email: "", password: "" };

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist.");
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      throw new Error("Password is incorrect.");
    }
    console.log(user);
    const token = await createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.log(error);
  }
};

const logout_GET = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/signin");
};

module.exports = {
  signup_GET,
  login_GET,
  login_POST,
  signup_POST,
  logout_GET,
};
