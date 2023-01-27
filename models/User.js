const mongoose = require("mongoose");
const Isemail = require("isemail");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "An email is required to continue."],
    unique: true,
    lowercase: true,
    validate: [(val) => Isemail.validate(val), "Enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "A password is required to continue."],
    minlength: [6, "Password must not be  less than 6 characters."],
  },
});

// Hashing the passwords before save. Please note that this can also be done in the controllers
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
