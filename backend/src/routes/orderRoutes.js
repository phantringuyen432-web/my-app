const express = require("express");

const router = express.Router();

// controllers
const {
  createOrder,
  getOrdersByUser,
  getOrderDetail,
  getAllOrders,
  updateStatus,
  getRevenueByMonth,
  getRevenueByYear,
  getRevenueByCategory,
  deleteOrder
} = require("../controllers/orderController");

// ============================
// ORDER
// ============================

// tạo đơn hàng
router.post("/", createOrder);

// admin - tất cả đơn hàng
// đặt lên trước để không bị route /:id nuốt
router.get("/admin/all", getAllOrders);

// đơn hàng theo user
router.get("/user/:userId", getOrdersByUser);

// ============================
// REVENUE
// ============================

// doanh thu theo tháng
router.get(
  "/revenue/month/:year",
  getRevenueByMonth
);

// doanh thu theo năm
router.get(
  "/revenue/year",
  getRevenueByYear
);

// doanh thu theo category
router.get(
  "/revenue/category",
  getRevenueByCategory
);

// ============================
// ORDER DETAIL
// ============================

// chi tiết đơn hàng
router.get("/:id", getOrderDetail);

// cập nhật trạng thái
router.put("/:id", updateStatus);

// xóa đơn hàng
router.delete("/:id", deleteOrder);

module.exports = router;