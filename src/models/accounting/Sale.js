const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: [true, "Party is required"],
    },
    products: {
      type: [
        {
          type: String,
          trim: true,
          required: true,
        },
      ],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one product is required",
      },
      required: [true, "Products are required"],
    },
    date: {
      type: Date,
      required: [true, "Sale date is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sale", saleSchema);
