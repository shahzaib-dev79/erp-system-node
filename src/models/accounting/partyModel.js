const mongoose = require("mongoose");
const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    partyType: {
      type: String,
      enum: ["customer", "supplier", "both", "staff"],
      default: "customer",
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const partyModel = mongoose.model("Party", partySchema);
module.exports = partyModel;
