const db = require("../config/db");



// TẠO ĐƠN HÀNG
exports.createOrder = (req, res) => {

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
  db.query(

    "INSERT INTO orders (user_id, total) VALUES (?, ?)",

    [userId, total],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json(err);
      }

      const orderId = result.insertId;

      // insert order_items + update stock
      const queries = items.map(item => {

        return new Promise((resolve, reject) => {

          // insert order item
          db.query(

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
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,

            [
              orderId,
              item.product_id,
              item.variant_id,
              item.quantity,
              item.price,
              item.size,
              item.color
            ],

            (err) => {

              if (err) {
                reject(err);
                return;
              }

              // trừ tồn kho
              db.query(

                `
                UPDATE product_variants
                SET stock = stock - ?
                WHERE id = ?
                `,

                [
                  item.quantity,
                  item.variant_id
                ],

                (err2) => {

                  if (err2) {
                    reject(err2);
                  } else {
                    resolve();
                  }

                }
              );

            }
          );

        });

      });

      // chờ tất cả hoàn thành
      Promise.all(queries)

        .then(() => {

          res.json({

            message: "Đặt hàng thành công",

            orderId

          });

        })

        .catch(err => {

          console.log(err);

          res.status(500).json(err);

        });

    }
  );

};

// ĐƠN HÀNG THEO USER
exports.getOrdersByUser = (req, res) => {

  const userId = req.params.userId;

  db.query(

    `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,

    [userId],

    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);

    }
  );

};

// CHI TIẾT ĐƠN HÀNG
exports.getOrderDetail = (req, res) => {

  const orderId = req.params.id;

  db.query(

    `
    SELECT
      oi.*,
      p.name,
      p.image
    FROM order_items oi
    JOIN products p
      ON oi.product_id = p.id
    WHERE oi.order_id = ?
    `,

    [orderId],

    (err, results) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json(results);

    }
  );

};

// ADMIN - TẤT CẢ ĐƠN HÀNG
exports.getAllOrders = (req, res) => {

  db.query(

    `
    SELECT
      o.*,
      u.username
    FROM orders o
    JOIN users u
      ON o.user_id = u.id
    ORDER BY o.created_at DESC
    `,

    (err, results) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json(results);

    }
  );

};

// UPDATE STATUS
exports.updateStatus = (req, res) => {

  const { status } = req.body;

  const id = req.params.id;

  db.query(

    `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    `,

    [status, id],

    (err) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json({
        message: "Cập nhật thành công"
      });

    }
  );

};

// DOANH THU THEO THÁNG
exports.getRevenueByMonth = (req, res) => {

  const year = req.params.year;

  const sql = `
    SELECT
      MONTH(created_at) as month,
      SUM(total) as revenue
    FROM orders
    WHERE status = 'paid'
      AND YEAR(created_at) = ?
    GROUP BY MONTH(created_at)
    ORDER BY month
  `;

  db.query(sql, [year], (err, results) => {

    if (err) {

      return res.status(500).json(err);

    }

    res.json(results);

  });

};

// DOANH THU THEO NĂM
exports.getRevenueByYear = (req, res) => {

  const sql = `
    SELECT
      YEAR(created_at) as year,
      SUM(total) as revenue
    FROM orders
    WHERE status = 'paid'
    GROUP BY YEAR(created_at)
    ORDER BY year
  `;

  db.query(sql, (err, results) => {

    if (err) {

      return res.status(500).json(err);

    }

    res.json(results);

  });

};

// DOANH THU THEO CATEGORY
exports.getRevenueByCategory = (req, res) => {

  const sql = `
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

    GROUP BY c.id
  `;

  db.query(sql, (err, results) => {

    if (err) {

      return res.status(500).json(err);

    }

    res.json(results);

  });

};