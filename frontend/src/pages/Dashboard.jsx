import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers
} from "react-icons/fa";

const Dashboard = () => {

  // =========================
  // STATES
  // =========================
  const [monthData, setMonthData] = useState([]);

  const [yearData, setYearData] = useState([]);

  const [products, setProducts] = useState([]);

  const [users, setUsers] = useState([]);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    const fetchData = async () => {

      try {

        const [
          monthRes,
          yearRes,
          productRes,
          userRes,
          orderRes
        ] = await Promise.all([

          fetch(
            "https://my-app-ne36.onrender.com/api/order/revenue/month/2026"
          ),

          fetch(
            "https://my-app-ne36.onrender.com/api/order/revenue/year"
          ),

          fetch(
            "https://my-app-ne36.onrender.com/api/product"
          ),

          fetch(
            "https://my-app-ne36.onrender.com/api/auth/users"
          ),

          fetch(
            "https://my-app-ne36.onrender.com/api/order"
          )

        ]);

        const month = await monthRes.json();

        const year = await yearRes.json();

        const product = await productRes.json();

        const user = await userRes.json();

        const order = await orderRes.json();

        // revenue
        setMonthData(month);

        setYearData(year);

        // products
        if (Array.isArray(product.products)) {

          setProducts(product.products);

        } else {

          setProducts(product);

        }

        // users
        setUsers(user);

        // orders
        setOrders(order);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);

  // =========================
  // TOTALS
  // =========================
  const totalRevenue = yearData.reduce(
    (sum, item) =>
      sum + Number(item.revenue),
    0
  );

  const totalOrders = orders.length;

  const totalProducts = products.length;

  const totalUsers = users.length;

  // =========================
  // PIE DATA
  // =========================
  const pieData = [
    {
      name: "Products",
      value: totalProducts
    },
    {
      name: "Orders",
      value: totalOrders
    },
    {
      name: "Users",
      value: totalUsers
    }
  ];

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B"
  ];

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold mb-2">
          📊 Admin Dashboard
        </h1>

        <p className="text-gray-500 text-lg">
          Tổng quan hệ thống bán hàng
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {/* REVENUE */}
        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 hover:shadow-xl transition">

          <div className="bg-green-100 p-5 rounded-full">

            <FaMoneyBillWave className="text-4xl text-green-600" />

          </div>

          <div>

            <p className="text-gray-500">
              Tổng doanh thu
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {totalRevenue.toLocaleString()} VND
            </h2>

          </div>

        </div>

        {/* ORDERS */}
        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 hover:shadow-xl transition">

          <div className="bg-blue-100 p-5 rounded-full">

            <FaShoppingCart className="text-4xl text-blue-600" />

          </div>

          <div>

            <p className="text-gray-500">
              Tổng đơn hàng
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {totalOrders}
            </h2>

          </div>

        </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 hover:shadow-xl transition">

          <div className="bg-yellow-100 p-5 rounded-full">

            <FaBoxOpen className="text-4xl text-yellow-600" />

          </div>

          <div>

            <p className="text-gray-500">
              Tổng sản phẩm
            </p>

            <h2 className="text-3xl font-bold text-yellow-600">
              {totalProducts}
            </h2>

          </div>

        </div>

        {/* USERS */}
        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 hover:shadow-xl transition">

          <div className="bg-purple-100 p-5 rounded-full">

            <FaUsers className="text-4xl text-purple-600" />

          </div>

          <div>

            <p className="text-gray-500">
              Tổng users
            </p>

            <h2 className="text-3xl font-bold text-purple-600">
              {totalUsers}
            </h2>

          </div>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

        {/* MONTH CHART */}
        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            📅 Doanh thu theo tháng
          </h2>

          <div className="w-full h-[400px]">

            <ResponsiveContainer>

              <BarChart data={monthData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis
                  tickFormatter={(value) =>
                    value.toLocaleString()
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString()} VND`
                  }
                />

                <Bar
                  dataKey="revenue"
                  fill="#3B82F6"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            📦 Thống kê hệ thống
          </h2>

          <div className="w-full h-[400px]">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="value"
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* YEAR CHART */}
      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          📆 Doanh thu theo năm
        </h2>

        <div className="w-full h-[450px]">

          <ResponsiveContainer>

            <BarChart data={yearData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="year" />

              <YAxis
                tickFormatter={(value) =>
                  value.toLocaleString()
                }
              />

              <Tooltip
                formatter={(value) =>
                  `${Number(value).toLocaleString()} VND`
                }
              />

              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;