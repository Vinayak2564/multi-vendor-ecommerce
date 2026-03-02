import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function VendorSidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      
      {/* Logo */}
      <h2 className="text-2xl font-bold mb-10">Vendor Panel</h2>

      {/* Menu */}
      <ul className="space-y-6">

        <li>
          <Link
            to="/vendor/dashboard"
            className="flex items-center gap-3 hover:text-yellow-400"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/vendor/products"
            className="flex items-center gap-3 hover:text-yellow-400"
          >
            <Package size={20} />
            Products
          </Link>
        </li>

        <li>
          <Link
            to="/vendor/orders"
            className="flex items-center gap-3 hover:text-yellow-400"
          >
            <ShoppingCart size={20} />
            Orders
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default VendorSidebar;
