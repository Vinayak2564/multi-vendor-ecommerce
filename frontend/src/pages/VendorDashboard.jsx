import { useEffect, useState } from "react";
import axios from "axios";

export default function VendorDashboard() {
const [stats, setStats] = useState({
totalOrders: 0,
totalEarnings: 0,
});


const vendorId = localStorage.getItem("userId");

useEffect(() => {
if (vendorId) {
fetchEarnings();
}
}, [vendorId]);

const fetchEarnings = async () => {
try {
const res = await axios.get(
`${import.meta.env.VITE_API_URL}/vendor/earnings/${vendorId}`
);

  console.log("Earnings API:", res.data); 
  setStats(res.data);
} catch (error) {
  console.error("Error fetching earnings 👎", error);
}


};

return (
<div style={{ padding: "20px" }}> <h2>Vendor Dashboard</h2>

  <div style={{ marginTop: "20px" }}>
    <h3>Total Orders: {stats.totalOrders}</h3>
    <h3>Total Earnings: ₹{stats.totalEarnings}</h3>
  </div>
</div>


);
}
