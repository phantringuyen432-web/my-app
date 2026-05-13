const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'nguyen',
  password: '12345',
  database: 'shop_app'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối DB:', err);
  } else {
    console.log('Kết nối MySQL thành công');
  }
});

module.exports = db;