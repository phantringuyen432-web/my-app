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

    const offset =
      (page - 1) * limit;

    // GET PRODUCTS
    const result = await db.query(
      `
      SELECT *
      FROM products
      WHERE name ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
      `,
      [
        `%${search}%`,
        limit,
        offset
      ]
    );

    // parse images
    const products = result.rows.map(p => ({
      ...p,
      images: p.images
        ? JSON.parse(p.images)
        : []
    }));

    // TOTAL PRODUCTS
    const totalResult = await db.query(
      `
      SELECT COUNT(*)
      FROM products
      WHERE name ILIKE $1
      `,
      [`%${search}%`]
    );

    const total =
      parseInt(
        totalResult.rows[0].count
      );

    res.json({

      products,

      total,

      currentPage: page,

      totalPages: Math.ceil(
        total / limit
      )

    });

  } catch (err) {

    console.log(err);

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

    // multiple images
    const images = req.files.map(
      file => file.path
    );

    // insert product
    const productResult = await db.query(
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
        JSON.stringify(images),
        category_id,
        description
      ]
    );

    const productId =
      productResult.rows[0].id;

    // parse variants
    const parsedVariants =
      JSON.parse(variants);

    // insert variants
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

    const id = req.params.id;

    const {
      name,
      price,
      category_id,
      description,
      variants
    } = req.body;

    let images = null;

    // upload new images
    if (
      req.files &&
      req.files.length > 0
    ) {

      images = req.files.map(
        file => file.path
      );

    }

    // update product
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
          JSON.stringify(images),
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

    // delete old variants
    await db.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [id]
    );

    // parse variants
    let parsedVariants = [];

    if (variants) {

      parsedVariants =
        JSON.parse(variants);

    }

    // insert new variants
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

    console.log(err);

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

    // get product
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

    // parse images
    product.images =
      product.images
        ? JSON.parse(product.images)
        : [];

    // get variants
    const variantResult =
      await db.query(
        `
        SELECT *
        FROM product_variants
        WHERE product_id = $1
        `,
        [productId]
      );

    res.json({

      product,

      variants:
        variantResult.rows

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};