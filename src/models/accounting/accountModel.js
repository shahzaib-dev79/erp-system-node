const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
    minLength: 3,
  },
  bankName: {
    type: String,
  },

  bankAccountNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  type: {
    type: String,
    enum: ["bank", "mobile-account", "cash"],
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
