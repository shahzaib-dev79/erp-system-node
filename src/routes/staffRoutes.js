const express = require("express");
const router = express.Router();

const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updateStaffStatus,
} = require("../controllers/staffController");

const authenticate = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");

router.use(authenticate);

router.post("/", authorize("admin", "moderator"), createStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", authorize("admin", "moderator"), updateStaff);
router.patch("/:id/status", authorize("admin"), updateStaffStatus);
router.delete("/:id", authorize("admin"), deleteStaff);

module.exports = router;
