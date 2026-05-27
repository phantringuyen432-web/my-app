require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// LOAD MAIL
require("./config/mail");

const app = express();

// ROUTES
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use(cors());
app.use(express.json());

// STATIC
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// API ROUTES
app.use(
  "/api/product",
  productRoutes
);

app.use(
  "/api/order",
  orderRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/category",
  categoryRoutes
);

app.use(
  "/api/favorite",
  favoriteRoutes
);

// TEST
app.get("/", (req, res) => {

  res.send("API is running");

});

// SERVER
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});