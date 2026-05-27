import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

const Favorite = () => {

  // =========================
  // STATES
  // =========================
  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // TOKEN
  // =========================
  const token =
    localStorage.getItem("token");

  // =========================
  // FETCH FAVORITES
  // =========================
  useEffect(() => {

    if (!token) {

      setLoading(false);

      return;

    }

    fetch(
      "https://my-app-ne36.onrender.com/api/favorite",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(async res => {

        const data = await res.json();

        if (!res.ok) {

          throw new Error(
            data.message || "Lỗi tải yêu thích"
          );

        }

        return data;

      })

      .then(data => {

        setFavorites(data || []);

        setLoading(false);

      })

      .catch(err => {

        console.log(err);

        toast.error(
          err.message ||
          "Lỗi tải danh sách yêu thích"
        );

        setLoading(false);

      });

  }, [token]);

  // =========================
  // REMOVE FAVORITE
  // =========================
  const removeFavorite = async (
    productId
  ) => {

    try {

      const res = await fetch(
        `https://my-app-ne36.onrender.com/api/favorite/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {

        toast.error(
          data.message || "Lỗi"
        );

        return;

      }

      // UPDATE UI
      setFavorites(prev =>
        prev.filter(
          item => item.id !== productId
        )
      );

      toast.success(
        "Đã bỏ yêu thích"
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Lỗi server"
      );

    }

  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen bg-gray-100 p-10">

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

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

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <div className="flex items-center justify-between mb-8">

          <h1 className="text-4xl font-bold">
            ❤️ Sản phẩm yêu thích
          </h1>

          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            ← Quay lại shop
          </Link>

        </div>

        {/* EMPTY */}
        {favorites.length === 0 ? (

          <div className="bg-white rounded-3xl shadow p-16 text-center">

            <div className="text-6xl mb-4">
              💔
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              Chưa có sản phẩm yêu thích
            </h2>

            <p className="text-gray-500 mt-3">
              Hãy thêm sản phẩm bạn thích vào danh sách yêu thích.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {favorites.map(item => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition overflow-hidden flex flex-col"
              >

                {/* IMAGE */}
                <img
                  src={
                    item.images?.[0] ||

                    "https://via.placeholder.com/500x500?text=No+Image"
                  }
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />

                {/* INFO */}
                <div className="p-4 flex flex-col flex-grow">

                  <h2 className="font-bold text-lg line-clamp-2 min-h-[56px]">
                    {item.name}
                  </h2>

                  <p className="text-red-500 font-bold text-2xl mt-3">
                    {Number(
                      item.price
                    ).toLocaleString()}{" "}
                    VND
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-auto flex gap-3 pt-5">

                    <Link
                      to={`/product/${item.id}`}
                      className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                      Xem chi tiết
                    </Link>

                    <button
                      onClick={() =>
                        removeFavorite(
                          item.id
                        )
                      }
                      className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                    >
                      ♥
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default Favorite;