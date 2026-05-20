const express = require('express');
const router = express.Router();

const { register, login, verifyOTP, getUsers} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyOTP);
router.get("/users", getUsers);

module.exports = router;