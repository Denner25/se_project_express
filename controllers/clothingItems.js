const ClothingItem = require("../models/clothingItem");
const { handleError } = require("../utils/constants");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch((err) => handleError(res, err));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => handleError(res, err));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(ERROR_CODES.FORBIDDEN)
          .send({ message: ERROR_MESSAGES.FORBIDDEN });
      }
      return item.deleteOne().then(() => {
        res
          .status(ERROR_CODES.OK)
          .send({ message: "Item deleted", data: item });
      });
    })
    .catch((err) => handleError(res, err));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => handleError(res, err));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => handleError(res, err));
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
