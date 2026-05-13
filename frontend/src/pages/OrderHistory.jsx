import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    //chưa login → đá về login
    if (!user) {
      alert("Vui lòng đăng nhập để xem đơn hàng!");
      navigate("/login");
      return;
    }
    fetch(`https://my-app-production-f477.up.railway.app/api/order/user/${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng</p>
      ) : (
        orders.map(order => (
          <Link to={`/orders/${order.id}`}>
            <div className="bg-white p-4 rounded shadow mb-3 hover:bg-gray-50 cursor-pointer">
              <p>🆔 Mã đơn: {order.id}</p>
              <p>💰 Tổng tiền: {order.total} VND</p>
              <p>📅 Ngày: {order.created_at}</p>
              <p>📌 Trạng thái: {order.status}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default OrderHistory;