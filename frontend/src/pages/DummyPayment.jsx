import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function DummyPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleChange = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/payment/dummy-pay",
        {
          orderId,
          status: "paid",
        }
      );

      if (data.success) {
        setPaid(true);

        // optional auto redirect after 3s
        setTimeout(() => {
          navigate("/my-orders");
        }, 3000);
      }
    } catch (error) {
      alert("Payment Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden p-10 relative">

        {/* SUCCESS ANIMATION */}
        {paid && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50 transition-all duration-500">

            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-scaleIn">
              <svg
                className="w-14 h-14 text-green-600 animate-draw"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold mt-6 text-green-600">
              Payment Successful!
            </h2>

            <p className="text-gray-500 mt-2">
              Redirecting to your orders...
            </p>
          </div>
        )}

        {/* PAYMENT FORM */}
        <div className={`transition-all duration-500 ${paid ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

          <h2 className="text-2xl font-bold mb-6">
            Secure Payment
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {/* FORM */}
            <div className="space-y-5">

              <input
                name="number"
                placeholder="Card Number"
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="expiry"
                  placeholder="MM/YY"
                  onChange={handleChange}
                  className="border p-3 rounded-xl"
                />
                <input
                  name="cvv"
                  placeholder="CVV"
                  onChange={handleChange}
                  className="border p-3 rounded-xl"
                />
              </div>

              <input
                name="name"
                placeholder="Card Holder Name"
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <button
                disabled={loading}
                onClick={handlePayment}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>

            {/* CARD PREVIEW */}
            <div className="flex items-center justify-center">
              <div className="w-80 h-48 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 shadow-xl transition-transform duration-500 hover:scale-105">

                <div className="text-sm opacity-70">
                  Credit Card
                </div>

                <div className="mt-6 text-lg tracking-widest">
                  {card.number || "#### #### #### ####"}
                </div>

                <div className="flex justify-between mt-6 text-sm">
                  <div>
                    <div className="opacity-60">Card Holder</div>
                    <div>{card.name || "FULL NAME"}</div>
                  </div>

                  <div>
                    <div className="opacity-60">Expires</div>
                    <div>{card.expiry || "MM/YY"}</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}