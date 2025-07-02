const User = require("../models/user");
const { checkResponse } = require("../utils/constants");
const { ERROR_CODES } = require("../utils/errors"); // Import error codes

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ERROR_CODES.OK).send(users))
    .catch((err) => checkResponse(res, err));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(ERROR_CODES.CREATED).send(user))
    .catch((err) => checkResponse(res, err));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(ERROR_CODES.OK).send(user))
    .catch((err) => checkResponse(res, err));
};

module.exports = { getUsers, createUser, getUser };
