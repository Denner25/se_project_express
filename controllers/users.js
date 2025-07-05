const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { checkResponse } = require("../utils/constants");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ERROR_CODES.OK).send(users))
    .catch((err) => checkResponse(res, err));
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(ERROR_CODES.CREATED).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return checkResponse(res, err);
      }
      return checkResponse(res, err);
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(ERROR_CODES.OK).send(user))
    .catch((err) => checkResponse(res, err));
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updatedUser) => res.status(ERROR_CODES.OK).send(updatedUser))
    .catch((err) => checkResponse(res, err));
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
