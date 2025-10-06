import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false, // ✅ prevents Mongo from creating _id for each item
    id: false,  // ✅ also prevents virtual id field creation
  }
);

const invoiceSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [invoiceItemSchema],
      required: true,
      validate: [
        {
          validator: function (val) {
            return Array.isArray(val) && val.length > 0;
          },
          message: "Invoice must have at least one item",
        },
      ],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ helps queries run faster (optional but good practice)
    },
  },
  {
    timestamps: true,
    versionKey: false, // ✅ removes the __v field
  }
);

// ✅ Prevent Mongoose model overwrite errors during hot reloads
const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export default Invoice;
