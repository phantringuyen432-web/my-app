import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cart, setCart }) => {

  const navigate = useNavigate();

  // tăng số lượng
  const increaseQty = (index) => {

    const newCart = [...cart];

    // không cho vượt tồn kho
    if (newCart[index].quantity >= newCart[index].stock) {

      alert(
        `Chỉ còn ${newCart[index].stock} sản phẩm trong kho`
      );

      return;
    }

    newCart[index].quantity += 1;

    setCart(newCart);
  };

  // giảm số lượng
  const decreaseQty = (index) => {

    const newCart = [...cart];

    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    }

    setCart(newCart);
  };

  // xóa sản phẩm
  const removeItem = (index) => {

    const newCart = cart.filter(
      (_, i) => i !== index
    );

    setCart(newCart);
  };

  // tổng tiền
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (

    <div className="bg-white p-6 rounded-2xl shadow mt-6">

      <h2 className="text-2xl font-bold mb-5">
        🛒 Giỏ hàng
      </h2>

      {cart.length === 0 ? (

        <p className="text-gray-500">
          Chưa có sản phẩm
        </p>

      ) : (

        <>

          {cart.map((item, index) => (

            <div
              key={index}
              className="flex justify-between items-center border-b py-4 gap-4"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* IMAGE */}
                <img
                  src={`https://my-app-production-f477.up.railway.app/uploads/${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                {/* INFO */}
                <div>

                  <p className="font-bold text-lg">
                    {item.name}
                  </p>

                  <p className="text-gray-500">
                    Size: {item.size}
                  </p>

                  <p className="text-gray-500">
                    Màu: {item.color}
                  </p>

                  <p className="text-red-500 font-semibold">
                    {Number(item.price).toLocaleString()} VND
                  </p>

                  <p className="text-sm text-gray-400">
                    Tồn kho: {item.stock}
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* decrease */}
                <button
                  onClick={() => decreaseQty(index)}
                  className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>

                {/* quantity */}
                <span className="font-bold text-lg">
                  {item.quantity}
                </span>

                {/* increase */}
                <button
                  onClick={() => increaseQty(index)}
                  disabled={
                    item.quantity >= item.stock
                  }
                  className={`
                    w-8 h-8 rounded
                    ${
                      item.quantity >= item.stock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }
                  `}
                >
                  +
                </button>

                {/* remove */}
                <button
                  onClick={() => removeItem(index)}
                  className="ml-4 text-red-500 hover:text-red-700 font-bold"
                >
                  X
                </button>

              </div>

            </div>

          ))}

          {/* TOTAL */}
          <div className="mt-6 flex justify-between items-center">

            <h3 className="font-bold text-2xl">
              Tổng:
            </h3>

            <p className="text-2xl font-bold text-red-500">
              {Number(total).toLocaleString()} VND
            </p>

          </div>

          {/* CHECKOUT */}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Thanh toán
          </button>

        </>

      )}

    </div>

  );

};

export default Cart;