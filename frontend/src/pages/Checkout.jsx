import { useState } from "react";

const Checkout = ({ cart, setCart }) => {

  const [orderId, setOrderId] = useState(null);

  const [orderData, setOrderData] = useState(null);

  const [qrUrl, setQrUrl] = useState("");

  // total
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // checkout
  const handleCheckout = () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {

      alert("Vui lòng đăng nhập!");

      return;
    }

    // validate stock
    const invalidItem = cart.find(
      item => item.quantity > item.stock
    );

    if (invalidItem) {

      alert(
        `${invalidItem.name} chỉ còn ${invalidItem.stock} sản phẩm`
      );

      return;
    }

    // data gửi backend
    const orderItems = cart.map(item => ({

      product_id: item.product_id,

      variant_id: item.variant_id,

      quantity: item.quantity,

      price: item.price,

      size: item.size,

      color: item.color

    }));

    fetch("https://my-app-production-f477.up.railway.app/api/order", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        userId: user.id,

        total: total,

        items: orderItems

      })

    })
      .then(res => res.json())
      .then(data => {

        console.log(data);

        // snapshot
        setOrderData({

          items: cart,

          total: total

        });

        setOrderId(data.orderId);

        // clear cart
        setCart([]);

        localStorage.removeItem("cart");

        // QR
        const qr =
          `https://img.vietqr.io/image/BIDV-0339332276-compact.png?amount=${total}&addInfo=DH${data.orderId}`;

        setQrUrl(qr);

      })
      .catch(err => {

        console.log(err);

        alert("Có lỗi xảy ra");

      });
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Thanh toán
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            Sản phẩm của bạn
          </h2>

          {(orderData ? orderData.items : cart).map((item, i) => (

            <div
              key={i}
              className="flex justify-between items-center border-b py-4 gap-4"
            >

              {/* IMAGE + INFO */}
              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div>

                  <p className="font-bold">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Size: {item.size}
                  </p>

                  <p className="text-sm text-gray-500">
                    Màu: {item.color}
                  </p>

                  <p className="text-sm text-gray-500">
                    SL: {item.quantity}
                  </p>

                </div>

              </div>

              {/* PRICE */}
              <p className="text-red-500 font-bold">

                {(
                  item.price * item.quantity
                ).toLocaleString()} VND

              </p>

            </div>

          ))}

        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between">

          <div>

            <h2 className="text-2xl font-semibold mb-6">
              Tổng thanh toán
            </h2>

            <div className="flex justify-between text-xl mb-6">

              <span>Tổng tiền:</span>

              <span className="text-red-500 font-bold">

                {(
                  orderData
                    ? orderData.total
                    : total
                ).toLocaleString()} VND

              </span>

            </div>

          </div>

          {/* BUTTON */}
          {!orderData && (

            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              Xác nhận đặt hàng
            </button>

          )}

          {/* QR */}
          {orderId && (

            <div className="mt-8 text-center">

              <h3 className="font-semibold text-lg mb-3">

                Quét QR để thanh toán đơn #{orderId}

              </h3>

              <img
                src={qrUrl}
                alt="QR"
                className="mx-auto w-56 h-56"
              />

              <p className="text-gray-500 mt-3">

                Nội dung:
                <span className="font-bold">
                  {" "}DH{orderId}
                </span>

              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Checkout;