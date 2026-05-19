const jwt = require("jsonwebtoken");

// VERIFY TOKEN
exports.verifyToken = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    // không có token
    if (!authHeader) {

      return res.status(401).json({
        message: "Không có token"
      });

    }

    // tách Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // lưu user vào req
    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Token không hợp lệ"
    });

  }

};

// CHECK ADMIN
exports.isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({
      message: "Không có quyền admin"
    });

  }

  next();

};