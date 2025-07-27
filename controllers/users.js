const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const {
  handleUserCreationError,
  handleCastAndNotFoundError,
  handleValidationAndCastError,
  handleLoginError,
} = require("../utils/constants");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(ERROR_CODES.OK).send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(ERROR_CODES.CREATED).send(userWithoutPassword);
    })
    .catch((err) => handleUserCreationError(err, next));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(ERROR_CODES.OK).send(userObj);
    })
    .catch((err) => handleCastAndNotFoundError(err, next));
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((updatedUser) => res.status(ERROR_CODES.OK).send(updatedUser))
    .catch((err) => handleValidationAndCastError(err, next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => handleLoginError(err, next));
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
