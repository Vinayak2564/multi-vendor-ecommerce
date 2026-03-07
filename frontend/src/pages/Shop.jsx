import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products?limit=1000`);
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Product fetch error:", error);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Shop Products
        </h1>

        {/* ROLE BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Login
            </button>
          )}

          {user?.role === "customer" && (
            <>
              <button
                onClick={() => navigate("/cart")}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
              >
                Go To Cart 🛒
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                My Orders 📦
              </button>
            </>
          )}

          {user?.role === "vendor" && (
            <>
              <button
                onClick={() => navigate("/vendor/dashboard")}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg"
              >
                Vendor Dashboard 📊
              </button>

              <button
                onClick={() => navigate("/vendor/orders")}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
              >
                Vendor Orders 📦
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Admin Dashboard ⚙️
            </button>
          )}

        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-black"
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products found 🔍
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {

              let imageUrl = product.image;

              if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = `${API_URL}/${imageUrl}`;
              }

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
                >
                  <div className="h-56 overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {product.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-2 capitalize">
                      {product.category}
                    </p>

                    <p className="text-2xl font-bold text-indigo-600 mb-4">
                      ₹{product.price}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
                      >
                        Add to Cart 🛒
                      </button>

                      <button
                        disabled={product.stock === 0}
                        onClick={() =>
                          navigate("/checkout", {
                            state: { product: product, quantity: 1 },
                          })
                        }
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Buy Now ⚡
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Stock: {product.stock}
                    </p>
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