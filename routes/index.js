const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-err");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

router.use(auth);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
});

module.exports = router;
