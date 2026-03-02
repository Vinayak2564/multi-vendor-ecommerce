const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected now add data");
  } catch (error) {
    console.error("MongoDB error dont add anything", error);
    process.exit(1);
  }
};

module.exports = connectDB;
