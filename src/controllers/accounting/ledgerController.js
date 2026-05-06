const JournalLedger = require("../../models/accounting/Ledger");

const createJournalLedger = async (req, res) => {
  try {
    const newEntry = new JournalLedger({
      code: req.body.code,
      accounts: req.body.accounts,
      debit: req.body.debit,
      credit: req.body.credit,
      party: req.body.party,
      type: req.body.type,
      description: req.body.description,
    });
    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Journal ledger entry created successfully.",
      data: newEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create journal ledger entry.",
      data: error.message,
    });
  }
};

const getAllJournalLedger = async (req, res) => {
  try {
    const entries = await JournalLedger.find({})
      .populate("accounts", "name category value")
      .populate("party", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Journal ledger entries fetched successfully.",
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch journal ledger entries.",
      data: error.message,
    });
  }
};

const getJournalLedgerById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await JournalLedger.findById(id)
      .populate("accounts", "name category value")
      .populate("party", "name email");

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal ledger entry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal ledger entry fetched successfully.",
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch journal ledger entry.",
      data: error.message,
    });
  }
};

const updateJournalLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = await JournalLedger.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: "Journal ledger entry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal ledger entry updated successfully.",
      data: updatedEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update journal ledger entry.",
      data: error.message,
    });
  }
};

const deleteJournalLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await JournalLedger.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: "Journal ledger entry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal ledger entry deleted successfully.",
      data: deletedEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete journal ledger entry.",
      data: error.message,
    });
  }
};

module.exports = {
  createJournalLedger,
  getAllJournalLedger,
  getJournalLedgerById,
  updateJournalLedger,
  deleteJournalLedger,
};
