const { default: mongoose } = require("mongoose");
const mongoode = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLenght: [2, "Name must be at least 2 charcaters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    department: {
      type: String,
      enum: ["sales", "accounts", "hr", "stock"],
      required: [true, "Department is required"],
    },
    position: {
      type: String,
      enum: [
        "manager",
        "salesman",
        "accountant",
        "stock incharge",
        "hr officer",
      ],
      required: [true, "Position is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Staff", staffSchema);
