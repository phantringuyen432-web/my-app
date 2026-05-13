const db = require('../config/db');

exports.getProducts = (req, res) => {
  const { category } = req.query;

  let sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;

  let params = [];

  // nếu có filter category
  if (category) {
    sql += " WHERE p.category_id = ?";
    params.push(category);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);

    console.log("DATA:", results);
    res.json(results);
  });
};
// them SP
exports.addProduct = (req, res) => {

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

    const image = req.file.filename;

    // insert product
    db.query(
      `
      INSERT INTO products
      (name, price, image, category_id, description)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        price,
        image,
        category_id,
        description
      ],
      (err, result) => {

        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        const productId = result.insertId;

        // parse variants JSON
        const parsedVariants = JSON.parse(variants);

        // nếu không có variants
        if (!parsedVariants.length) {
          return res.json({
            message: "Thêm sản phẩm thành công"
          });
        }

        // tạo values insert
        const values = parsedVariants.map(v => [
          productId,
          v.size,
          v.color,
          v.stock
        ]);

        // insert variants
        db.query(
          `
          INSERT INTO product_variants
          (product_id, size, color, stock)
          VALUES ?
          `,
          [values],
          (err2) => {

            if (err2) {
              console.log(err2);
              return res.status(500).json(err2);
            }

            res.json({
              message: "Thêm sản phẩm thành công"
            });

          }
        );

      }
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }
};
// DELETE PRODUCT
exports.deleteProduct = (req, res) => {

  const id = req.params.id;

  // xóa variants trước
  db.query(
    "DELETE FROM product_variants WHERE product_id = ?",
    [id],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      // xóa product
      db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (err2) => {

          if (err2) {
            return res.status(500).json(err2);
          }

          res.json({
            message: "Đã xóa sản phẩm"
          });

        }
      );

    }
  );

};
//lấy Sp theo ID
exports.getProductById = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};
// UPDATE PRODUCT
exports.updateProduct = (req, res) => {

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
    image = req.file.filename;
  }

  // query update product
  let sql = "";
  let params = [];

  // có ảnh mới
  if (image) {

    sql = `
      UPDATE products
      SET
        name = ?,
        price = ?,
        category_id = ?,
        description = ?,
        image = ?
      WHERE id = ?
    `;

    params = [
      name,
      price,
      category_id,
      description,
      image,
      id
    ];

  } else {

    // không đổi ảnh
    sql = `
      UPDATE products
      SET
        name = ?,
        price = ?,
        category_id = ?,
        description = ?
      WHERE id = ?
    `;

    params = [
      name,
      price,
      category_id,
      description,
      id
    ];
  }

  db.query(sql, params, (err) => {

    if (err) {
      return res.status(500).json(err);
    }

    // xóa variants cũ
    db.query(
      "DELETE FROM product_variants WHERE product_id = ?",
      [id],
      (err2) => {

        if (err2) {
          return res.status(500).json(err2);
        }

        // parse variants mới
        const parsedVariants = JSON.parse(variants);

        // nếu không có variants
        if (!parsedVariants.length) {
          return res.json({
            message: "Cập nhật thành công"
          });
        }

        // tạo values
        const values = parsedVariants.map(v => [
          id,
          v.size,
          v.color,
          v.stock
        ]);

        // insert variants mới
        db.query(
          `
          INSERT INTO product_variants
          (product_id, size, color, stock)
          VALUES ?
          `,
          [values],
          (err3) => {

            if (err3) {
              return res.status(500).json(err3);
            }

            res.json({
              message: "Cập nhật thành công"
            });

          }
        );

      }
    );

  });

};
// Lấy chi tiết sản phẩm
exports.getProductDetail = (req, res) => {

  const productId = req.params.id;

  // lấy product
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, productResult) => {

      if (err) return res.status(500).json(err);

      if (productResult.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm"
        });
      }

      // lấy variants
      db.query(
        "SELECT * FROM product_variants WHERE product_id = ?",
        [productId],
        (err, variantResult) => {

          if (err) return res.status(500).json(err);

          res.json({
            product: productResult[0],
            variants: variantResult
          });
        }
      );
    }
  );
};