import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";

const Dashboard = () => {
  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);

  useEffect(() => {
    fetch("https://my-app-ne36.onrender.com/api/order/revenue/month/2026")
      .then(res => res.json())
      .then(data => setMonthData(data));

    fetch("https://my-app-ne36.onrender.com/api/order/revenue/year")
      .then(res => res.json())
      .then(data => setYearData(data));
  }, []);

  // tổng doanh thu
  const totalRevenue = yearData.reduce(
    (sum, item) => sum + Number(item.revenue),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        📊 Thống kê doanh thu
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* TOTAL REVENUE */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full">
            <FaMoneyBillWave className="text-3xl text-green-600" />
          </div>

          <div>
            <p className="text-gray-500">Tổng doanh thu</p>

            <h2 className="text-3xl font-bold text-green-600">
              {totalRevenue.toLocaleString()} VND
            </h2>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <FaShoppingCart className="text-3xl text-blue-600" />
          </div>

          <div>
            <p className="text-gray-500">Số mốc doanh thu</p>

            <h2 className="text-3xl font-bold text-blue-600">
              {monthData.length}
            </h2>
          </div>
        </div>
      </div>

      {/* CHART THEO THÁNG */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
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

      {/* CHART THEO NĂM */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          📆 Doanh thu theo năm
        </h2>

        <div className="w-full h-[400px]">
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