const mongoose = require("mongoose");

const Sale = require("../../models/accounting/Sale");
const Party = require("../../models/accounting/partyModel");

const PARTY_FIELDS = "name partyType email phoneNumber address";

const normalizeProducts = (products) => {
  if (Array.isArray(products)) {
    return products
      .map((product) => String(product).trim())
      .filter(Boolean);
  }

  if (typeof products === "string") {
    return products
      .split(/[\n,]+/)
      .map((product) => product.trim())
      .filter(Boolean);
  }

  return [];
};

const findParty = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Party.findById(id);
};

const findSale = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Sale.findById(id).populate("party", PARTY_FIELDS);
};

const getSalePayload = (body) => ({
  party: body.party,
  products: normalizeProducts(body.products),
  date: body.date,
  quantity: Number(body.quantity),
  amount: Number(body.amount),
});

const createSale = async (req, res) => {
  try {
    const payload = getSalePayload(req.body);

    if (!payload.products.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required.",
      });
    }

    const party = await findParty(payload.party);
    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found.",
      });
    }

    const sale = await Sale.create(payload);
    await sale.populate("party", PARTY_FIELDS);

    res.status(201).json({
      success: true,
      message: "Sale created successfully.",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create sale",
      data: error.message,
    });
  }
};

const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate("party", PARTY_FIELDS)
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Sales fetched successfully.",
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch sales",
      data: error.message,
    });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await findSale(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sale fetched successfully.",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch sale",
      data: error.message,
    });
  }
};

const updateSale = async (req, res) => {
  try {
    const existingSale = await findSale(req.params.id);
    if (!existingSale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const payload = getSalePayload(req.body);

    if (!payload.products.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required.",
      });
    }

    const party = await findParty(payload.party);
    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found.",
      });
    }

    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate("party", PARTY_FIELDS);

    res.status(200).json({
      success: true,
      message: "Sale updated successfully.",
      data: updatedSale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update sale",
      data: error.message,
    });
  }
};

const deleteSale = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully.",
      data: deletedSale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete sale",
      data: error.message,
    });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
