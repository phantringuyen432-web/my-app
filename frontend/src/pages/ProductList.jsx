import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductList = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = () => {

    setLoading(true);

    fetch(
      `https://my-app-ne36.onrender.com/api/product?page=${currentPage}&search=${search}`
    )
      .then(res => res.json())

      .then(data => {

        console.log(data);

        setProducts(data.products || []);

        setTotalPages(data.totalPages || 1);

        setLoading(false);

      })

      .catch(err => {

        console.log(err);

        toast.error("Lỗi tải sản phẩm");

        setProducts([]);

        setLoading(false);

      });

  };

  useEffect(() => {

    fetchProducts();

  }, [currentPage, search]);

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này?"
    );

    if (!confirmDelete) return;

    fetch(
      `https://my-app-ne36.onrender.com/api/product/${id}`,
      {
        method: "DELETE"
      }
    )
      .then(res => res.json())

      .then(() => {

        toast.success("Đã xóa sản phẩm");

        fetchProducts();

      })

      .catch(err => {

        console.log(err);

        toast.error("Xóa thất bại");

      });

  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      {/* TITLE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <h1 className="text-4xl font-bold">
          🛍️ Danh sách sản phẩm
        </h1>

        <button
          onClick={() =>
            navigate("/admin/add-product")
          }
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          + Thêm sản phẩm
        </button>

      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">

        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => {

            setSearch(e.target.value);

            setCurrentPage(1);

          }}
          className="w-full border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {products.length === 0 ? (

          <div className="p-10 text-center text-gray-500 text-lg">
            Không tìm thấy sản phẩm
          </div>

        ) : (

          products.map(p => (

            <div
              key={p.id}
              className="border-b p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:bg-gray-50 transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-5">

                <img
                  src={p.image}
                  alt={p.name}
                  className="w-24 h-24 object-cover rounded-2xl border"
                />

                <div className="space-y-2">

                  <p className="text-xl font-bold">
                    {p.name}
                  </p>

                  <p className="text-red-500 font-semibold text-lg">
                    {Number(
                      p.price
                    ).toLocaleString()} VND
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    navigate(
                      `/admin/edit-product/${p.id}`
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl transition"
                >
                  Sửa
                </button>

                <button
                  onClick={() =>
                    handleDelete(p.id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
                >
                  Xóa
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(prev => prev - 1)
            }
            className={`px-5 py-2 rounded-xl font-semibold
            ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            ← Trước
          </button>

          <span className="font-bold">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(prev => prev + 1)
            }
            className={`px-5 py-2 rounded-xl font-semibold
            ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Tiếp →
          </button>

        </div>

      )}

    </div>

  );

};

export default ProductList;