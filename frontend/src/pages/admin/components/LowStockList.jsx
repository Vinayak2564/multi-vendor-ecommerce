export default function LowStockList({ products }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-4 text-gray-700 font-semibold">Low Stock Products</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Product</th>
            <th className="border-b p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td className="border-b p-2">{p.name}</td>
              <td className="border-b p-2">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}