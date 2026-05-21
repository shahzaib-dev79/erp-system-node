const purchaseModel = require("../../models/accounting/purchaseModel");

async function checkPurchase(id) {
  return await purchaseModel.findById(id);
}

const createPurchase = async (req, res) => {
  try {
    const purchase = await purchaseModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Purchase has been created successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while creating purchase",
      error: error.message,
    });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await purchaseModel
      .find({})
      .populate("supplier", "name email phoneNumber address")
      .populate("items.product", "name price quantity")
      .populate("ledgerEntry");

    res.status(200).json({
      success: true,
      message: "Purchases have been fetched successfully",
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching purchases",
      error: error.message,
    });
  }
};

const getSinglePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await purchaseModel
      .findById(id)
      .populate("supplier", "name email phoneNumber address")
      .populate("items.product", "name price quantity")
      .populate("ledgerEntry");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase has been fetched successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching purchase",
      error: error.message,
    });
  }
};

const updatePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPurchase = await purchaseModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPurchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase has been updated successfully",
      data: updatedPurchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while updating purchase",
      error: error.message,
    });
  }
};

const deletePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const isExist = await checkPurchase(id);

    if (!isExist) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    await purchaseModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting purchase",
      error: error.message,
    });
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
};
