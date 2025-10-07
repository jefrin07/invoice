import mongoose from "mongoose";
import dotenv from "dotenv";
import Invoice from "./models/Invoice.js";
import User from "./models/User.js"; // Make sure this points to your User model

dotenv.config();

const seedInvoiceWith20Items = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/10thmay`);
    console.log("Connected to MongoDB.");

    // Get the first user from the database
    const firstUser = await User.findOne().exec();
    if (!firstUser) {
      console.error("No users found in the database. Seed a user first.");
      process.exit(1);
    }

    // Create 20 items
    const items = Array.from({ length: 20 }).map((_, index) => ({
      itemName: `Item ${index + 1}`,
      quantity: index + 1,       // Example quantity
      price: (index + 1) * 10,  // Example price
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const invoice = new Invoice({
      clientName: "John Doe",
      items,
      totalAmount,
      createdBy: firstUser._id, // Use first user's ID
      createdAt: new Date(),
    });

    await invoice.save();
    console.log("Invoice with 20 items seeded successfully.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (err) {
    console.error("Error seeding invoice:", err);
    process.exit(1);
  }
};

seedInvoiceWith20Items();
