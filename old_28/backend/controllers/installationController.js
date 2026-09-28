const installationService = require("../services/installationService");

// exports.createInstallation = async (req, res) => {
//   try {
//     const installation = await installationService.createInstallation(req.body);
//     res.status(201).json({
//       success: true,
//       message: "Installation created successfully",
//       data: installation,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create installation",
//       error: error.message,
//     });
//   }
// };

// exports.getInstallations = async (req, res) => {
//   try {
//     const installations = await installationService.getAllInstallations();
//     res.status(200).json({
//       success: true,
//       count: installations.length,
//       data: installations,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch installations",
//       error: error.message,
//     });
//   }
// };

// exports.updateInstallation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const installation = await installationService.updateInstallation(id, req.body);

//     if (!installation) {
//       return res.status(404).json({
//         success: false,
//         message: "Installation not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Installation updated successfully",
//       data: installation,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update installation",
//       error: error.message,
//     });
//   }
// };

const mongoose = require("mongoose");


// exports.createInstallation = async (req, res) => {
//   try {
//     const installation = await installationService.createInstallation(req.body);
//     res.status(201).json({
//       success: true,
//       message: "Installation created successfully",
//       data: installation,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create installation",
//       error: error.message,
//     });
//   }
// };

exports.createInstallation = async (req, res) => {
  try {
    const installation = await installationService.createInstallation(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Installation created successfully",
      data: installation,
    });
  } catch (error) {
    // Handling MongoDB Duplicate Key Errors (e.g. Unique poNumber or billNumber conflict)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate entry error: ${field} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

exports.updateInstallation = async (req, res) => {
  try {
    const { id } = req.params;
    const installation = await installationService.updateInstallation(
      id,
      req.body,
    );

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: "Installation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Installation updated successfully",
      data: installation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update installation",
      error: error.message,
    });
  }
};

exports.getInstallations = async (req, res) => {
  try {
    const installations = await installationService.getAllInstallations();
    res.status(200).json({
      success: true,
      count: installations.length,
      data: installations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch installations",
      error: error.message,
    });
  }
};