const express = require("express");
const router = express.Router();

const {
	createEntry,
	getAllEntry,
	getEntryById,
	updateEntry,
	deleteEntry,
} = require("../../controllers/accounting/ledgerController");

const authenticate = require("../../middlewares/authenticate");
const { authorize } = require("../../middlewares/authorize");

router.use(authenticate);

router.post("/", authorize("admin", "moderator"), createEntry);
router.get("/", getAllEntry);
router.get("/:id", getEntryById);
router.put("/:id", authorize("admin", "moderator"), updateEntry);
router.delete("/:id", authorize("admin"), deleteEntry);

module.exports = router;
