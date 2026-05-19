import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Admin = () => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // FILTER STATUS
  const [statusFilter, setStatusFilter] =
    useState("all");

  // SEARCH ORDER
  const [search, setSearch] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // check admin
  if (!user || user.role !== "admin") {

    return (
      <h1 className="text-center mt-10 text-red-500 text-2xl">
        Không có quyền truy cập
      </h1>
    );

  }

  // LOAD ORDERS
  const fetchOrders = () => {

    setLoading(true);

    fetch(
      "https://my-app-ne36.onrender.com/api/order/admin/all"
    )
      .then(res => res.json())
      .then(data => {

        setOrders(data);

        setLoading(false);

      })
      .catch(err => {

        console.log(err);

        toast.error("Lỗi tải đơn hàng");

        setLoading(false);

      });

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  // UPDATE STATUS
  const updateStatus = (id, status) => {

    fetch(
      `https://my-app-ne36.onrender.com/api/order/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ status })
      }
    )
      .then(res => res.json())
      .then(() => {

        toast.success("Đã cập nhật trạng thái!");

        fetchOrders();

      })
      .catch(err => {

        console.log(err);

        toast.error("Cập nhật thất bại");

      });

  };

  // DELETE ORDER
  const deleteOrder = (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa đơn hàng?"
    );

    if (!confirmDelete) return;

    fetch(
      `https://my-app-ne36.onrender.com/api/order/${id}`,
      {
        method: "DELETE"
      }
    )
      .then(res => res.json())
      .then(() => {

        toast.success("Đã xóa đơn hàng!");

        fetchOrders();

      })
      .catch(err => {

        console.log(err);

        toast.error("Xóa thất bại");

      });

  };

  // FILTER + SEARCH
  const filteredOrders = orders.filter(order => {

    // filter trạng thái
    const matchStatus =
      statusFilter === "all"
        ? true
        : order.status === statusFilter;

    // search mã đơn
    const matchSearch =
      order.id
        .toString()
        .includes(search);

    return matchStatus && matchSearch;

  });

  // LOADING
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
      <h1 className="text-4xl font-bold mb-8">
        📦 Quản lý đơn hàng
      </h1>

      {/* FILTER + SEARCH */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6 flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Tìm theo mã đơn..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border px-4 py-3 rounded-xl flex-1"
        />

        {/* FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="border px-4 py-3 rounded-xl"
        >

          <option value="all">
            Tất cả
          </option>

          <option value="pending">
            Chờ xác nhận
          </option>

          <option value="confirmed">
            Đã xác nhận
          </option>

          <option value="shipping">
            Đang giao
          </option>

          <option value="completed">
            Hoàn thành
          </option>

          <option value="cancelled">
            Đã hủy
          </option>

        </select>

      </div>

      {/* ORDERS */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {filteredOrders.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            Không tìm thấy đơn hàng
          </div>

        ) : (

          filteredOrders.map(order => (

            <div
              key={order.id}
              className="border-b p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            >

              {/* LEFT */}
              <div className="space-y-2">

                <p className="font-bold text-lg">
                  🆔 Đơn hàng #{order.id}
                </p>

                <p>
                  👤 Khách hàng:
                  <span className="font-semibold ml-2">
                    {order.username}
                  </span>
                </p>

                <p>
                  💰 Tổng tiền:
                  <span className="text-red-500 font-bold ml-2">
                    {Number(order.total).toLocaleString()} VND
                  </span>
                </p>

                <p>
                  📌 Trạng thái:

                  <span
                    className={`
                      ml-2 font-semibold
                      ${
                        order.status === "pending"
                          ? "text-yellow-500"
                          : order.status === "confirmed"
                          ? "text-blue-500"
                          : order.status === "shipping"
                          ? "text-purple-500"
                          : order.status === "completed"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    `}
                  >

                    {
                      order.status === "pending"
                        ? "Chờ xác nhận"
                        : order.status === "confirmed"
                        ? "Đã xác nhận"
                        : order.status === "shipping"
                        ? "Đang giao"
                        : order.status === "completed"
                        ? "Hoàn thành"
                        : "Đã hủy"
                    }

                  </span>

                </p>

              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap gap-3 items-center">

                {/* STATUS SELECT */}
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(
                      order.id,
                      e.target.value
                    )
                  }
                  className="border px-4 py-2 rounded-xl"
                >

                  <option value="pending">
                    Chờ xác nhận
                  </option>

                  <option value="confirmed">
                    Đã xác nhận
                  </option>

                  <option value="shipping">
                    Đang giao
                  </option>

                  <option value="completed">
                    Hoàn thành
                  </option>

                  <option value="cancelled">
                    Đã hủy
                  </option>

                </select>

                {/* DELETE */}
                {order.status === "completed" && (

                  <button
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                  >
                    Xóa đơn
                  </button>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default Admin;