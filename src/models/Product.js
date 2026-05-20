const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: 100,
      minlength: [2, "Product name must be at least 2 characters"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
      maxlength: 250,
      minlength: 3,
      trim: true,
    },
    sellerGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      default: null,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
