import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Products from "./pages/Products";

import MyOrders from "./pages/MyOrders";
import VendorOrders from "./pages/VendorOrders";
import DummyPayment from "./pages/DummyPayment";
import Checkout from "./pages/checkout";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorWithdrawals from "./pages/vendor/Withdrawals";

import Dashboard from "./pages/admin/Dashboard";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";

import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
    <BrowserRouter>
      <Routes>

        {/* common Routes sections */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:orderId" element={<DummyPayment />} />

        {/* Customer Routes sections  */}
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Vendor Routes section */}
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products" element={<Products />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/withdrawals" element={<VendorWithdrawals />} />

        {/* ADMIN ROUTES section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
        </Route>

      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;