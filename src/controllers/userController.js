const User = require("../models/User");

const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role,
      isActive,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["user", "admin", "moderator"].includes(role)) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const allowedSortFields = [
      "name",
      "email",
      "createdAt",
      "updatedAt",
      "role",
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-__v")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");

    if (!user) {
      return next(createError("User not found.", 404));
    }

    res
      .status(200)
      .json({ success: true, data: { user: user.toSafeObject() } });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    // Only allow safe fields — no password or role changes here
    const ALLOWED_FIELDS = ["name", "email"];
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return next(createError("No valid fields provided for update."));
    }

    if (updates.email) {
      const existing = await User.findOne({
        email: updates.email,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return next(createError("Email is already in use.", 409));
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return next(createError("User not found.", 404));

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(createError("Current and new password are required."));
    }

    if (newPassword.length < 6) {
      return next(createError("New password must be at least 6 characters."));
    }

    if (currentPassword === newPassword) {
      return next(
        createError("New password must differ from current password."),
      );
    }

    const user = await User.findById(req.params.id).select("+password");
    if (!user) return next(createError("User not found.", 404));

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(createError("Current password is incorrect.", 401));
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const VALID_ROLES = ["user", "admin", "moderator"];

    if (!role || !VALID_ROLES.includes(role)) {
      return next(
        createError(`Role must be one of: ${VALID_ROLES.join(", ")}.`),
      );
    }

    if (req.params.id === req.user._id.toString() && role !== "admin") {
      return next(createError("You cannot change your own admin role."));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    );

    if (!user) return next(createError("User not found.", 404));

    res.status(200).json({
      success: true,
      message: `User role updated to "${role}".`,
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return next(createError("isActive must be a boolean."));
    }

    if (req.params.id === req.user._id.toString()) {
      return next(createError("You cannot deactivate your own account."));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true },
    );

    if (!user) return next(createError("User not found.", 404));

    const action = isActive ? "activated" : "deactivated";

    res.status(200).json({
      success: true,
      message: `User account ${action}.`,
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return next(createError("You cannot delete your own account."));
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return next(createError("User not found.", 404));

    res.status(200).json({
      success: true,
      message: "User deleted permanently.",
    });
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const [roleStats, statusStats, recentUsers] = await Promise.all([
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      User.aggregate([{ $group: { _id: "$isActive", count: { $sum: 1 } } }]),

      User.find()
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const total = await User.countDocuments();
    const active = statusStats.find((s) => s._id === true)?.count || 0;
    const inactive = statusStats.find((s) => s._id === false)?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        byRole: roleStats.map((r) => ({ role: r._id, count: r.count })),
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  updateRole,
  updateStatus,
  deleteUser,
  getUserStats,
};
