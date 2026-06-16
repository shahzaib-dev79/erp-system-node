const Staff = require("../models/Staff");

const createStaff = async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joiningDate } =
      req.body;

    const isExist = await Staff.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "Staff with this email already exists",
      });
    }

    const staff = await Staff.create({
      name,
      email,
      phone,
      department,
      position,
      salary,
      joiningDate,
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create staff",
    });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Staff fetched successfully.",
      data: staffList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch staff.",
      data: error.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff fetched successfully.",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch staff.",
      data: error.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff updated successfully.",
      data: updatedStaff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update staff.",
      data: error.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully.",
      data: deletedStaff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete staff.",
      data: error.message,
    });
  }
};

const updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const staff = await Staff.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Staff ${isActive ? "activated" : "deactivated"} successfully.`,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update staff status.",
      data: error.message,
    });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updateStaffStatus,
};
