const { ERROR_MESSAGES } = require("./errors");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");

const handleMongooseError = (err, next) => {
  if (err.name === "ValidationError") {
    next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
  } else if (err.name === "CastError") {
    next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
  } else if (err.code === 11000) {
    next(new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS));
  } else {
    next(err);
  }
};

module.exports = { handleMongooseError };
