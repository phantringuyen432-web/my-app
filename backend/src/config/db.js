const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.connect()
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((err) => {
    console.log("PostgreSQL connection failed:", err);
  });

// Prevent app crash
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
});

module.exports = pool;