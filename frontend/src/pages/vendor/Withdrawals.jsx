import React, { useEffect, useState } from "react";
import axios from "axios";

const Withdrawals = () => {
  const [wallet, setWallet] = useState(0);
  const [amount, setAmount] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/wallet`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWallet(res.data.walletBalance || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/withdrawals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWithdrawals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchWithdrawals();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/vendor/withdrawal`,
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Withdrawal request submitted ✅");
      setAmount("");
      fetchWallet();
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Vendor Withdrawals
          </h2>
          <p className="text-slate-500 mt-2">
            Manage your wallet and withdrawal requests.
          </p>
        </div>

        {/* WALLET CARD */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-lg">
          <p className="text-indigo-100 text-sm">
            Wallet Balance
          </p>
          <h3 className="text-4xl font-bold mt-3">
            ₹{wallet}
          </h3>
        </div>

        {/* WITHDRAW FORM */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-slate-700 mb-6">
            Request Withdrawal
          </h3>

          <form
            onSubmit={handleWithdraw}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : "Request Withdrawal"}
            </button>
          </form>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-slate-700 mb-6">
            Withdrawal History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-left">
                  <th className="p-4 font-medium">
                    Amount
                  </th>
                  <th className="p-4 font-medium">
                    Status
                  </th>
                  <th className="p-4 font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map((w) => (
                  <tr
                    key={w._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-4 font-semibold">
                      ₹{w.amount}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={w.status}
                      />
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(
                        w.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {withdrawals.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                No withdrawal history yet
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

/*status badge */

function StatusBadge({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold capitalize";

  const styles = {
    pending: `${base} bg-yellow-100 text-yellow-700`,
    approved: `${base} bg-green-100 text-green-700`,
    rejected: `${base} bg-red-100 text-red-700`,
  };

  return (
    <span className={styles[status] || `${base} bg-gray-100 text-gray-600`}>
      {status}
    </span>
  );
}

export default Withdrawals;