import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Shop = ({ addToCart }) => {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  // fetch categories
  useEffect(() => {

    fetch("http://my-app-production-f477.up.railway.app/api/category")
      .then(res => res.json())
      .then(data => setCategories(data));

  }, []);

  // fetch products
  useEffect(() => {

    let url = "http://my-app-production-f477.up.railway.app/api/product";

    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {

        setProducts(data);

        // reset page khi đổi category
        setCurrentPage(1);

      });

  }, [selectedCategory]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAddToCart = (product) => {

    if (!user) {
      alert("⚠️ Vui lòng đăng nhập!");
      return;
    }

    addToCart(product);

  };

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.reload();

  };

  // pagination logic
  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (

    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-4 shadow-md">

        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">

          {/* LOGO */}
          <h1 className="text-3xl font-extrabold tracking-wide">
            SHOP
          </h1>

          {/* MENU */}
          <div className="flex items-center gap-4">

            {user ? (
              <>
                <span className="font-medium">
                  Xin chào, {user.username}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:underline"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="hover:underline"
                >
                  Đăng ký
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-semibold transition"
            >
              Giỏ hàng
            </Link>

            {user && (
              <Link
                to="/orders"
                className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Đơn hàng
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">

        {/* CATEGORY */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">

          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full font-medium shadow-sm transition
              ${selectedCategory === null
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            Tất cả
          </button>

          {categories.map(cat => (

            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium shadow-sm transition
                ${selectedCategory === cat.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
                }`}
            >
              {cat.name}
            </button>

          ))}

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {currentProducts.map(p => (

            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
            >

              {/* IMAGE */}
              <img
                src={`http://my-app-production-f477.up.railway.app/uploads/${p.image}`}
                alt={p.name}
                className="h-56 w-full object-cover"
              />

              {/* INFO */}
              <div className="p-4 flex flex-col flex-grow">

                <h2 className="font-semibold text-lg line-clamp-2 min-h-[56px]">
                  {p.name}
                </h2>

                <p className="text-red-500 font-bold text-xl mt-3">
                  {Number(p.price).toLocaleString()} VND
                </p>

                {/* BUTTON */}
                <Link
                  to={`/product/${p.id}`}
                  className="mt-auto block text-center bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-xl transition duration-200 font-semibold"
                >
                  Xem chi tiết
                </Link>

              </div>
            </div>

          ))}

        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (

          <div className="flex justify-center items-center gap-4 mt-10">

            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(prev => prev - 1)
              }
              className={`px-5 py-2 rounded-xl font-semibold transition
                ${currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              ← Trước
            </button>

            {/* PAGE */}
            <span className="font-semibold text-lg">
              Trang {currentPage} / {totalPages}
            </span>

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage(prev => prev + 1)
              }
              className={`px-5 py-2 rounded-xl font-semibold transition
                ${currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              Tiếp →
            </button>

          </div>

        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 mt-10">

        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

          {/* SHOP */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              SHOP
            </h2>

            <p className="text-sm leading-6">
              Website bán quần áo thời trang hiện đại,
              hỗ trợ nhiều biến thể sản phẩm như size,
              màu sắc và quản lý tồn kho.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Liên kết
            </h3>

            <ul className="space-y-2">

              <li>
                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Trang chủ
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Giỏ hàng
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  Đơn hàng
                </Link>
              </li>

            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Liên hệ
            </h3>

            <p>Email: shop@gmail.com</p>
            <p>SĐT: 0123 456 789</p>
            <p>Địa chỉ: Việt Nam</p>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-700 py-4 text-center text-sm">
          © 2026 SHOP. All rights reserved.
        </div>

      </footer>

    </div>

  );
};

export default Shop;