const userService = require("../services/user.service");
const bcrypt = require("bcryptjs"); 
const User = require("../models/User"); 
const Staff = require("../models/StaffModel")

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
   console.log(req.body);
  console.log(req.file);
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.file = req.file; 
    }
    delete updateData.role;
    delete updateData.email;

    const user = await userService.updateProfile(req.user.id, updateData);

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found in token",
      });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Fetch user with select password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
    });
  }
};


const staffchangePassword = async (req, res) => {
  console.log("req.body", req.body)
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found in token",
      });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const staffMember = await Staff.findById(userId).select("+password");

    if (!staffMember) {
      return res.status(404).json({
        success: false,
        message: "Staff user not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, staffMember.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    staffMember.password = await bcrypt.hash(newPassword, salt);
    
    await staffMember.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("Staff Change Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  staffchangePassword
};