import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin</h2>

        <ul className="space-y-3">
          <li className="mt-4 text-gray-400 text-sm">
            Đơn hàng
          </li>
          <li>
            <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded">
              Quản lý đơn hàng
            </Link>
          </li>

          {/* PRODUCT MENU */}
          <li className="mt-4 text-gray-400 text-sm">
            Sản phẩm
          </li>

          <li>
            <Link
              to="/admin/product-list"
              className="block hover:bg-gray-700 p-2 rounded ml-2"
            >
              Danh sách sản phẩm
            </Link>
          </li>

          <li>
            <Link
              to="/admin/add-product"
              className="block hover:bg-gray-700 p-2 rounded ml-2"
            >
              Thêm sản phẩm
            </Link>
          </li>

          <li className="mt-4 text-gray-400 text-sm">
            Khác
          </li>

          <li>
            <Link
              to="/admin/dashboard"
              className="block hover:bg-gray-700 p-2 rounded"
            >
              Thống kê
            </Link>
          </li>

        </ul>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;