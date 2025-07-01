const checkResponse = (res, err) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({ message: "User not found" });
  }
  return res.status(500).send({ message: err.message });
};

module.exports = { checkResponse };
