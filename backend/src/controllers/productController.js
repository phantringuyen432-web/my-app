const db = require("../config/db");

// ============================
// GET PRODUCTS
// ============================
exports.getProducts = async (req, res) => {

  try {

    const { category } = req.query;

    let sql = `
      SELECT 
        p.*,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
    `;

    let params = [];

    // filter category
    if (category) {

      sql += ` WHERE p.category_id = $1`;

      params.push(category);

    }

    const result = await db.query(sql, params);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};

// ============================
// ADD PRODUCT
// ============================
exports.addProduct = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "Chưa upload ảnh"
      });

    }

    const {
      name,
      price,
      category_id,
      description,
      variants
    } = req.body;

    const image = req.file.path;

    // insert product
    const productResult = await db.query(
      `
      INSERT INTO products
      (name, price, image, category_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        name,
        price,
        image,
        category_id,
        description
      ]
    );

    const productId = productResult.rows[0].id;

    // parse variants
    const parsedVariants = JSON.parse(variants);

    // insert variants
    for (const v of parsedVariants) {

      await db.query(
        `
        INSERT INTO product_variants
        (product_id, size, color, stock)
        VALUES ($1, $2, $3, $4)
        `,
        [
          productId,
          v.size,
          v.color,
          v.stock
        ]
      );

    }

    res.json({
      message: "Thêm sản phẩm thành công"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// DELETE PRODUCT
// ============================
exports.deleteProduct = async (req, res) => {

  try {

    const id = req.params.id;

    // delete variants
    await db.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [id]
    );

    // delete product
    await db.query(
      `
      DELETE FROM products
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Đã xóa sản phẩm"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// GET PRODUCT BY ID
// ============================
exports.getProductById = async (req, res) => {

  try {

    const id = req.params.id;

    const result = await db.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      `,
      [id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// UPDATE PRODUCT
// ============================
exports.updateProduct = async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const id = req.params.id;

    const {
      name,
      price,
      category_id,
      description,
      variants
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.path;
    }

    // UPDATE PRODUCT
    if (image) {

      await db.query(
        `
        UPDATE products
        SET
          name = $1,
          price = $2,
          category_id = $3,
          description = $4,
          image = $5
        WHERE id = $6
        `,
        [
          name,
          price,
          category_id,
          description,
          image,
          id
        ]
      );

    } else {

      await db.query(
        `
        UPDATE products
        SET
          name = $1,
          price = $2,
          category_id = $3,
          description = $4
        WHERE id = $5
        `,
        [
          name,
          price,
          category_id,
          description,
          id
        ]
      );

    }

    // DELETE OLD VARIANTS
    await db.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [id]
    );

    // PARSE VARIANTS
    let parsedVariants = [];

    if (variants) {

      parsedVariants = JSON.parse(variants);

    }

    // INSERT NEW VARIANTS
    for (const v of parsedVariants) {

      await db.query(
        `
        INSERT INTO product_variants
        (product_id, size, color, stock)
        VALUES ($1, $2, $3, $4)
        `,
        [
          id,
          v.size,
          v.color,
          v.stock
        ]
      );

    }

    res.json({
      message: "Cập nhật thành công"
    });

  } catch (err) {

    console.log("UPDATE ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }

};

// ============================
// GET PRODUCT DETAIL
// ============================
exports.getProductDetail = async (req, res) => {

  try {

    const productId = req.params.id;

    // get product
    const productResult = await db.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {

      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });

    }

    // get variants
    const variantResult = await db.query(
      `
      SELECT *
      FROM product_variants
      WHERE product_id = $1
      `,
      [productId]
    );

    res.json({
      product: productResult.rows[0],
      variants: variantResult.rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};