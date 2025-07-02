const ERROR_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_DATA: "Invalid data provided",
  INVALID_ID: "Invalid ID format",
  NOT_FOUND: "Resource not found",
  USER_NOT_FOUND: "User not found",
  SERVER_ERROR: "An error has occurred on the server",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
