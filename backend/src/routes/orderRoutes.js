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

// tất cả đơn hàng admin
// ĐẶT TRƯỚC /:id để tránh bị nuốt route
router.get("/admin/all", getAllOrders);

// đơn hàng theo user
router.get("/user/:userId", getOrdersByUser);

// chi tiết đơn hàng
router.get("/:id", getOrderDetail);

// cập nhật trạng thái
router.put("/:id", updateStatus);

// xóa đơn hàng
router.delete("/:id", deleteOrder);

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

module.exports = router;