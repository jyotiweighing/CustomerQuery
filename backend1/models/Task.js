const mongoose = require("mongoose");

const remarkSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    default: 'Staff' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});
const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    softwareDetails: String,
    softwareType: String,
    description: String,

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // Automatic calculate hoga Status ke hisab se
    progress: {
      type: Number,
      default: 0,
    },

    remarks: [
    remarkSchema
    ],

   statusHistory: [
    {
      status: { type: String, required: true },
      date: { type: Date, default: Date.now },
      note: { type: String, default: 'Status updated' },
      updatedBy: { type: String } // optional: staff name/ID
    }
  ],

    // Cloudinary file response save karne ke liye
    files: [
      {
        label: String, // e.g., 'Screenshot', 'Document'
        fileUrl: String, // Cloudinary secure_url
        publicId: String, // Cloudinary public_id
        fileType: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    assignedStaff: {
      staffId: String,
      name: String,
      email: String,
      phone: String,
      designation: String,
      department: String,
    },

    partyDetails: {
      poNumber: String,
      billNumber: String,
      billDate: Date,
      partyName: String,
      address: String,
      location: String,
      contactPerson: String,
      mobileNo: String,
      alternateNo: String,
      email: String,
      salesPersonName: String,
    },

    installationId: String,
    dueDate: Date,
  },
  {
    timestamps: true,
  }
);

// Automatic calculation for Task ID & Progress percentage
// taskSchema.pre("save", async function (next) {
//   // 1. Auto Progress Calculation
//   if (this.status === "Pending") {
//     this.progress = 0;
//   } else if (this.status === "In Progress") {
//     this.progress = 10;
//   } else if (this.status === "Completed") {
//     this.progress = 100;
//   }

//   // 2. Auto Task ID Generation
//   if (this.isNew && !this.taskId) {
//     const lastTask = await mongoose
//       .model("Task")
//       .findOne()
//       .sort({ createdAt: -1 });

//     let nextNumber = 1;
//     if (lastTask?.taskId) {
//       const parts = lastTask.taskId.split("-");
//       if (parts[1]) nextNumber = parseInt(parts[1], 10) + 1;
//     }
//     this.taskId = `TSK-${String(nextNumber).padStart(4, "0")}`;
//   }

//   next();
// });

taskSchema.pre("save", async function () {
  // 1. Auto Progress Calculation
  if (this.status === "Pending") {
    this.progress = 0;
  } else if (this.status === "In Progress") {
    this.progress = 10;
  } else if (this.status === "Completed") {
    this.progress = 100;
  }

  // 2. Auto Task ID Generation
  if (this.isNew && !this.taskId) {
    const lastTask = await mongoose
      .model("Task")
      .findOne()
      .sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastTask?.taskId) {
      const parts = lastTask.taskId.split("-");
      if (parts[1]) nextNumber = parseInt(parts[1], 10) + 1;
    }
    this.taskId = `TSK-${String(nextNumber).padStart(4, "0")}`;
  }
  
});
module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);