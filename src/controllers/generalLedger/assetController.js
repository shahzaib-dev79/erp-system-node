const Asset = require("../../models/generalLedger/Asset");

const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create({
      name: req.body.name,
      category: req.body.category,
      value: req.body.value,
      description: req.body.description,
      purchaseDate: req.body.purchaseDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Asset created successfully.",
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create asset",
      data: error.message,
    });
  }
};

const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Assets fetched successfully.",
      data: assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch assets",
      data: error.message,
    });
  }
};

const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findById(id).populate("createdBy", "name email");

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Single Asset fetched successfully.",
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch asset",
      data: error.message,
    });
  }
};

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAsset = await Asset.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAsset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asset updated successfully.",
      data: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update asset",
      data: error.message,
    });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await Asset.findByIdAndDelete(id);

    if (!deletedAsset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully.",
      data: deletedAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete asset",
      data: error.message,
    });
  }
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};
