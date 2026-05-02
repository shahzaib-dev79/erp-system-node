const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 5000,
		});

		console.log(`MongoDB connected successfully`);

		mongoose.connection.on("disconnected", () => {
			console.warn("MongoDB disconnected. Attempting to reconnect...");
		});

		mongoose.connection.on("error", (err) => {
			console.error("MongoDB connection error:", err.message);
		});
	} catch (error) {
		console.error("MongoDB initial connection failed:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
