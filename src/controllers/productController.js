const productModel = require("../models/Product");

async function checkProduct(id) {
  return await productModel.findById(id);
}

const createProduct = async (req, res) => {
  const { name, price, quantity, description, sellerGroup } = req.body;
  try {
    const product = await productModel.create({
      name,
      price,
      quantity,
      description,
      sellerGroup,
    });

    res.status(201).json({
      success: true,
      message: "Product has been created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured while creating product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("sellerGroup", "name email phoneNumber address");

    res.status(200).json({
      success: true,
      message: "Products have been fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured while fetching products",
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel
      .findById(id)
      .populate("sellerGroup", "name email phoneNumber address");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product has been fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error occurred while fetching product.",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product has been updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error occurred while updating product.",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const isExist = await checkProduct(id);
    if (!isExist) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      msg: "Product deleted successfully!",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error occurred while deleting the party.",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
