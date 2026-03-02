import { useState } from "react";

function AddProductModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-6">

        <h2 className="text-xl font-bold mb-4">
          Add New Product
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        {/* Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded mb-3"
          onChange={handleChange}
        />

        {/* Image */}
        <input
          type="file"
          className="mb-4"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Add Product
          </button>

        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
