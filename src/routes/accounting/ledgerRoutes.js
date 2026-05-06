const express = require("express");
const router = express.Router();

const {
  createJournalLedger,
  getAllJournalLedger,
  getJournalLedgerById,
  updateJournalLedger,
  deleteJournalLedger,
} = require("../../controllers/accounting/ledgerController");

const authenticate = require("../../middlewares/authenticate");
const { authorize } = require("../../middlewares/authorize");

router.use(authenticate);

router.post("/", authorize("admin", "moderator"), createJournalLedger);
router.get("/", getAllJournalLedger);
router.get("/:id", getJournalLedgerById);
router.put("/:id", authorize("admin", "moderator"), updateJournalLedger);
router.delete("/:id", authorize("admin"), deleteJournalLedger);

module.exports = router;
