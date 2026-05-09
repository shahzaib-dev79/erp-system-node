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
  },
  type: {
    type: String,
    enum: ["bank", "mobile account", "cash"],
  },
  balance: Number,
});
const accountModel = mongoose.model("account", accountModel);
module.exports = accountModel;
