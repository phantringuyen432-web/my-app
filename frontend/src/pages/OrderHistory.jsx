import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://my-app-ne36.onrender.com/api/order/user/${user.id}`
    )
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Lịch sử đơn hàng
        </h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-5 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="h-5 bg-gray-300 rounded w-1/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (

    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <p className="text-gray-500 text-lg">
            Chưa có đơn hàng
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {orders.map(order => (

            <Link
              key={order.id}
              to={`/orders/${order.id}`}
            >

              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-lg">
                    🆔 Đơn hàng #{order.id}
                  </p>
                  <span
                    className={`
                      px-4 py-1 rounded-full text-sm font-semibold
                      ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-red-500 font-bold text-xl mb-2">
                  💰 {Number(order.total).toLocaleString()} VND
                </p>
                <p className="text-gray-500">
                  📅 {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;