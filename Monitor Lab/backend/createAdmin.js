import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/user.js";
import bcrypt from "bcryptjs";

dotenv.config();

// EDIT THESE CREDENTIALS
const adminEmail = "manishraj@gmail.com"; 
const adminPassword = "manish@123"; 

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/monitor-lab");
    console.log("Connected to MongoDB...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log(`Updating existing user (${adminEmail}) to Admin and resetting password...`);
      userExists.isAdmin = true;
      userExists.password = hashedPassword;
      await userExists.save();
      console.log("Admin account updated successfully!");
    } else {
      console.log(`Creating new Admin user: ${adminEmail}...`);
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Admin user created successfully!");
    }

    console.log("-------------------------------");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("-------------------------------");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
