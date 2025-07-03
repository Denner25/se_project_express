const ClothingItem = require("../models/clothingItem");
const { checkResponse } = require("../utils/constants");
const { ERROR_CODES } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(ERROR_CODES.OK).send(items))
    .catch((err) => checkResponse(res, err));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => checkResponse(res, err));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => checkResponse(res, err));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => checkResponse(res, err));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => checkResponse(res, err));
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
