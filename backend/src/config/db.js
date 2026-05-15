const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.log("PostgreSQL connection failed:", err);
  } else {
    console.log("PostgreSQL connected");
  }
});

module.exports = pool;