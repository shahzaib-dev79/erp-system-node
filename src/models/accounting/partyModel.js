const mongoose = require("mongoose");
const { kMaxLength } = require("node:buffer");
const { minLength } = require("zod");
const partySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 20,
			unique: [true, "Name already Used Use and other party name"],
		},
		partyType: {
			type: String,
			enum: ["customer", "supplier", "both", "staff"],
			default: "customer",
			required: true,
		},
		email: {
			type: String,
			minLength: 5,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);
const parytModel = mongoose.model("partie", partySchema);
module.exports = parytModel;
