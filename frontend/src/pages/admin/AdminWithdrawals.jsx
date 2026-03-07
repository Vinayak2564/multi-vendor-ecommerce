import { useEffect, useState } from "react";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again.");

      const res = await fetch(`${BASE_URL}/api/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch withdrawals");

      const data = await res.json();
      setWithdrawals(data);
      setFiltered(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/withdrawal/${id}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Action failed");

      fetchWithdrawals();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFiltered(withdrawals);
    } else {
      setFiltered(
        withdrawals.filter((w) => w.status === filter)
      );
    }
  }, [filter, withdrawals]);

  const totalRequests = withdrawals.length;
  const totalPendingAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const totalApprovedAmount = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);
  const totalRejected = withdrawals.filter(
    (w) => w.status === "rejected"
  ).length;

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">
        Admin Withdrawal Control
      </h2>

      {/*  SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card title="Total Requests" value={totalRequests} />
        <Card
          title="Pending Amount"
          value={`₹${totalPendingAmount}`}
        />
        <Card
          title="Approved Amount"
          value={`₹${totalApprovedAmount}`}
        />
        <Card title="Rejected" value={totalRejected} />
      </div>

      {/* FILTER BUTTONS*/}
      <div className="mb-6 space-x-2">
        {["all", "pending", "approved", "rejected"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded capitalize ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* TABLE  */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Vendor</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Amount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w._id} className="border-t">
                <td className="p-4">{w.vendor?.name}</td>
                <td className="p-4">{w.vendor?.email}</td>
                <td className="p-4 text-center">
                  ₹{w.amount}
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={w.status} />
                </td>
                <td className="p-4 text-center space-x-2">
                  {w.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(w._id, "approve")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleAction(w._id, "reject")
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No withdrawals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*  CARD COMPONENT */
function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  );
}

// status badge //
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}