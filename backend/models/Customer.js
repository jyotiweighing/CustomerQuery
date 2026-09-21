const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true, index: true },
    name: { type: String, required: [true, "Customer name is required"], trim: true },
    companyName: { type: String, default: "", trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: [true, "Mobile number is required"], unique: true, trim: true },
    password: { type: String, required: true, select: false },
    address: { type: String, default: "" },
    location: { type: String, default: "" },
    role: { type: String, enum: ["customer"], default: "customer" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    otp: { type: String, default: null, select: false },
    otpExpireAt: { type: Date, default: null, select: false },
    resetVerifiedAt: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

customerSchema.pre("save", async function () {
  if (this.isNew && !this.customerId) {
    const last = await mongoose.model("Customer").findOne({ customerId: /^CUS-/ }).sort({ createdAt: -1 }).lean();
    let next = 1;
    if (last?.customerId) {
      const parsed = Number(last.customerId.split("-")[1]);
      if (Number.isFinite(parsed)) next = parsed + 1;
    }
    this.customerId = `CUS-${String(next).padStart(5, "0")}`;
  }
});

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
