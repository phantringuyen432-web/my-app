import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = ({ cart, setCart }) => {

  const navigate = useNavigate();

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQty = (index) => {

    const newCart = [...cart];

    // CHECK STOCK
    if (
      newCart[index].quantity >=
      newCart[index].stock
    ) {

      toast.warning(
        `Chỉ còn ${newCart[index].stock} sản phẩm trong kho`
      );

      return;

    }

    newCart[index].quantity += 1;

    setCart(newCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );

  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQty = (index) => {

    const newCart = [...cart];

    if (
      newCart[index].quantity > 1
    ) {

      newCart[index].quantity -= 1;

    }

    setCart(newCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );

  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (index) => {

    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa sản phẩm này?"
      );

    if (!confirmDelete) return;

    const newCart = cart.filter(
      (_, i) => i !== index
    );

    setCart(newCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );

    toast.success(
      "Đã xóa sản phẩm"
    );

  };

  // =========================
  // TOTAL
  // =========================
  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

  // =========================
  // EMPTY CART
  // =========================
  const clearCart = () => {

    const confirmClear =
      window.confirm(
        "Bạn có chắc muốn xóa toàn bộ giỏ hàng?"
      );

    if (!confirmClear) return;

    setCart([]);

    localStorage.removeItem("cart");

    toast.success(
      "Đã xóa toàn bộ giỏ hàng"
    );

  };

  // =========================
  // EMPTY UI
  // =========================
  if (cart.length === 0) {

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md w-full">

          <div className="text-7xl mb-5">
            🛒
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Giỏ hàng trống
          </h2>

          <p className="text-gray-500 mb-6">
            Hãy thêm sản phẩm vào giỏ hàng của bạn
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Mua sắm ngay
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <h1 className="text-4xl font-bold">
            🛒 Giỏ hàng
          </h1>

          <button
            onClick={clearCart}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            Xóa tất cả
          </button>

        </div>

        {/* CART */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          {cart.map((item, index) => (

            <div
              key={index}
              className="border-b p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:bg-gray-50 transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-5">

                {/* IMAGE */}
                <img
                  src={
                    item.image ||
                    "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-2xl border"
                />

                {/* INFO */}
                <div className="space-y-2">

                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      Size: {item.size}
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      Màu: {item.color}
                    </span>

                  </div>

                  <p className="text-red-500 font-bold text-xl">
                    {Number(
                      item.price
                    ).toLocaleString()}{" "}
                    VND
                  </p>

                  <p className="text-sm text-gray-500">
                    Tồn kho: {item.stock}
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-4">

                {/* QUANTITY */}
                <div className="flex items-center gap-3">

                  {/* DECREASE */}
                  <button
                    onClick={() =>
                      decreaseQty(index)
                    }
                    className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 text-xl font-bold transition"
                  >
                    -
                  </button>

                  {/* QTY */}
                  <span className="font-bold text-xl w-8 text-center">
                    {item.quantity}
                  </span>

                  {/* INCREASE */}
                  <button
                    onClick={() =>
                      increaseQty(index)
                    }
                    disabled={
                      item.quantity >=
                      item.stock
                    }
                    className={`
                      w-10 h-10 rounded-xl text-xl font-bold transition
                      ${
                        item.quantity >=
                        item.stock
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300"
                      }
                    `}
                  >
                    +
                  </button>

                </div>

                {/* SUBTOTAL */}
                <p className="font-bold text-lg text-blue-600">
                  {(item.price *
                    item.quantity
                  ).toLocaleString()}{" "}
                  VND
                </p>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeItem(index)
                  }
                  className="text-red-500 hover:text-red-700 font-semibold transition"
                >
                  Xóa sản phẩm
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* TOTAL */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>

            <h2 className="text-2xl font-bold mb-2">
              Tổng thanh toán
            </h2>

            <p className="text-gray-500">
              {cart.length} sản phẩm
            </p>

          </div>

          <div className="text-right">

            <p className="text-4xl font-bold text-red-500">
              {Number(total).toLocaleString()}{" "}
              VND
            </p>

          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">

          {/* BACK */}
          <button
            onClick={() =>
              navigate("/")
            }
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-4 rounded-2xl text-lg font-semibold transition"
          >
            ← Tiếp tục mua sắm
          </button>

          {/* CHECKOUT */}
          <button
            onClick={() =>
              navigate("/checkout")
            }
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold transition"
          >
            Thanh toán
          </button>

        </div>

      </div>

    </div>

  );

};

export default Cart;