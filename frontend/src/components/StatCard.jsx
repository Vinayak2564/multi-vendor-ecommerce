import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between"
    >
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      <div className="bg-indigo-100 p-3 rounded-xl">
        <Icon className="text-indigo-600" size={24} />
      </div>
    </motion.div>
  );
}

export default StatCard;
