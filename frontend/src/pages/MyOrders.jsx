import { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order Cancelled ");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order Deleted 🗑️");
      fetchOrders();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const downloadInvoice = (order) => {
    const invoiceContent = `
Invoice
--------------------------
Order ID: ${order._id}
Product: ${order.product?.name}
Quantity: ${order.quantity}
Total: ₹${order.totalPrice}
Status: ${order.status}
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${order._id}.txt`;
    link.click();
  };

  const handleReviewChange = (orderId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  const submitReviewHandler = async (order) => {
    const { rating, comment } = reviewInputs[order._id] || {};
    if (!rating || !comment) return alert("Provide rating & comment");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/products/${order.product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review Submitted ⭐");
      setReviewInputs((prev) => ({
        ...prev,
        [order._id]: { rating: "", comment: "" },
      }));
      fetchOrders();
    } catch (err) {
      alert("Review failed");
    }
  };

  // Truck Position Logic //
  const getTruckPosition = (status) => {
    if (status === "processing") return "15%";
    if (status === "shipped") return "45%";
    if (status === "out_for_delivery") return "75%";
    if (status === "delivered") return "100%";
    return "10%";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-8">My Orders 📦</h2>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          No Orders Yet
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const reviewInput = reviewInputs[order._id] || {
              rating: "",
              comment: "",
            };

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {order.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setExpanded(expanded === order._id ? null : order._id)
                    }
                    className="text-indigo-600 font-medium"
                  >
                    {expanded === order._id ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {expanded === order._id && (
                  <div className="mt-6 border-t pt-6 grid md:grid-cols-2 gap-8">

                    {/* LEFT SIDE */}
                    <div>
                      <img
  src={
    order.product?.image?.startsWith("http")
      ? order.product.image
      : `${import.meta.env.VITE_API_URL.replace("/api","")}/${order.product?.image}`
  }
  alt={order.product?.name}
  className="w-40 h-40 object-cover rounded-xl mb-4"
/>
                      <p>Quantity: {order.quantity}</p>
                      <p>Total: ₹{order.totalPrice}</p>
                      <p>Status: {order.status}</p>
                      <p>Payment: {order.paymentStatus}</p>

                      <div className="flex flex-wrap gap-3 mt-5">
                        {order.status !== "cancelled" && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => downloadInvoice(order)}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>

                    {/* RIGHT SIDE - LIVE DELIVERY ANIMATION */}
                    <div className="flex flex-col justify-center">
                      <h4 className="font-semibold mb-6">
                        Live Delivery Status 🚚
                      </h4>

                      <div className="relative w-full h-24">

                        {/* Road */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>

                        {/* Progress */}
                        <div
                          className="absolute top-1/2 left-0 h-2 bg-indigo-600 rounded-full transition-all duration-1000 ease-in-out"
                          style={{ width: getTruckPosition(order.status) }}
                        ></div>

                        {/* Truck */}
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-in-out text-3xl"
                          style={{ left: getTruckPosition(order.status) }}
                        >
                          🛻
                        </div>

                        {/* Labels */}
                        <div className="absolute top-full mt-4 w-full flex justify-between text-xs text-gray-500">
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Out</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* REVIEW SECTION */}
                    <div className="md:col-span-2 border-t pt-6 mt-6">
                      <h4 className="text-lg font-semibold mb-3">
                        Write a Review ⭐
                      </h4>

                      {user ? (
                        <div className="space-y-3">
                          <select
                            value={reviewInput.rating}
                            onChange={(e) =>
                              handleReviewChange(
                                order._id,
                                "rating",
                                e.target.value
                              )
                            }
                            className="w-full border rounded-lg p-2"
                          >
                            <option value="">Select Rating</option>
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>
                                {r} Stars
                              </option>
                            ))}
                          </select>

                          <textarea
                            value={reviewInput.comment}
                            onChange={(e) =>
                              handleReviewChange(
                                order._id,
                                "comment",
                                e.target.value
                              )
                            }
                            className="w-full border rounded-lg p-2"
                            rows={3}
                            placeholder="Share your experience..."
                          />

                          <button
                            onClick={() => submitReviewHandler(order)}
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                          >
                            Submit Review
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Please login to write review.
                        </p>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;