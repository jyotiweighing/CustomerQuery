const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");


const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);

    const token = generateToken(user);

    res.status(201).json({
      success: true,

      message: "Account Created Successfully",

      token,

      user: {
        id: user._id,

        name: user.name,

        companyName: user.companyName,

        email: user.email,

        mobile: user.mobile,

        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,

      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
      console.log("body", req.body)
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const loginstaff = async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    let user = null;

    try {
      user = await authService.loginstaff(email, password);
    } catch (staffErr) {
      console.log("Not found in Staff, checking User collection...");
    }

    if (!user) {
      try {
        user = await authService.login(email, password);
      } catch (userErr) {
        throw new Error("Invalid Email or Password");
      }
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Login failed. Invalid Credentials.",
    });
  }
};

// const loginstaff = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await authService.loginstaff(email, password);

//     const token = generateToken(user);

//     res.status(200).json({
//       success: true,
//       message: "Login Successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         companyName: user.companyName,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//         image: user.image,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body);
    res.status(200).json({
      success: true,

      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,

      message: err.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const result = await authService.verify(req.body);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    await authService.resendOtp(req.body);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// const staffforgotPassword = async (req, res) => {
//   try {
//     await authService.staffforgotPassword(req.body);
//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const staffverify = async (req, res) => {
//   try {
//     const result = await authService.staffverify(req.body);
//     res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       data: result,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const staffresendOtp = async (req, res) => {
//   try {
//     await authService.staffresendOtp(req.body);
//     res.status(200).json({
//       success: true,
//       message: "OTP resent successfully",
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const staffresetPassword = async (req, res) => {
//   try {
//     const result = await authService.staffresetPassword(req.body);
//     res.status(200).json({
//       success: true,
//       message: "Password reset successfully",
//       data: result,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const staffforgotPassword = async (req, res) => {
  try {
    await authService.staffforgotPassword(req.body);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const staffverify = async (req, res) => {
  try {
    const result = await authService.staffverify(req.body);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const staffresendOtp = async (req, res) => {
  try {
    await authService.staffresendOtp(req.body);
    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const staffresetPassword = async (req, res) => {
  try {
    const result = await authService.staffresetPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
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
