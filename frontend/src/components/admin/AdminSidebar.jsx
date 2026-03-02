import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";

  const activeStyle = "bg-black text-white";
  const normalStyle = "text-gray-700 hover:bg-gray-200";

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-xl transition-all duration-300 p-4 flex flex-col`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <h2 className="text-xl font-bold">Admin Panel</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-200"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* below section */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? activeStyle : normalStyle
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}