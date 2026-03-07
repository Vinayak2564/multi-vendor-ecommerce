import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
    };

    fetchDashboard();
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Vendor Dashboard
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your store performance and earnings.
            </p>
          </div>

          <button
            onClick={() => navigate("/vendor/withdrawals")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg transition transform hover:-translate-y-1"
          >
            Request Withdrawal
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <Card title="Orders" value={stats.totalOrders} />
          <Card title="Revenue" value={`₹${stats.totalRevenue}`} />
          <Card title="Commission" value={`₹${stats.totalCommission}`} />
          <Card title="Earnings" value={`₹${stats.totalEarnings}`} />
          <Card
            title="Wallet Balance"
            value={`₹${stats.walletBalance || 0}`}
            highlight
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-700 text-xl">
              Recent Orders
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-left">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-4 font-medium text-slate-700">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      ₹{order.totalPrice}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {stats.recentOrders.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                No recent orders
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* components */

function Card({ title, value, highlight }) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-md border transition hover:shadow-xl hover:-translate-y-1 ${
        highlight
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white border-slate-100"
      }`}
    >
      <p
        className={`text-sm ${
          highlight ? "text-indigo-100" : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold capitalize";

  const styles = {
    processing: `${base} bg-yellow-100 text-yellow-700`,
    shipped: `${base} bg-blue-100 text-blue-700`,
    delivered: `${base} bg-green-100 text-green-700`,
    cancelled: `${base} bg-red-100 text-red-700`,
  };

  return (
    <span className={styles[status] || `${base} bg-gray-100 text-gray-600`}>
      {status}
    </span>
  );
}