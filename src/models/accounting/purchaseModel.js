const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema(
  {
    purchaseCode: {
      type: String,
      required: [true, "Purchase ID is required"],
      trim: true,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: [true, "Supplier is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
        subPrice: {
          type: Number,
          required: true,
          min: [0, "Total price cannot be negative"],
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: [0, "Due amount cannot be negative"],
    },
    paymentMethod: {
      type: string,
      enum: ["cash", "bank", "mobile-account"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
    ledgerEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JournalLedger",
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxLength: 300,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Purchase", purchaseSchema);
