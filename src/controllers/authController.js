const User = require("../models/User");
const {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} = require("../utils/jwt");

const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required." });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(409)
				.json({ success: false, message: "Email already in use." });
		}

		const user = await User.create({ name, email, password });

		const accessToken = generateAccessToken({ id: user._id, role: user.role });
		const refreshToken = generateRefreshToken({ id: user._id });

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		res.status(201).json({
			success: true,
			message: "Account created successfully.",
			data: { user: user.toSafeObject(), accessToken, refreshToken },
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required." });
		}

		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.comparePassword(password))) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid email or password." });
		}

		if (!user.isActive) {
			return res
				.status(403)
				.json({ success: false, message: "Account has been deactivated." });
		}

		const accessToken = generateAccessToken({ id: user._id, role: user.role });
		const refreshToken = generateRefreshToken({ id: user._id });

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		res.status(200).json({
			success: true,
			message: "Logged in successfully.",
			data: { user: user.toSafeObject(), accessToken, refreshToken },
		});
	} catch (error) {
		next(error);
	}
};

const refresh = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			return res
				.status(400)
				.json({ success: false, message: "Refresh token is required." });
		}

		let decoded;
		try {
			decoded = verifyRefreshToken(refreshToken);
		} catch {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired refresh token.",
			});
		}

		const user = await User.findById(decoded.id).select("+refreshToken");

		if (!user || user.refreshToken !== refreshToken) {
			return res
				.status(401)
				.json({ success: false, message: "Refresh token mismatch." });
		}

		const newAccessToken = generateAccessToken({
			id: user._id,
			role: user.role,
		});
		const newRefreshToken = generateRefreshToken({ id: user._id });

		user.refreshToken = newRefreshToken;
		await user.save({ validateBeforeSave: false });

		res.status(200).json({
			success: true,
			data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
		});
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	try {
		await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

		res
			.status(200)
			.json({ success: true, message: "Logged out successfully." });
	} catch (error) {
		next(error);
	}
};

const getMe = async (req, res) => {
	res.status(200).json({ success: true, data: { user: req.user } });
};

module.exports = { register, login, refresh, logout, getMe };
