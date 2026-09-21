// const mongoose = require("mongoose");

// const installationSchema = new mongoose.Schema(
//   {
//     poNumber: { type: String, required: true, trim: true },
//     billNumber: { type: String, required: false, trim: true },
//     billDate: { type: Date },
//     partyName: { type: String, required: true, trim: true },
//     address: { type: String },
//     location: { type: String },
//     contactPerson: { type: String },
//     mobileNo: { type: String, required: true },
//     alternateNo: { type: String },
//     email: { type: String, lowercase: true, trim: true },
//     amount: { type: Number, default: 0 },
//     installationDate: { type: Date },
//     softwareDetails: { type: String },
//     softwareType: {
//       type: String,
//       enum: ["Desktop", "Web App", "Cloud ERP"],
//       default: "Desktop",
//     },
//     // assignedStaff: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "Staff", // Staff Model Ref
//     // },
//     assignedStaff: {
//       staffId: { type: String },
//       fullName: String,
//       phone: String,
//       email: String,
//       designation: String,
//     },
//     salesPersonName: { type: String },
//     status: {
//       type: String,
//       enum: ["In Progress", "Pending", "Completed"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Installation", installationSchema);
const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema(
  {
    poNumber: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true 
    },
    billNumber: { 
      type: String, 
      required: false, 
      trim: true, 
      unique: true, 
      sparse: true 
    },
    billDate: { type: Date },
    partyName: { type: String, required: true, trim: true },
    address: { type: String },
    location: { type: String },
    contactPerson: { type: String },
    mobileNo: { type: String, required: true },
    alternateNo: { type: String },
    email: { type: String, lowercase: true, trim: true },
    amount: { type: Number, default: 0 },
    installationDate: { type: Date },
    expiryDate: { type: Date }, // NEW: Expiry Date Field Added
    softwareDetails: { type: String },
    softwareType: {
      type: String,
      enum: ["Desktop", "Web App", "Cloud ERP"],
      default: "Desktop",
    },
    assignedStaff: {
      staffId: { type: String },
      fullName: String,
      phone: String,
      email: String,
      designation: String,
    },
    salesPersonName: { type: String },
    status: {
      type: String,
      enum: ["In Progress", "Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

installationSchema.pre("save", function () {
  // Agar status modify hua hai ya document new hai
  if (this.isModified("status")) {
    if (this.status === "Completed") {
      // Current date me 375 days add karein
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 375);
      this.expiryDate = currentDate;
    } else {
      // Agar status "Completed" ke alawa kuch aur ho to expiryDate remove kar dein
      this.expiryDate = undefined;
    }
  }
});
module.exports = mongoose.model("Installation", installationSchema);

// const installationSchema = new mongoose.Schema(
//   {
//     poNumber: { 
//       type: String, 
//       required: true, 
//       trim: true, 
//       unique: true // Unique Constraint Added
//     },
//     billNumber: { 
//       type: String, 
//       required: false, 
//       trim: true, 
//       unique: true, // Unique Constraint Added
//       sparse: true  // Multiple 'null' / 'undefined' documents ke conflicts rokne ke liye
//     },
//     billDate: { type: Date },
//     partyName: { type: String, required: true, trim: true },
//     address: { type: String },
//     location: { type: String },
//     contactPerson: { type: String },
//     mobileNo: { type: String, required: true },
//     alternateNo: { type: String },
//     email: { type: String, lowercase: true, trim: true },
//     amount: { type: Number, default: 0 },
//     installationDate: { type: Date },
//     softwareDetails: { type: String },
//     softwareType: {
//       type: String,
//       enum: ["Desktop", "Web App", "Cloud ERP"],
//       default: "Desktop",
//     },
//     assignedStaff: {
//       staffId: { type: String },
//       fullName: String,
//       phone: String,
//       email: String,
//       designation: String,
//     },
//     salesPersonName: { type: String },
//     status: {
//       type: String,
//       enum: ["In Progress", "Pending", "Completed"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true },
// );
// module.exports = mongoose.model("Installation", installationSchema);