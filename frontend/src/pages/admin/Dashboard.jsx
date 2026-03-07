import { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  Store,
  Wallet,
  TrendingUp,
} from "lucide-react";
import MonthlyChart from "./components/MonthlyChart.jsx";
import LowStockList from "./components/LowStockList.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalCommission: 0,
    pendingWithdrawalAmount: 0,
  });

  const [monthly, setMonthly] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsRes, monthlyRes, lowStockRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/sales/monthly`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/low-stock`, { headers }),
      ]);

      const statsData = await statsRes.json();
      const monthlyData = await monthlyRes.json();
      const lowStockData = await lowStockRes.json();

      setStats(statsData);
      setMonthly(monthlyData);
      setLowStock(lowStockData);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Marketplace Analytics
        </h1>
        <p className="text-slate-500 mt-2">
          Overview of platform performance and revenue.
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart />} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<IndianRupee />} />
        <StatCard title="Vendors" value={stats.totalVendors} icon={<Store />} />
        <StatCard title="Commission" value={`₹${stats.totalCommission}`} icon={<TrendingUp />} />
        <StatCard title="Pending Withdrawals" value={`₹${stats.pendingWithdrawalAmount}`} icon={<Wallet />} />
      </div>

      {/*  CHART SECTION  */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Monthly Sales Overview
        </h2>
        <MonthlyChart data={monthly} />
      </div>

      {/* LOW STOCK  */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Low Stock Products
        </h2>
        <LowStockList products={lowStock} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-slate-100">
      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm">{title}</p>
        <div className="text-indigo-600">{icon}</div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mt-4">
        {value}
      </h2>
    </div>
  );
}