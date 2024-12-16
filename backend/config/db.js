const mongoose = require("mongoose");
require("dotenv").config();
const mongo_uri =
  process.env.MONGO_URI || "mongodb://localhost:27017/mern_ecommerce";
const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri, {});
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
