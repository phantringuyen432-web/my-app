const db = require("../config/db");

// ============================
// GET PRODUCTS
// ============================
exports.getProducts = async (req, res) => {

  try {

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 8;

    const search =
      req.query.search || "";

    const category =
      req.query.category || null;

    const offset =
      (page - 1) * limit;

    // =========================
    // QUERY
    // =========================
    let query = `
      SELECT *
      FROM products
      WHERE name ILIKE $1
    `;

    const values = [
      `%${search}%`
    ];

    // category filter
    if (category) {

      query += `
        AND category_id = $2
      `;

      values.push(category);

    }

    query += `
      ORDER BY id DESC
    `;

    // pagination
    if (category) {

      query += `
        LIMIT $3 OFFSET $4
      `;

      values.push(limit);
      values.push(offset);

    } else {

      query += `
        LIMIT $2 OFFSET $3
      `;

      values.push(limit);
      values.push(offset);

    }

    // =========================
    // GET PRODUCTS
    // =========================
    const result =
      await db.query(
        query,
        values
      );

    // normalize images
    const products =
      result.rows.map(p => ({

        ...p,

        images:
          p.images || []

      }));

    // =========================
    // TOTAL
    // =========================
    let totalQuery = `
      SELECT COUNT(*)
      FROM products
      WHERE name ILIKE $1
    `;

    const totalValues = [
      `%${search}%`
    ];

    if (category) {

      totalQuery += `
        AND category_id = $2
      `;

      totalValues.push(category);

    }

    const totalResult =
      await db.query(
        totalQuery,
        totalValues
      );

    const total =
      parseInt(
        totalResult.rows[0].count
      );

    // =========================
    // RESPONSE
    // =========================
    res.json({

      products,

      total,

      currentPage: page,

      totalPages: Math.ceil(
        total / limit
      )

    });

  } catch (err) {

    console.log(
      "GET PRODUCTS ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// ADD PRODUCT
// ============================
exports.addProduct = async (req, res) => {

  try {

    // =========================
    // VALIDATE IMAGES
    // =========================
    if (
      !req.files ||
      req.files.length === 0
    ) {

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

    // =========================
    // MULTIPLE IMAGES
    // =========================
    const images =
      req.files.map(
        file => file.path
      );

    // =========================
    // INSERT PRODUCT
    // =========================
    const productResult =
      await db.query(
        `
        INSERT INTO products
        (
          name,
          price,
          images,
          category_id,
          description
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [
          name,
          price,
          images,
          category_id,
          description
        ]
      );

    const productId =
      productResult.rows[0].id;

    // =========================
    // PARSE VARIANTS
    // =========================
    let parsedVariants = [];

    if (variants) {

      parsedVariants =
        JSON.parse(variants);

    }

    // =========================
    // INSERT VARIANTS
    // =========================
    for (const v of parsedVariants) {

      await db.query(
        `
        INSERT INTO product_variants
        (
          product_id,
          size,
          color,
          stock
        )
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
      message:
        "Thêm sản phẩm thành công"
    });

  } catch (err) {

    console.log(
      "ADD PRODUCT ERROR:",
      err
    );

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

    const id =
      req.params.id;

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
      message:
        "Đã xóa sản phẩm"
    });

  } catch (err) {

    console.log(
      "DELETE PRODUCT ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// UPDATE PRODUCT
// ============================
exports.updateProduct = async (req, res) => {

  try {

    const id =
      req.params.id;

    const {
      name,
      price,
      category_id,
      description,
      variants
    } = req.body;

    let images = null;

    // =========================
    // NEW IMAGES
    // =========================
    if (
      req.files &&
      req.files.length > 0
    ) {

      images =
        req.files.map(
          file => file.path
        );

    }

    // =========================
    // UPDATE PRODUCT
    // =========================
    if (images) {

      await db.query(
        `
        UPDATE products
        SET
          name = $1,
          price = $2,
          category_id = $3,
          description = $4,
          images = $5
        WHERE id = $6
        `,
        [
          name,
          price,
          category_id,
          description,
          images,
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

    // =========================
    // DELETE OLD VARIANTS
    // =========================
    await db.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [id]
    );

    // =========================
    // PARSE VARIANTS
    // =========================
    let parsedVariants = [];

    if (variants) {

      parsedVariants =
        JSON.parse(variants);

    }

    // =========================
    // INSERT NEW VARIANTS
    // =========================
    for (const v of parsedVariants) {

      await db.query(
        `
        INSERT INTO product_variants
        (
          product_id,
          size,
          color,
          stock
        )
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
      message:
        "Cập nhật thành công"
    });

  } catch (err) {

    console.log(
      "UPDATE PRODUCT ERROR:",
      err
    );

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

    const productId =
      req.params.id;

    // =========================
    // GET PRODUCT
    // =========================
    const productResult =
      await db.query(
        `
        SELECT *
        FROM products
        WHERE id = $1
        `,
        [productId]
      );

    if (
      productResult.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Không tìm thấy sản phẩm"
      });

    }

    const product =
      productResult.rows[0];

    // normalize images
    product.images =
      product.images || [];

    // =========================
    // GET VARIANTS
    // =========================
    const variantResult =
      await db.query(
        `
        SELECT *
        FROM product_variants
        WHERE product_id = $1
        ORDER BY id ASC
        `,
        [productId]
      );

    // =========================
    // RESPONSE
    // =========================
    res.json({

      product,

      variants:
        variantResult.rows

    });

  } catch (err) {

    console.log(
      "GET PRODUCT DETAIL ERROR:",
      err
    );

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};