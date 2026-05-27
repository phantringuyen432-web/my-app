const express = require("express");

const router = express.Router();

// MIDDLEWARE
const {
  verifyToken
} = require("../middleware/authMiddleware");

// CONTROLLER
const {

  addFavorite,

  removeFavorite,

  getFavorites,

  checkFavorite

} = require(
  "../controllers/favoriteController"
);

// ============================
// GET ALL FAVORITES
// ============================
router.get(
  "/",
  verifyToken,
  getFavorites
);

// ============================
// CHECK FAVORITE
// ============================
router.get(
  "/check/:productId",
  verifyToken,
  checkFavorite
);

// ============================
// ADD FAVORITE
// ============================
router.post(
  "/add",
  verifyToken,
  addFavorite
);

// ============================
// REMOVE FAVORITE
// ============================
router.delete(
  "/:productId",
  verifyToken,
  removeFavorite
);

module.exports = router;