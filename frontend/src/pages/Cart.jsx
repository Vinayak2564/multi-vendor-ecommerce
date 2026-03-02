import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    
    if (cart.length === 0) return;

    const firstItem = cart[0];

    navigate("/checkout", { state: { 
      product: firstItem,
      quantity: firstItem.quantity,
     } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 text-lg">Cart is empty</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">

            {/* LEFT - CART ITEMS */}
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow p-6 flex gap-6"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200">
                    {item.image && (
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `http://localhost:5000/${item.image}`
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 mt-1">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="w-8 h-8 bg-gray-200 rounded-lg"
                      >
                        -
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="w-8 h-8 bg-gray-200 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* PRICE + REMOVE */}
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 mt-3 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT - SUMMARY */}
            <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-6">
              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}