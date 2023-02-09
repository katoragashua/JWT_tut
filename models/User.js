const mongoose = require("mongoose");
const Isemail = require("isemail");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "An email is required to continue."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [(val) => Isemail.validate(val), "Enter a valid email address"],
  },
  password: {
    type: String,
    trim: true,
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

// Static function to login user
userSchema.static.login = async function (email, password) {
  const user = await this.findOne({ email: email})
  if(user) {
    const auth = await bcrypt.compare(password, user.password)
    if(auth) {
      return user
    }
    throw new Error("Password is incorrect")
  }
  throw new Error("No user signed up with this email")
}

const User = mongoose.model("user", userSchema);

module.exports = User;
