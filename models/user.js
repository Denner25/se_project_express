const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  // Select password explicitly since select: false
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        // User not found
        return Promise.reject(new Error("Incorrect email or password"));
      }
      // Compare password hashes
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // Password does not match
          return Promise.reject(new Error("Incorrect email or password"));
        }
        // Auth successful
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
