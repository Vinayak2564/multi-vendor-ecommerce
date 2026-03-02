import { useEffect, useState } from "react";
import API from "../api/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.length === 0 && <p>No products found</p>}

      {products.map((p) => (
        <div
          key={p._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <h3>{p.name}</h3>
          <p>₹ {p.price}</p>
          <p>{p.description}</p>
          <small>Vendor: {p.vendor?.name}</small>
        </div>
      ))}
    </div>
  );
}
