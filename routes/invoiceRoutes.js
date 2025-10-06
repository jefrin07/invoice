import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  allInvoices,
  createInvoice,
  findInvoice,
} from "../controllers/invoiceController.js";

const invoiceRoutes = express.Router();

invoiceRoutes.post("/create-invoice", protect, createInvoice);
invoiceRoutes.get("/all-invoice", protect, allInvoices);
invoiceRoutes.get("/:invoiceId", protect, findInvoice);

export default invoiceRoutes;
