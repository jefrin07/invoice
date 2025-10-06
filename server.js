import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/error.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(cors({ origin: "*", credentials: true }));

// Connect to MongoDB
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
