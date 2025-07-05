const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config"); // or wherever your secret lives
const { ERROR_CODES } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists and starts correctly
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Invalid token" });
  }

  req.user = payload; // Payload contains _id
  return next();
};

module.exports = auth;
