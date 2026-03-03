import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function VendorOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/vendor/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const normalizedOrders = orders.map((order) => ({
    ...order,
    status:
      order.status === "accepted"
        ? "processing"
        : order.status,
  }));

  const totalOrders = normalizedOrders.length;

  const processingOrders = normalizedOrders.filter(
    (order) => order.status === "processing"
  ).length;

  const deliveredOrders = normalizedOrders.filter(
    (order) => order.status === "delivered"
  ).length;

  const totalRevenue = normalizedOrders
    .filter((order) => order.status === "delivered")
    .reduce(
      (acc, order) => acc + (order.totalPrice || 0) * 0.9,
      0
    );

  const last7Days = {};
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    last7Days[key] = 0;
  }

  normalizedOrders.forEach((order) => {
    if (order.status === "delivered") {
      const date = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];

      if (last7Days[date] !== undefined) {
        last7Days[date] += order.totalPrice * 0.9;
      }
    }
  });

  const chartData = {
    labels: Object.keys(last7Days),
    datasets: [
      {
        label: "Revenue (₹)",
        data: Object.values(last7Days),
        backgroundColor: "#111827",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold mb-8">
          Vendor Dashboard 📦
        </h2>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <DashboardCard title="Total Orders" value={totalOrders} />
          <DashboardCard title="Processing" value={processingOrders} />
          <DashboardCard title="Delivered" value={deliveredOrders} />
          <DashboardCard
            title="Revenue"
            value={`₹${totalRevenue.toFixed(2)}`}
          />
        </div>

        {/* REVENUE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
          <h3 className="text-xl font-semibold mb-6">
            Revenue - Last 7 Days 📊
          </h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* ORDERS LIST */}
        {normalizedOrders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <h3 className="text-gray-500 text-lg">
              No orders yet
            </h3>
          </div>
        ) : (
          <div className="space-y-8">
            {normalizedOrders.map((order) => {
              const commission =
                (order.totalPrice || 0) * 0.1;

              const vendorEarning =
                (order.totalPrice || 0) - commission;

              return (
                <div
                  key={order._id}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {order.product?.name}
                      </h3>

                      <p className="text-gray-600">
                        Price: ₹{order.product?.price}
                      </p>
                      <p className="text-gray-600">
                        Customer: {order.customer?.name}
                      </p>
                      <p className="text-gray-600">
                        Email: {order.customer?.email}
                      </p>
                      <p className="text-gray-600">
                        Qty: {order.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={getStatusStyle(order.status)}>
                        {order.status}
                      </span>

                      <p className="mt-4 font-semibold">
                        Total Price: ₹{order.totalPrice}
                      </p>

                      <p className="text-green-600">
                        Vendor Earning: ₹
                        {vendorEarning.toFixed(2)}
                      </p>

                      <p className="text-red-500">
                        Platform Commission: ₹
                        {commission.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ActionButton
                      text="Processing"
                      onClick={() =>
                        updateStatus(order._id, "processing")
                      }
                    />
                    <ActionButton
                      text="Reject"
                      onClick={() =>
                        updateStatus(order._id, "cancelled")
                      }
                    />
                    <ActionButton
                      text="Shipped 📦"
                      onClick={() =>
                        updateStatus(order._id, "shipped")
                      }
                    />
                    <ActionButton
                      text="Delivered 🚚"
                      onClick={() =>
                        updateStatus(order._id, "delivered")
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* components */

const DashboardCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

const ActionButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition text-sm font-medium"
  >
    {text}
  </button>
);

const getStatusStyle = (status) => {
  const base =
    "px-3 py-1 rounded-full text-sm font-medium capitalize";

  const styles = {
    processing: `${base} bg-yellow-100 text-yellow-700`,
    shipped: `${base} bg-blue-100 text-blue-700`,
    delivered: `${base} bg-green-100 text-green-700`,
    cancelled: `${base} bg-red-100 text-red-700`,
  };

  return styles[status] || base;
};

export default VendorOrders;