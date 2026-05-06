const mongoose = require("mongoose");

const journalLedgerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Code is required"],
      unique: true,
      trim: true,
    },
    accounts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Account is required"],
    },
    debit: {
      type: Number,
      default: 0,
      min: [0, "Credit cannot be negative"],
    },
    credit: {
      type: Number,
      default: 0,
      min: [0, "Credit cannot be negative"],
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Party is required"],
    },
    type: {
      type: String,
      enum: ["sale", "purchase", "expense", "salary"],
      required: [true, "type is required"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JournalLedger", journalLedgerSchema);
