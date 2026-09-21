const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const sendOTP = require("../utils/sendMail");
const { generateToken } = require("../utils/jwt");

const normalizeEmail = (email = "") => email.trim().toLowerCase();

exports.registerCustomer = async (req, res) => {
  try {
    const { name, companyName, email, mobile, password, address, location } = req.body;
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: "name, email, mobile and password are required" });
    }
    const cleanEmail = normalizeEmail(email);
    if (await Customer.findOne({ $or: [{ email: cleanEmail }, { mobile }] })) {
      return res.status(409).json({ success: false, message: "Customer with this email or mobile already exists" });
    }
    const customer = await Customer.create({
      name, companyName, email: cleanEmail, mobile,
      password: await bcrypt.hash(password, 10), address, location,
    });
    return res.status(201).json({ success: true, message: "Customer created successfully", data: customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, customerId, password } = req.body;
    if ((!email && !customerId) || !password) {
      return res.status(400).json({ success: false, message: "Email/Customer ID and password are required" });
    }
    const lookup = email ? { email: normalizeEmail(email) } : { customerId: customerId.trim().toUpperCase() };
    const customer = await Customer.findOne(lookup).select("+password");
    if (!customer || !customer.isActive || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ success: false, message: "Invalid customer credentials" });
    }
    customer.lastLogin = new Date();
    await customer.save();
    const token = generateToken(customer);
    return res.json({
      success: true, message: "Customer login successful", token,
      customer: {
        _id: customer._id, customerId: customer.customerId, name: customer.name,
        companyName: customer.companyName, email: customer.email, mobile: customer.mobile,
        address: customer.address, location: customer.location, role: customer.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const customer = await Customer.findOne({ email }).select("+otp +otpExpireAt +resetVerifiedAt");
    if (!customer) return res.status(404).json({ success: false, message: "Customer email is not registered" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    customer.otp = otp;
    customer.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);
    customer.resetVerifiedAt = null;
    await customer.save();
    await sendOTP(email, otp);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;
    const customer = await Customer.findOne({ email }).select("+otp +otpExpireAt +resetVerifiedAt");
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    if (!customer.otp || customer.otp !== String(otp)) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (!customer.otpExpireAt || customer.otpExpireAt < new Date()) return res.status(400).json({ success: false, message: "OTP has expired" });
    customer.otp = null;
    customer.otpExpireAt = null;
    customer.resetVerifiedAt = new Date();
    await customer.save();
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.resendOtp = exports.forgotPassword;

exports.resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    const customer = await Customer.findOne({ email }).select("+password +resetVerifiedAt");
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    if (!customer.resetVerifiedAt || Date.now() - new Date(customer.resetVerifiedAt).getTime() > 10 * 60 * 1000) {
      return res.status(400).json({ success: false, message: "Verify OTP before resetting password" });
    }
    customer.password = await bcrypt.hash(password, 10);
    customer.resetVerifiedAt = null;
    await customer.save();
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    if (!["admin", "staff"].includes(String(req.user?.role || "").toLowerCase())) return res.status(403).json({ success: false, message: "Admin/Staff access only" });
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: customers.length, data: customers });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

exports.getMe = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    return res.json({ success: true, data: customer });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};
