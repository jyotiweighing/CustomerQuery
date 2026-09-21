const Department = require('../models/Department');


exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch departments',
      error: error.message,
    });
  }
};


exports.addDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a department name',
      });
    }

    // Check if department already exists
    const existingDept = await Department.findOne({ name: name.trim() });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name already exists',
      });
    }

    const department = await Department.create({ name: name.trim() });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to create department',
      error: error.message,
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid department name',
      });
    }

    let department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    department = await Department.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to update department',
      error: error.message,
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to delete department',
      error: error.message,
    });
  }
};