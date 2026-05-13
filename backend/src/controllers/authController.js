const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mail'); // thêm

// REGISTER + gửi OTP
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  //tạo OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expire = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

  db.query(
    "INSERT INTO users (username, email, password, otp_code, otp_expire, is_verified) VALUES (?, ?, ?, ?, ?, 0)",
    [username, email, hashed, otp, expire],
    async (err) => {
      if (err) return res.status(500).json(err);

      try {
        // gửi mail
        await transporter.sendMail({
          to: email,
          subject: "Mã OTP xác thực",
          text: `Mã OTP của bạn là: ${otp}`
        });

        res.json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để lấy OTP." });

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi gửi email" });
      }
    }
  );
};

// VERIFY OTP
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(400).json({ message: "Email không tồn tại" });

      const user = results[0];

      if (user.otp_code !== otp)
        return res.status(400).json({ message: "OTP sai" });

      if (new Date() > user.otp_expire)
        return res.status(400).json({ message: "OTP đã hết hạn" });

      //cập nhật xác thực
      db.query(
        "UPDATE users SET is_verified = 1 WHERE email = ?",
        [email],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Xác thực thành công!" });
        }
      );
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(400).json({ message: "Sai email" });

      const user = results[0];

      // chưa xác thực thì không cho login
      if (!user.is_verified) {
        return res.status(400).json({
          message: "Vui lòng xác thực email trước"
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Sai mật khẩu" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        "SECRET_KEY",
        { expiresIn: "1d" }
      );

      res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }
  );
};