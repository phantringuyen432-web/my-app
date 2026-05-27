import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Shop = () => {

  // =========================
  // STATES
  // =========================
  const [search, setSearch] = useState("");

  const [categories, setCategories] =
    useState([]);

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState(null);

  const [products, setProducts] =
    useState([]);

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const productsPerPage = 6;

  // =========================
  // USER
  // =========================
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token =
    localStorage.getItem("token");

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {

    fetch(
      "https://my-app-ne36.onrender.com/api/category"
    )
      .then(res => res.json())

      .then(data => {

        setCategories(data || []);

      })

      .catch(err => {

        console.log(err);

      });

  }, []);

  // =========================
  // FETCH FAVORITES
  // =========================
  useEffect(() => {

    if (!token) return;

    fetch(
      "https://my-app-ne36.onrender.com/api/favorite",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => res.json())

      .then(data => {

        const ids = data.map(
          item => item.product_id
        );

        setFavorites(ids);

      })

      .catch(err => {

        console.log(err);

      });

  }, [token]);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {

    let url =
      "https://my-app-ne36.onrender.com/api/product";

    const queryParams = [];

    // CATEGORY
    if (selectedCategory) {

      queryParams.push(
        `category=${selectedCategory}`
      );

    }

    // SEARCH
    if (search.trim()) {

      queryParams.push(
        `search=${encodeURIComponent(
          search
        )}`
      );

    }

    // PAGINATION
    queryParams.push(
      `page=${currentPage}`
    );

    queryParams.push(
      `limit=${productsPerPage}`
    );

    // BUILD URL
    if (queryParams.length > 0) {

      url += `?${queryParams.join("&")}`;

    }

    setLoading(true);

    fetch(url)
      .then(res => res.json())

      .then(data => {

        setProducts(
          data.products || []
        );

        setTotalPages(
          data.totalPages || 1
        );

        setLoading(false);

      })

      .catch(err => {

        console.log(err);

        setProducts([]);

        setLoading(false);

      });

  }, [
    selectedCategory,
    search,
    currentPage
  ]);

  // =========================
  // RESET PAGE
  // =========================
  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    selectedCategory
  ]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    window.location.reload();

  };

  // =========================
  // TOGGLE FAVORITE
  // =========================
  const toggleFavorite = async (
    productId
  ) => {

    if (!token) {

      toast.warning(
        "Vui lòng đăng nhập"
      );

      return;

    }

    try {

      const res = await fetch(
        "https://my-app-ne36.onrender.com/api/favorite",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            product_id: productId
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        toast.error(
          data.message ||
          "Lỗi yêu thích"
        );

        return;

      }

      // update UI
      if (
        favorites.includes(productId)
      ) {

        setFavorites(
          favorites.filter(
            id => id !== productId
          )
        );

        toast.info(
          "Đã bỏ yêu thích"
        );

      } else {

        setFavorites([
          ...favorites,
          productId
        ]);

        toast.success(
          "Đã thêm yêu thích"
        );

      }

    } catch (err) {

      console.log(err);

      toast.error(
        "Có lỗi xảy ra"
      );

    }

  };

  // =========================
  // UI
  // =========================
  return (

    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* ================= HEADER ================= */}
      <div className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-4 shadow-md">

        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">

          {/* LOGO */}
          <h1 className="text-3xl font-extrabold tracking-wide">
            SHOP
          </h1>

          {/* MENU */}
          <div className="flex items-center gap-4 flex-wrap">

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
              to="/favorites"
              className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-xl font-semibold transition"
            >
              Yêu thích
            </Link>

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

      {/* ================= CONTENT ================= */}
      <div className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">

        {/* CATEGORY */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">

          <button
            onClick={() =>
              setSelectedCategory(null)
            }
            className={`
              px-5 py-2 rounded-full font-medium shadow-sm transition
              ${
                selectedCategory === null
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            Tất cả
          </button>

          {categories.map(cat => (

            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(cat.id)
              }
              className={`
                px-5 py-2 rounded-full font-medium shadow-sm transition
                ${
                  selectedCategory === cat.id
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }
              `}
            >
              {cat.name}
            </button>

          ))}

        </div>

        {/* SEARCH */}
        <div className="mb-6">

          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-xl shadow-sm"
          />

        </div>

        {/* ================= LOADING ================= */}
        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {[...Array(6)].map(
              (_, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
                >

                  <div className="h-56 bg-gray-300"></div>

                  <div className="p-4">

                    <div className="h-6 bg-gray-300 rounded mb-4"></div>

                    <div className="h-6 w-1/2 bg-gray-300 rounded mb-6"></div>

                    <div className="h-12 bg-gray-300 rounded-xl"></div>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <>

            {/* ================= PRODUCTS ================= */}
            {products.length === 0 ? (

              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl">
                  🔎
                </div>

                <div className="mt-4 text-gray-600 font-semibold text-lg">
                  Không tìm thấy sản phẩm
                </div>

                <div className="mt-2 text-gray-500 text-sm">
                  Thử đổi từ khóa hoặc chọn danh mục khác.
                </div>
              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                {products.map(p => (

                  <div
                    key={p.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col relative"
                  >

                    {/* FAVORITE */}
                    <button
                      onClick={() =>
                        toggleFavorite(
                          p.id
                        )
                      }
                      className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white w-10 h-10 rounded-full shadow flex items-center justify-center text-2xl transition"
                    >
                      {favorites.includes(
                        p.id
                      )
                        ? "❤️"
                        : "🤍"}
                    </button>

                    {/* IMAGE */}
                    <img
                      src={
                        p.images?.[0] ||
                        "https://via.placeholder.com/500x500?text=No+Image"
                      }
                      alt={p.name}
                      className="h-56 w-full object-cover"
                    />

                    {/* INFO */}
                    <div className="p-4 flex flex-col flex-grow">

                      <h2 className="font-semibold text-lg line-clamp-2 min-h-[56px]">
                        {p.name}
                      </h2>

                      <p className="text-red-500 font-bold text-xl mt-3">
                        {Number(
                          p.price
                        ).toLocaleString()}{" "}
                        VND
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

            )}

            {/* ================= PAGINATION ================= */}
            {products.length > 0 && (

              <div className="flex justify-center items-center gap-4 mt-10 flex-wrap">

                {/* PREV */}
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      prev => prev - 1
                    )
                  }
                  className={`
                    px-5 py-2 rounded-xl font-semibold transition
                    ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }
                  `}
                >
                  ← Trước
                </button>

                {/* PAGE */}
                <span className="font-semibold text-lg">
                  Trang {currentPage} /{" "}
                  {totalPages}
                </span>

                {/* NEXT */}
                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      prev => prev + 1
                    )
                  }
                  className={`
                    px-5 py-2 rounded-xl font-semibold transition
                    ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }
                  `}
                >
                  Tiếp →
                </button>

              </div>

            )}

          </>

        )}

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 mt-10">

        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

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
                  to="/favorites"
                  className="hover:text-white transition"
                >
                  Yêu thích
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

            </ul>

          </div>

          <div>

            <h3 className="text-xl font-semibold text-white mb-4">
              Liên hệ
            </h3>

            <p>Email: shop@gmail.com</p>

            <p>SĐT: 0123 456 789</p>

            <p>Địa chỉ: Việt Nam</p>

          </div>

        </div>

        <div className="border-t border-gray-700 py-4 text-center text-sm">
          © 2026 SHOP. All rights reserved.
        </div>

      </footer>

    </div>

  );

};

export default Shop;