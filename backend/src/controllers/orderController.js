const db = require("../config/db");

// ============================
// TẠO ĐƠN HÀNG
// ============================
exports.createOrder = async (req, res) => {

  try {

    const {
      items,
      total,
      userId
    } = req.body;

    // validate
    if (!userId) {

      return res.status(400).json({
        message: "Thiếu userId"
      });

    }

    if (!items || items.length === 0) {

      return res.status(400).json({
        message: "Giỏ hàng trống"
      });

    }

    // tạo order
    const orderResult = await db.query(
      `
      INSERT INTO orders
      (user_id, total)
      VALUES ($1, $2)
      RETURNING id
      `,
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    // insert order items + update stock
    for (const item of items) {

      // insert order item
      await db.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          variant_id,
          quantity,
          price,
          size,
          color
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          orderId,
          item.product_id,
          item.variant_id,
          item.quantity,
          item.price,
          item.size,
          item.color
        ]
      );

      // update stock
      await db.query(
        `
        UPDATE product_variants
        SET stock = stock - $1
        WHERE id = $2
        `,
        [
          item.quantity,
          item.variant_id
        ]
      );

    }

    res.json({

      message: "Đặt hàng thành công",

      orderId

    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// ĐƠN HÀNG THEO USER
// ============================
exports.getOrdersByUser = async (req, res) => {

  try {

    const userId = req.params.userId;

    const result = await db.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// CHI TIẾT ĐƠN HÀNG
// ============================
exports.getOrderDetail = async (req, res) => {

  try {

    const orderId = req.params.id;

    const result = await db.query(
      `
      SELECT
        oi.*,
        p.name,
        p.image
      FROM order_items oi
      JOIN products p
        ON oi.product_id = p.id
      WHERE oi.order_id = $1
      `,
      [orderId]
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// ADMIN - TẤT CẢ ĐƠN HÀNG
// ============================
exports.getAllOrders = async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        o.*,
        u.username
      FROM orders o
      JOIN users u
        ON o.user_id = u.id
      ORDER BY o.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// UPDATE STATUS
// ============================
exports.updateStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const id = req.params.id;

    await db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      `,
      [status, id]
    );

    res.json({
      message: "Cập nhật thành công"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// DOANH THU THEO THÁNG
// ============================
exports.getRevenueByMonth = async (req, res) => {

  try {

    const year = req.params.year;

    const result = await db.query(
      `
      SELECT
        EXTRACT(MONTH FROM created_at) as month,
        SUM(total) as revenue
      FROM orders
      WHERE status = 'paid'
        AND EXTRACT(YEAR FROM created_at) = $1
      GROUP BY month
      ORDER BY month
      `,
      [year]
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// DOANH THU THEO NĂM
// ============================
exports.getRevenueByYear = async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        EXTRACT(YEAR FROM created_at) as year,
        SUM(total) as revenue
      FROM orders
      WHERE status = 'paid'
      GROUP BY year
      ORDER BY year
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// DOANH THU THEO CATEGORY
// ============================
exports.getRevenueByCategory = async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        c.name as category,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi

      JOIN products p
        ON oi.product_id = p.id

      JOIN categories c
        ON p.category_id = c.id

      JOIN orders o
        ON oi.order_id = o.id

      WHERE o.status = 'paid'

      GROUP BY c.id, c.name
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};

// ============================
// XÓA ĐƠN HÀNG
// ============================
exports.deleteOrder = async (req, res) => {

  try {

    const id = req.params.id;

    // xóa order_items trước
    await db.query(
      `
      DELETE FROM order_items
      WHERE order_id = $1
      `,
      [id]
    );

    // xóa order
    await db.query(
      `
      DELETE FROM orders
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Đã xóa đơn hàng"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

};