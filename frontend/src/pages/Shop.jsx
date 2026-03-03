import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {

      console.log("Fetching products from API:", import.meta.env.VITE_API_URL); // Debug log
      try {
        // 🔥 FIX: Added large limit to fetch all products
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products?limit=1000`
        );

        setProducts(res.data.products || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() ===
              selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Shop Products
        </h1>

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
          <p className="text-center text-gray-500">
            No Products Found
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
              >
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= Math.round(product.rating)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.numReviews})
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 capitalize">
                    {product.category}
                  </p>

                  <p className="text-2xl font-bold text-indigo-600 mb-4">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
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
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      Buy Now ⚡
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}