const express = require("express");

const router = express.Router();

const upload = require("../config/upload");

// MIDDLEWARE
const {
  verifyToken,
  isAdmin
} = require("../middleware/authMiddleware");

// CONTROLLERS
const {
  getProducts,
  getProductDetail,
  addProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

// ============================
// PUBLIC ROUTES
// ============================

// GET products
router.get("/", getProducts);

// GET detail product + variants
router.get("/:id", getProductDetail);

// ============================
// ADMIN ROUTES
// ============================

// ADD PRODUCT
router.post(
  "/add",
  verifyToken,
  isAdmin,
  upload.single("image"),
  addProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  updateProduct
);

module.exports = router;