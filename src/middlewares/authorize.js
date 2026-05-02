const authorize = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required before authorization.",
			});
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.user.role}.`,
			});
		}

		next();
	};
};

const authorizeOwnerOrAdmin = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({
			success: false,
			message: "Authentication required.",
		});
	}

	const isOwner = req.user._id.toString() === req.params.id;
	const isAdmin = req.user.role === "admin";

	if (!isOwner && !isAdmin) {
		return res.status(403).json({
			success: false,
			message: "Access denied. You can only modify your own resources.",
		});
	}

	next();
};

module.exports = { authorize, authorizeOwnerOrAdmin };
