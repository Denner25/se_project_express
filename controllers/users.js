const User = require("../models/user");

const checkResponse = (res, err) => {
  console.error(err);
  return res.status(500).send({ message: err.message });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => checkResponse(res, err));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => checkResponse(res, err));
};

module.exports = { getUsers, createUser };
