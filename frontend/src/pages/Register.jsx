import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      alert(res.data.message || "Registered successfully ✅");

      navigate("/login");

    } catch (err) {
      console.error("Register Error:", err);

      alert(
        err?.response?.data?.message ||
        "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
      
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Create Account 🚀
          </h2>
          <p className="text-slate-500 mt-2">
            Hurry up! Join our marketplace today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an account? then go throgh{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>

      </div>
    </div>
  );
}

export default Register;