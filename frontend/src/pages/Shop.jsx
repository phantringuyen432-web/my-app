import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Shop = () => {

  // =========================
  // STATES
  // =========================
  const [search, setSearch] =
    useState("");

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
          Authorization:
            `Bearer ${token}`
        }
      }
    )
      .then(async res => {

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(
            data.message ||
            "Lỗi tải yêu thích"
          );

        }

        return data;

      })

      .then(data => {

        // lấy product_id
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

    window.location.href = "/";

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

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.message ||
          "Lỗi yêu thích"
        );

        return;

      }

      // backend toggle
      if (
        favorites.includes(productId)
      ) {

        setFavorites(prev =>
          prev.filter(
            id => id !== productId
          )
        );

        toast.info(
          "Đã bỏ yêu thích"
        );

      } else {

        setFavorites(prev => [
          ...prev,
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

            {/* PRODUCTS */}
            {products.length === 0 ? (

              <div className="text-center py-16">

                <div className="text-5xl mb-4">
                  🔎
                </div>

                <div className="text-xl font-semibold text-gray-600">
                  Không tìm thấy sản phẩm
                </div>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                {products.map(p => (

                  <div
                    key={p.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden relative hover:shadow-xl transition"
                  >

                    {/* FAVORITE */}
                    <button
                      onClick={() =>
                        toggleFavorite(
                          p.id
                        )
                      }
                      className="absolute top-3 right-3 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow"
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
                    <div className="p-4 flex flex-col">

                      <h2 className="font-semibold text-lg min-h-[56px]">
                        {p.name}
                      </h2>

                      <p className="text-red-500 font-bold text-xl mt-2">
                        {Number(
                          p.price
                        ).toLocaleString()}{" "}
                        VND
                      </p>

                      <Link
                        to={`/product/${p.id}`}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-xl font-semibold transition"
                      >
                        Xem chi tiết
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            )}

            {/* PAGINATION */}
            {products.length > 0 && (

              <div className="flex justify-center items-center gap-4 mt-10">

                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      prev => prev - 1
                    )
                  }
                  className="bg-blue-500 text-white px-5 py-2 rounded-xl disabled:bg-gray-300"
                >
                  ← Trước
                </button>

                <span className="font-semibold">
                  Trang {currentPage} /{" "}
                  {totalPages}
                </span>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      prev => prev + 1
                    )
                  }
                  className="bg-blue-500 text-white px-5 py-2 rounded-xl disabled:bg-gray-300"
                >
                  Tiếp →
                </button>

              </div>

            )}

          </>

        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 mt-10 py-6 text-center">
        © 2026 SHOP. All rights reserved.
      </footer>

    </div>

  );

};

export default Shop;