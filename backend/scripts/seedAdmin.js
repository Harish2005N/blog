import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error(
        "ERROR: ADMIN_PASSWORD environment variable is not set."
      );
      console.error(
        "Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword npm run seed"
      );
      process.exit(1);
    }

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      if (existing.role !== "admin") {
        existing.role = "admin";
        existing.password = adminPassword;
        await existing.save();
        console.log("Promoted existing user to admin with fresh password hash");
      }
      process.exit(0);
    }

    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`Admin account created successfully`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
