const express = require("express");
const router = express.Router();

const upload = require("../config/upload");

const {
  getProducts,
  getProductDetail,
  addProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

// GET products
router.get("/", getProducts);

// GET detail product + variants
router.get("/:id", getProductDetail);

// POST add product
router.post(
  "/add",
  upload.single("image"),
  addProduct
);

// DELETE product
router.delete("/:id", deleteProduct);

// UPDATE product
router.put(
  "/:id",
  upload.single("image"),
  updateProduct
);

module.exports = router;