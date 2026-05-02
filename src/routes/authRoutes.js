const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
	register,
	login,
	refresh,
	logout,
	getMe,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: { success: false, message: "Too many attempts. Try again later." },
	standardHeaders: true,
	legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

module.exports = router;
