const express = require("express");
const router = express.Router();

const {
	getAllUsers,
	getUserById,
	updateUser,
	changePassword,
	updateRole,
	updateStatus,
	deleteUser,
	getUserStats,
} = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const {
	authorize,
	authorizeOwnerOrAdmin,
} = require("../middlewares/authorize");

router.use(authenticate);

router.get("/stats", authorize("admin"), getUserStats);

router.get("/", authorize("admin"), getAllUsers);

router.get("/:id", authorizeOwnerOrAdmin, getUserById);

router.put("/:id", authorizeOwnerOrAdmin, updateUser);

router.patch("/:id/password", authorizeOwnerOrAdmin, changePassword);

router.patch("/:id/role", authorize("admin"), updateRole);

router.patch("/:id/status", authorize("admin"), updateStatus);

router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
