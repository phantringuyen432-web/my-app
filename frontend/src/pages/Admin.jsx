import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        return (
            <h1 className="text-center mt-10 text-red-500">
            Không có quyền truy cập
            </h1>
        );
    }
  // load danh sách đơn
  const fetchOrders = () => {
    fetch("http://my-app-production-f477.up.railway.app/api/order/admin/all")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // update trạng thái
  const updateStatus = (id, status) => {
    fetch(`https://my-app-production-f477.up.railway.app/api/order/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(() => {
        alert("Đã cập nhật!");
        fetchOrders(); // reload
      });
  };

  const location = useLocation();

return (
  <div className="flex min-h-screen bg-gray-100">

    {/* CONTENT */}
    <div className="flex-1 p-10">
      <h1 className="text-3xl font-bold mb-6">
        Quản lý đơn hàng
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        {orders.map(order => (
          <div
            key={order.id}
            className="border-b py-4 flex justify-between items-center"
          >
            <div>
              <p>🆔 #{order.id}</p>
              <p>👤 {order.username}</p>
              <p>💰 {order.total.toLocaleString()} VND</p>
              <p>📌 {order.status}</p>
            </div>

            <div className="flex gap-2">
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order.id, "paid")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                >
                  Xác nhận thanh toán
                </button>
              )}

              {order.status === "paid" && (
                <span className="text-green-600 font-semibold">
                  ✔ Đã thanh toán
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);
};

export default Admin;