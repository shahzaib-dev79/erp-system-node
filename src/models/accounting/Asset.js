const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["current", "fixed", "intangible"],
      required: [true, "Asset category is required"],
    },
    value: {
      type: Number,
      required: [true, "Asset value is required"],
      min: [0, "Value cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
    },
    purchaseDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Asset", assetSchema);
