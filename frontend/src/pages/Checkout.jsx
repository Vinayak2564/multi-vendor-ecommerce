import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity,  } = location.state || {};

  console.log(product);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async () => {
    try {
      if (!product?._id) {
        return alert("Product missing");
      }

      if (
        !address.fullName ||
        !address.phone ||
        !address.address ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {
        return alert("Please fill complete delivery address");
      }

      const { data } = await API.post("/orders", {
        productId: product._id,
        quantity: quantity || 1,
        deliveryAddress: address,
      });

      navigate(`/payment/${data.order._id}`);
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Order failed");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        No product selected
      </div>
    );
  }

  const subtotal = product.price * (quantity || 1);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-8">Checkout</h2>

      <div className="grid md:grid-cols-3 gap-8">

        {/* LEFT SECTION - DELIVERY FORM */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg">

          <h3 className="text-xl font-semibold mb-6">
            Delivery Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none md:col-span-2"
            />

            <textarea
              name="address"
              placeholder="Full Address"
              onChange={handleChange}
              rows="3"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none md:col-span-2"
            />
          </div>

        </div>

        {/* RIGHT SECTION - ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">

          <h3 className="text-lg font-semibold mb-4">
            Order Summary
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
              {product.image && (
             <img
  src={
    product.image?.startsWith("http")
      ? product.image
      : `http://localhost:5000/${product.image}`
  }
  alt={product.name}
  className="w-full h-full object-cover"
/>
              )}
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {quantity || 1}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between font-semibold text-base border-t pt-3">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={handleOrder}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Proceed to Payment
          </button>

        </div>
      </div>
    </div>
  );
}