import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import AdminLayout from "./components/AdminLayout";
import EditProduct from "./pages/EditProduct"
import ProductList from"./pages/ProductList"
import Dashboard from "./pages/Dashboard"
import ProductDetail from "./pages/ProductDetail";

function App() {
  const [products, setProducts] = useState([]);
  //Thông báo
  const [message, setMessage] = useState("");
  //Lưu Cart khi reload
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {

    const existingIndex = cart.findIndex(
      item =>
        item.variant_id === product.variant_id
    );

    let newCart = [...cart];

    // nếu variant đã tồn tại
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

    // nếu chưa tồn tại
    else {

      newCart.push({
        ...product,
        quantity: 1
      });

    }

    // update state
    setCart(newCart);

    // thông báo
    setMessage(
      `Đã thêm "${product.name}" vào giỏ`
    );

    setTimeout(() => {
      setMessage("");
    }, 2000);

  };

  useEffect(() => {
    fetch("https://my-app-ne36.onrender.com/api/product")// trùng với dòng bên backend index.js
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
  <>
    {/* THÔNG BÁO */}
    {message && (
      <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        {message}
      </div>
    )}

    {/* ROUTER */}
    <Routes> 
      {/* Routes của product */}
      <Route 
        path="/" 
        element={<Shop products={products} addToCart={addToCart} />} 
      />
      {/* Routes của giỏ hàng */}
      <Route 
        path="/cart" 
        element={<CartPage cart={cart} setCart={setCart} />} 
      />
      {/* Routes của Checkout */}
      <Route
        path="/checkout"
        element={<Checkout cart={cart} setCart={setCart} />}
      />
      {/* Routes của Login */}
      <Route path="/login" element={<Login />} />
      {/* Routes của Register */}
      <Route path="/register" element={<Register />} /> 
      {/* Routes của Verify */}
      <Route path="/verify" element={<VerifyOTP />} />
      {/* Routes của OrderHistory */}
      <Route path="/orders" element={<OrderHistory />} />
      
      <Route path="/orders/:id" element={<OrderDetail />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/product/:id" element={
          <ProductDetail addToCart={addToCart} />
      } />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* /admin */}
        <Route index element={<Admin />} />

        {/* /admin/add-product */}
        <Route path="add-product" element={<AddProduct />} />
        <Route path="product-list" element={<ProductList />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </>
  );
}

export default App;