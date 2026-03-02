import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">Vendor Panel</h2>

      <ul className="space-y-4">
        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <LayoutDashboard size={20} /> Dashboard
        </li>

        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <Package size={20} /> Products
        </li>

        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <ShoppingCart size={20} /> Orders
        </li>
        <li>
             <a href="/vendor/products">
             Products
             </a>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;
