import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`https://my-app-production-f477.up.railway.app/api/order/${id}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [id]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">
        📦 Chi tiết đơn hàng #{id}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {items.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-sm">
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>

              <p className="text-red-500 font-semibold">
                {(item.price * item.quantity).toLocaleString()} VND
              </p>
            </div>
          ))
        )}

        {/* Tổng tiền */}
        <div className="text-right mt-6">
          <p className="text-lg font-bold">
            Tổng: {total.toLocaleString()} VND
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;