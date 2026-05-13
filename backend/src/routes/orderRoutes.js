const express = require('express');
const router = express.Router();

// import các function từ controller
const {
  createOrder,
  getOrdersByUser,
  getOrderDetail,
  getAllOrders,
  updateStatus,
  getRevenueByMonth,
  getRevenueByYear,
  getRevenueByCategory
} = require('../controllers/orderController');

//Order
router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/:id', getOrderDetail);
router.get('/admin/all', getAllOrders);
router.put('/:id', updateStatus);

// Revenue
router.get("/revenue/month/:year", getRevenueByMonth);
router.get("/revenue/year", getRevenueByYear);
router.get("/revenue/category", getRevenueByCategory);
router.delete("/:id", deleteOrder);

module.exports = router;