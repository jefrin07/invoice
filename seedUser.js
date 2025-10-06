import mongoose from "mongoose";
import Invoice from "./models/Invoice.js";
import dotenv from "dotenv";

dotenv.config();

const dropInvoicesCollection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/10thmay`);
    console.log("Connected to MongoDB.");

    // Drop the collection if it exists
    const collections = await mongoose.connection.db.listCollections({ name: 'invoices' }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection('invoices');
      console.log("Invoices collection dropped successfully.");
    } else {
      console.log("Invoices collection does not exist.");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (err) {
    console.error("Error dropping invoices collection:", err);
    process.exit(1);
  }
};

dropInvoicesCollection();
