import Invoice from "../models/Invoice.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Create a new invoice

export const createInvoice = asyncHandler(async (req, res) => {
  try {
    const { clientName, items } = req.body;

    if (!clientName || !items || !items.length) {
      return res
        .status(400)
        .json({ message: "Client name and at least one item are required" });
    }

    // ✅ Clean items array to remove any _id sent from frontend
    const cleanItems = items.map(({ itemName, quantity, price }) => ({
      itemName,
      quantity,
      price,
    }));

    // ✅ Calculate totalAmount
    const totalAmount = cleanItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Assuming req.user contains the authenticated user ID
    const createdBy = req.user._id;

    const invoice = new Invoice({
      clientName,
      items: cleanItems,
      totalAmount,
      createdBy,
    });

    const savedInvoice = await invoice.save();

    console.log("Invoice created successfully:", savedInvoice);

    res.status(201).json(savedInvoice);
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export const allInvoices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  try {
    const invoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch invoices");
  }
});

export const findInvoice = asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.status(200).json(invoice);
});
