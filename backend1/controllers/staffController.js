const Staff = require("../models/StaffModel");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs"); 
const Department = require("../models/Department")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all staff members
exports.getStaff = async (req, res) => {
  try {
    const staffList = await Staff.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: staffList.length,
      staff: staffList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff list",
      error: error.message,
    });
  }
};

// Add new staff member with Cloudinary upload support

// exports.addStaff = async (req, res) => {
//   try {
//     const { name, email, phone, department, designation, status, avatar } = req.body;
//     console.log("department", req.body)

//     if (!name || !email || !phone || !department) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields (Name, Email, Phone, Department)",
//       });
//     }

//     let avatarUrl = "";

//     if (avatar && avatar.startsWith("data:image")) {
//       const uploadResponse = await cloudinary.uploader.upload(avatar, {
//         folder: "staff_avatars",
//       });
//       avatarUrl = uploadResponse.secure_url;
//     }

//     const defaultPassword = "staff@123";
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(defaultPassword, salt);

//     const staffData = {
//       name,
//       email,
//       phone,  
//       department,
//       designation: designation || "Support Agent",
//       status: status || "Active",
//       role: "staff",              
//       password: hashedPassword, 
//     };

//     if (avatarUrl) {
//       staffData.avatar = avatarUrl;
//     }

//     const newStaff = await Staff.create(staffData);
//     const populatedStaff = await Staff.findById(newStaff._id).populate(
//       "department",
//       "name"
//     );

//     res.status(201).json({
//       success: true,
//       message: "Staff member added successfully with default password 'staff@123'",
//       staff: populatedStaff,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "A staff member with this Email or Phone already exists",
//       });
//     }

//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to add staff member",
//     });
//   }
// };
exports.addStaff = async (req, res) => {
  try {
    // const { name, email, phone, department, designation, status, avatar } = req.body;
    // console.log("department", req.body);

    // if (!name || !email || !phone || !department) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please fill all required fields (Name, Email, Phone, Department)",
    //   });
    // }
const { name, email, phone, department, designation, status, avatar } = req.body;

    if (!name || !email || !phone || !department) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // 1. Department ka naam fetch karein
    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    let avatarUrl = "";

    if (avatar && avatar.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "staff_avatars",
      });
      avatarUrl = uploadResponse.secure_url;
    }

    const defaultPassword = "staff@123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // const staffData = {
    //   name,
    //   email,
    //   phone,  
    //   department, 
    //   designation: designation || "Support Agent",
    //   status: status || "Active",
    //   role: "staff",              
    //   password: hashedPassword, 
    // };
    const staffData = {
      name,
      email,
      phone,  
      department: department,        
      departmentname: dept.name,     
      designation: designation || "Support Agent",
      status: status || "Active",
      role: "staff",              
      password: hashedPassword, 
    };

    if (avatarUrl) {
      staffData.avatar = avatarUrl;
    }

    const newStaff = await Staff.create(staffData);
    
    const populatedStaff = await Staff.findById(newStaff._id).populate(
      "department",
      "name"
    );

    const staffObj = populatedStaff.toObject();

    if (staffObj.department) {
      staffObj.departmentname = staffObj.department.name;
      staffObj.department = staffObj.department._id;     
    } else {
      staffObj.departmentname = "N/A";
    }

    // 5. Aapka customized flat response return karein
    res.status(201).json({
      success: true,
      message: "Staff member added successfully with default password 'staff@123'",
      staff: staffObj, 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A staff member with this Email or Phone already exists",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to add staff member",
    });
  }
};
// Update staff details
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, designation, status, avatar } = req.body;

    let updateData = { name, email, phone, department, designation, status };

    if (avatar && avatar.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "staff_avatars",
      });
      updateData.avatar = uploadResponse.secure_url;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("department", "name");

    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff details updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or Phone already used by another staff member",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update staff member",
    });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete staff member",
    });
  }
};

exports.getstafftask = async (req, res) => {
  try {
    const staffWithTasks = await Staff.aggregate([
      {
        $lookup: {
          from: "tasks", 
          let: { staffIdString: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$assignedStaff.staffId", "$$staffIdString"]
                }
              }
            }
          ],
          as: "tasks"
        }
      },
      {
        $project: {
          password: 0,
          otp: 0,
          otpExpireAt: 0,
          __v: 0
        }
      }
    ]);
    if (!staffWithTasks || staffWithTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No staff members found",
      });
    }

    return res.status(200).json({
      success: true,
      count: staffWithTasks.length,
      data: staffWithTasks
    });

  } catch (error) {
    console.error("Error in getstafftask controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
