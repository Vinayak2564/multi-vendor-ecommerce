import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 10 }}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>₹ {product.price}</strong>
      <br />
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;


