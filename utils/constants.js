const { ERROR_CODES, ERROR_MESSAGES } = require("./errors");

const handleError = (res, err) => {
  console.error(err);
  if (err.code === 11000) {
    return res
      .status(ERROR_CODES.CONFLICT)
      .send({ message: ERROR_MESSAGES.EMAIL_EXISTS });
  }
  if (err.name === "ValidationError") {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_DATA });
  }
  if (err.name === "CastError") {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID });
  }
  if (err.name === "DocumentNotFoundError") {
    return res
      .status(ERROR_CODES.NOT_FOUND)
      .send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
  }
  return res
    .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
    .send({ message: ERROR_MESSAGES.SERVER_ERROR });
};

module.exports = { handleError };
