const User = require("../models/User");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}

		const token = authHeader.split(" ")[1];

		let decoded;
		try {
			decoded = verifyAccessToken(token);
		} catch (err) {
			const message =
				err.name === "TokenExpiredError"
					? "Token expired. Please refresh your session."
					: "Invalid token. Please log in again.";

			return res.status(401).json({ success: false, message });
		}

		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User no longer exists.",
			});
		}

		if (!user.isActive) {
			return res.status(403).json({
				success: false,
				message: "Account has been deactivated.",
			});
		}

		req.user = user.toSafeObject();
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authenticate;
