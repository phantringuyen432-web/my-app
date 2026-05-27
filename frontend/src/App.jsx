import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Admin from "./pages/Admin";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductList from "./pages/ProductList";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import Favorite from "./pages/Favorite";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {

  const [products, setProducts] = useState([]);

  // CART
  const [cart, setCart] = useState(() => {

    const saved = localStorage.getItem("cart");

    return saved ? JSON.parse(saved) : [];

  });

  // lưu cart
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  // load products
  useEffect(() => {

    fetch(
      "https://my-app-ne36.onrender.com/api/product"
    )
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }

      })
      .catch(err => {

        console.log(err);

        setProducts([]);

      });

  }, []);

  // ADD TO CART
  const addToCart = (product) => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    // chưa login
    if (!user) {

      toast.warning(
        "Vui lòng đăng nhập!"
      );

      return;

    }

    const existingIndex = cart.findIndex(
      item =>
        item.variant_id === product.variant_id
    );

    let newCart = [...cart];

    // variant đã tồn tại
    if (existingIndex !== -1) {

      // check stock
      if (
        newCart[existingIndex].quantity >=
        newCart[existingIndex].stock
      ) {

        toast.warning(
          `Chỉ còn ${newCart[existingIndex].stock} sản phẩm`
        );

        return;

      }

      // tăng quantity
      newCart[existingIndex].quantity += 1;

    }

    // variant chưa tồn tại
    else {

      newCart.push({
        ...product,
        quantity: 1
      });

    }

    // update state
    setCart(newCart);

    // toast
    toast.success(
      `Đã thêm "${product.name}" vào giỏ`
    );

  };

  return (

    <>

      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

      {/* ROUTES */}
      <Routes>

        {/* SHOP */}
        <Route
          path="/"
          element={
            <Shop
              products={products}
              addToCart={addToCart}
            />
          }
        />

        {/* PRODUCT DETAIL */}
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              addToCart={addToCart}
            />
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify"
          element={<VerifyOTP />}
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={<OrderHistory />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetail />}
        />

        <Route 
          path="/favorites" 
          element={<Favorite />} 
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* dashboard đơn hàng */}
          <Route
            index
            element={<Admin />}
          />

          {/* dashboard doanh thu */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* product list */}
          <Route
            path="product-list"
            element={<ProductList />}
          />

          {/* add product */}
          <Route
            path="add-product"
            element={<AddProduct />}
          />

          {/* edit product */}
          <Route
            path="edit-product/:id"
            element={<EditProduct />}
          />

        </Route>

      </Routes>

    </>

  );

}

export default App;