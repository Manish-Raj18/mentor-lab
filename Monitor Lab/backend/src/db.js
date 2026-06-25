import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    
    // Modern Mongoose (6+) doesn't need useNewUrlParser or useUnifiedTopology
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed!");
    console.error("Error details:", error.message);
    
    if (error.name === "MongooseServerSelectionError" || error.message.includes("timed out") || error.message.includes("whitelist")) {
      console.error("\nHINT: This is likely an IP Whitelisting issue on MongoDB Atlas.");
      console.error("Please ensure your current IP address is whitelisted in your Atlas cluster settings.");
      console.error("Visit: https://www.mongodb.com/docs/atlas/security-whitelist/\n");
    }
    
    process.exit(1);
  }
};

export default connectDB;