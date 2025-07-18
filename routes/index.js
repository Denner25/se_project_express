const router = require("express").Router();
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(auth);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
