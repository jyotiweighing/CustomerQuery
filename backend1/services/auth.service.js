const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Staff = require("../models/StaffModel")
const sendOTP = require("../utils/sendMail");
const authService = require("../services/auth.service");

const signup = async (body) => {

    const {
        name,
        companyName,
        email,
        mobile,
        password
    } = body;

    const emailExist = await User.findOne({ email });

    if (emailExist) {
        throw new Error("Email already registered");
    }

    const mobileExist = await User.findOne({ mobile });

    if (mobileExist) {
        throw new Error("Mobile number already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

        name,

        companyName,

        email,

        mobile,

        password: hashPassword,

    });

    return user;
};


const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Password");
  }

  return user;
};

const loginstaff = async (email, password) => {
  const user = await Staff.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Password");
  }

  return user;
};


const forgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email not registered");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpireAt = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendOTP(email, otp);
    return true;
};


const verify = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp) {
    throw new Error("OTP not found. Please request a new OTP.");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpireAt < new Date()) {
    throw new Error("OTP has expired");
  }

  // OTP verified successfully
  user.otp = null;
  user.otpExpireAt = null;

  await user.save();

  return {
    email: user.email,
  };
};

const resendOtp = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Generate New OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendOTP(user.email, otp);

  return true;
};


const resetPassword = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;

  // Google user bhi password set kar sakta hai
  user.isGoogleUser = false;

  await user.save();

  return {
    name: user.name,
    email: user.email,
  };
};


// const staffforgotPassword = async ({ email }) => {
//   const staff = await Staff.findOne({ email });
//   if (!staff) {
//     throw new Error("Email not registered as Staff");
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   staff.otp = otp;
//   staff.otpExpireAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
//   await staff.save();
  
//   await sendOTP(email, otp);
//   return true;
// };

// const staffverify = async ({ email, otp }) => {
//   if (!email || !otp) {
//     throw new Error("Email and OTP are required");
//   }

//   const staff = await Staff.findOne({ email });

//   if (!staff) {
//     throw new Error("Staff member not found");
//   }

//   if (!staff.otp) {
//     throw new Error("OTP not found. Please request a new OTP.");
//   }

//   if (staff.otp !== otp) {
//     throw new Error("Invalid OTP");
//   }

//   if (staff.otpExpireAt < new Date()) {
//     throw new Error("OTP has expired");
//   }

//   // OTP verified successfully
//   staff.otp = null;
//   staff.otpExpireAt = null;

//   await staff.save();

//   return {
//     email: staff.email,
//   };
// };

// const staffresendOtp = async ({ email }) => {
//   if (!email) {
//     throw new Error("Email is required");
//   }

//   const staff = await Staff.findOne({ email });

//   if (!staff) {
//     throw new Error("Staff member not found");
//   }

//   // Generate New OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   staff.otp = otp;
//   staff.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

//   await staff.save();

//   await sendOTP(staff.email, otp);

//   return true;
// };

// const staffresetPassword = async ({ email, password }) => {
//   if (!email || !password) {
//     throw new Error("Email and Password are required");
//   }

//   // FIX: Changed User.findOne to Staff.findOne
//   const staff = await Staff.findOne({ email });

//   if (!staff) {
//     throw new Error("Staff member not found");
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   staff.password = hashedPassword;

//   // Agar staff model me isGoogleUser jaisi field hai to hi ye line use karein,
//   // warna ise hata dein.
//   if (staff.isGoogleUser !== undefined) {
//     staff.isGoogleUser = false;
//   }

//   await staff.save();

//   return {
//     name: staff.name,
//     email: staff.email,
//   };
// };


const staffforgotPassword = async ({ email }) => {
  const staff = await Staff.findOne({ email });
  if (!staff) {
    throw new Error("Email not registered as Staff");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  staff.otp = otp;
  staff.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  await staff.save();

  await sendOTP(email, otp);
  return true;
};

const staffverify = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const staff = await Staff.findOne({ email });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  if (!staff.otp) {
    throw new Error("OTP not found. Please request a new OTP.");
  }

  if (staff.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (staff.otpExpireAt < new Date()) {
    throw new Error("OTP has expired");
  }

  // Clear OTP fields after successful verification
  staff.otp = null;
  staff.otpExpireAt = null;
  await staff.save();

  return { email: staff.email };
};

const staffresendOtp = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const staff = await Staff.findOne({ email });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  staff.otp = otp;
  staff.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);
  await staff.save();

  await sendOTP(staff.email, otp);
  return true;
};

const staffresetPassword = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const staff = await Staff.findOne({ email });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  staff.password = hashedPassword;

  if (staff.isGoogleUser !== undefined) {
    staff.isGoogleUser = false;
  }

  await staff.save();

  return {
    name: staff.name,
    email: staff.email,
  };
};


module.exports = {
  signup,
  login,
  forgotPassword,
  verify,
  resendOtp,
  resetPassword,
  loginstaff,
  staffforgotPassword,
  staffverify,
  staffresendOtp,
  staffresetPassword
};