const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const ForbiddenError = require("../errors/forbidden-err");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      return item.deleteOne().then(() => {
        res
          .status(ERROR_CODES.OK)
          .send({ message: "Item deleted", data: item });
      });
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
