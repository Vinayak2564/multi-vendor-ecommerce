import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function MonthlyChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-4 text-gray-700 font-semibold">Monthly Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}