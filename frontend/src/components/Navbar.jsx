import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        background: "#111",
        color: "#fff",
        display: "flex",
        gap: "20px",
        alignItems: "center",
      }}
    >

      {/* LOGO / HOME */}
      <Link to="/" style={linkStyle}>
        🏪 MultiVendor
      </Link>

      {/* SHOP */}
      <Link to="/shop" style={linkStyle}>
        Shop
      </Link>

      {/* CART */}
      <Link to="/cart" style={linkStyle}>
        Cart 🛒
      </Link>

      {/* CUSTOMER ORDERS */}
      {user?.role === "customer" && (
        <Link to="/my-orders" style={linkStyle}>
          My Orders
        </Link>
      )}

      {/* VENDOR LINKS */}
      {user?.role === "vendor" && (
        <>
          <Link
            to="/vendor/dashboard"
            style={linkStyle}
          >
            Dashboard
          </Link>

          <Link
            to="/vendor/products"
            style={linkStyle}
          >
            Products
          </Link>

          <Link
            to="/vendor/orders"
            style={linkStyle}
          >
            Orders
          </Link>
        </>
      )}

      {/* AUTH LINKS */}
      {!user ? (
        <>
          <Link to="/login" style={linkStyle}>
            Login
          </Link>

          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </>
      ) : (
        <button
          onClick={logout}
          style={logoutBtn}
        >
          Logout
        </button>
      )}

    </nav>
  );
}

// ================= STYLES =================
const navStyle = {
  padding: "12px 20px",
  background: "#111",
  display: "flex",
  gap: "20px",
  alignItems: "center",
};


const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
};

const logoutBtn = {
  marginLeft: "auto",
  padding: "6px 12px",
  cursor: "pointer",
};
