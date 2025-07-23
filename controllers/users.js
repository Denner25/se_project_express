const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");
const NotFoundError = require("../errors/not-found-err");
const { handleMongooseError } = require("../utils/constants");

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
    .catch((err) => handleMongooseError(err, next));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(ERROR_CODES.OK).send(userObj);
    })
    .catch((err) => handleMongooseError(err, next));
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
    .catch((err) => handleMongooseError(err, next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
