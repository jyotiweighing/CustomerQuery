const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
  department: {
    type: String, 
    required: [true, "Department is required"],
  },
  departmentname: {
    type: String, 
    required: [true, "Department name is required"],
  },
    designation: {
      type: String,
      default: "Support Agent",
    },
    avatar: {
      type: String,
      default: "",
    },
    assignedQueries: {
      type: Number,
      default: 0,
    },
    resolvedQueries: {
      type: Number,
      default: 0,
    },
    performance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["Active", "On Leave"],
      default: "Active",
    },
    password: { type: String, required: true },
    role: { type: String, default: "staff" },

    otp: { type: String, default: null },
    otpExpireAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Staff || mongoose.model("Staff", staffSchema);