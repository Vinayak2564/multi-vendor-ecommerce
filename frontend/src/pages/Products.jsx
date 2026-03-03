import { useState, useEffect } from "react";
import API from "../api/axios";
import { deleteProduct } from "../services/productService";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const vendorId = localStorage.getItem("userId");

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");

      const allProducts = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.products)
        ? res.data.products
        : [];

      const vendorProducts = allProducts.filter(
        (p) => p.vendor && p.vendor._id === vendorId
      );

      setProducts(vendorProducts);
    } catch (error) {
      console.error("Fetch Products Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchProducts();
    }
  }, [vendorId]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // ================= SUBMIT PRODUCT =================
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("stock", product.stock);

      if (product.image) formData.append("image", product.image);

      if (editMode) {
  await API.put(`/products/${editId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  alert("Product Updated ✅");
} else {
        await API.post("/products/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Added ✅");
      }

      setOpen(false);
      setProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: null,
      });
      setEditMode(false);
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Something went wrong ❌");
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await deleteProduct(id);
      alert("Deleted successfully ✅");
      fetchProducts();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // product edit
  const handleEdit = (p) => {
    setProduct({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock || 0,
      image: null,
    });
    setEditId(p._id);
    setEditMode(true);
    setOpen(true);
  };

  // logout section
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Vendor Products Dashboard 🛒
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your products easily.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditMode(false);
                setProduct({
                  name: "",
                  price: "",
                  category: "",
                  stock: "",
                  image: null,
                });
                setOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-md transition"
            >
              Add Product
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="text-center text-slate-500">
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-slate-400">
            No products added yet
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/${p.image}`}
                  alt={p.name}
                  className="w-full h-52 object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300")
                  }
                />

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {p.name}
                  </h3>

                  <p className="text-indigo-600 font-bold mt-2">
                    ₹{p.price}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Category: {p.category}
                  </p>

                  <p className="text-sm mt-2 font-medium">
                    Stock:{" "}
                    <span
                      className={
                        p.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {p.stock > 0
                        ? `${p.stock} Available`
                        : "Out of Stock"}
                    </span>
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-slate-900 hover:bg-black text-white py-2 rounded-xl transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(p._id)
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">
                {editMode ? "Edit Product" : "Add Product"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity"
                  value={product.stock}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
                >
                  Submit
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}