const db = require("../config/db");

// ============================
// ADD FAVORITE
// ============================
exports.addFavorite = async (req, res) => {

  try {

    const userId = req.user.id;

    const { product_id } = req.body;

    // check already favorite
    const check =
      await db.query(
        `
        SELECT *
        FROM favorites
        WHERE user_id = $1
        AND product_id = $2
        `,
        [userId, product_id]
      );

    if (check.rows.length > 0) {

      return res.status(400).json({
        message:
          "Sản phẩm đã tồn tại trong yêu thích"
      });

    }

    // insert favorite
    await db.query(
      `
      INSERT INTO favorites
      (user_id, product_id)
      VALUES ($1, $2)
      `,
      [userId, product_id]
    );

    res.json({
      message:
        "Đã thêm vào yêu thích"
    });

  } catch (err) {

    console.log(
      "ADD FAVORITE ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// REMOVE FAVORITE
// ============================
exports.removeFavorite = async (req, res) => {

  try {

    const userId = req.user.id;

    const productId =
      req.params.productId;

    await db.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1
      AND product_id = $2
      `,
      [userId, productId]
    );

    res.json({
      message:
        "Đã xóa khỏi yêu thích"
    });

  } catch (err) {

    console.log(
      "REMOVE FAVORITE ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// GET FAVORITES
// ============================
exports.getFavorites = async (req, res) => {

  try {

    const userId = req.user.id;

    const result =
      await db.query(
        `
        SELECT
          products.*
        FROM favorites

        JOIN products
        ON favorites.product_id = products.id

        WHERE favorites.user_id = $1

        ORDER BY favorites.id DESC
        `,
        [userId]
      );

    const favorites =
      result.rows.map(p => ({

        ...p,

        images:
          p.images || []

      }));

    res.json(favorites);

  } catch (err) {

    console.log(
      "GET FAVORITES ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// CHECK FAVORITE
// ============================
exports.checkFavorite = async (req, res) => {

  try {

    const userId = req.user.id;

    const productId =
      req.params.productId;

    const result =
      await db.query(
        `
        SELECT *
        FROM favorites
        WHERE user_id = $1
        AND product_id = $2
        `,
        [userId, productId]
      );

    res.json({

      isFavorite:
        result.rows.length > 0

    });

  } catch (err) {

    console.log(
      "CHECK FAVORITE ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};