const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const {
  handleValidationAndCastError,
  handleCastAndNotFoundError,
} = require("../utils/constants");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => handleValidationAndCastError(err, next));
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      return item
        .deleteOne()
        .then(() => res.status(ERROR_CODES.OK).send({ data: item }));
    })
    .catch((err) => handleCastAndNotFoundError(err, next));
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => handleCastAndNotFoundError(err, next));
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(ERROR_CODES.OK).send({ data: item }))
    .catch((err) => handleCastAndNotFoundError(err, next));
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
