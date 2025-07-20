const router = require("express").Router();
const auth = require("../middlewares/auth");
const { errors } = require("celebrate");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

router.use(auth);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

router.use(errors());

module.exports = router;
