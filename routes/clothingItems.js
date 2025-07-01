const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.put("/:itemId/likes", updateItem);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", deleteItem);

module.exports = router;
