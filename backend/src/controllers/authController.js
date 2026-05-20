const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendOTP = require("../config/mail");

// ============================
// REGISTER + GỬI OTP
// ============================
exports.register = async (req, res) => {

  try {

    const {
      username,
      email,
      password
    } = req.body;

    // kiểm tra email tồn tại
    const checkUser = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (checkUser.rows.length > 0) {

      return res.status(400).json({
        message: "Email đã tồn tại"
      });

    }

    // hash password
    const hashed = await bcrypt.hash(
      password,
      10
    );

    // tạo OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // hết hạn 5 phút
    const expire = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // insert user
    await db.query(
      `
      INSERT INTO users
      (
        username,
        email,
        password,
        otp_code,
        otp_expire,
        is_verified
      )
      VALUES ($1, $2, $3, $4, $5, false)
      `,
      [
        username,
        email,
        hashed,
        otp,
        expire
      ]
    );

    // gửi OTP
    await sendOTP(email, otp);

    res.json({

      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để lấy OTP."

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// VERIFY OTP
// ============================
exports.verifyOTP = async (req, res) => {

  try {

    const {
      email,
      otp
    } = req.body;

    const result = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(400).json({
        message: "Email không tồn tại"
      });

    }

    const user = result.rows[0];

    // kiểm tra OTP
    if (
      String(user.otp_code) !== String(otp)
    ) {

      return res.status(400).json({
        message: "OTP sai"
      });

    }

    // kiểm tra hết hạn
    if (
      new Date() >
      new Date(user.otp_expire)
    ) {

      return res.status(400).json({
        message: "OTP đã hết hạn"
      });

    }

    // cập nhật verified
    await db.query(
      `
      UPDATE users
      SET is_verified = true,
          otp_code = null,
          otp_expire = null
      WHERE email = $1
      `,
      [email]
    );

    res.json({
      message: "Xác thực thành công!"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};

// ============================
// LOGIN
// ============================
exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // tìm user
    const results = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    // không tồn tại
    if (results.rows.length === 0) {

      return res.status(400).json({
        message: "Sai email"
      });

    }

    const user = results.rows[0];

    // chưa verify
    if (!user.is_verified) {

      return res.status(400).json({
        message:
          "Vui lòng xác thực email trước"
      });

    }

    // kiểm tra password
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {

      return res.status(400).json({
        message: "Sai mật khẩu"
      });

    }

    // tạo token
    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    const token = jwt.sign(

      {
        id: user.id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
      }

    );

    // response
    res.json({

      message: "Đăng nhập thành công",

      token,

      user: {

        id: user.id,

        username: user.username,

        email: user.email,

        role: user.role

      }

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};
// ============================
// GET ALL USERS
// ============================
exports.getUsers = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
        id,
        username,
        email,
        role
      FROM users
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server"
    });

  }

};