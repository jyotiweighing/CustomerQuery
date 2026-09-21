const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["customer", "staff", "admin"],
      required: true,
    },
    senderId: String,
    senderName: String,
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const querySchema = new mongoose.Schema(
  {
    queryId: { type: String, unique: true, index: true },
    customer: {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      customerCode: String,
      name: String,
      email: String,
      mobile: String,
      companyName: String,
    },
    subject: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    product: { type: String, default: "" },
    softwareType: {
      type: String,
      enum: [
        "Standard Software",
        "Photo Capturing",
        "Master Slave",
        "Unmaned Software",
      ],
      default: "",
    },
    softwareFeature: {
      type: [String],
      enum: ["Email", "SMS", "Cloud", "Whatsapp"],
      default: [],
    },
    // material: {
    //   type: [String],
    //   enum: [
    //     "IP Camera",
    //     "Traffic",
    //     "AWPR Count",
    //     "Vehicle Position Server (VPS)",
    //     "UHF Radar",
    //     "VHF Tag",
    //     "Boom Barriers",
    //     "I/O Controller",
    //     "Pole",
    //     "Computer",
    //     "Printer",
    //   ],
    //   default: [],
    // },

    material: [
      {
        name: {
          type: String,
          enum: [
            "IP Camera",
            "Traffic Light",
            "ANPR Camera",
            "Vehicle Position Sensor (VPS)",
            "VHF Reader",
            "VHF Tag",
            "Boom Barrier",
            "I/O Controller",
            "Pole",
            "Computer",
            "Printer",
          ],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    description: { type: String, required: true },
    preferredContact: {
      type: String,
      enum: ["Call", "Email", "Chat"],
      required: true,
    },
    partyDetails: {
      poNumber: { type: String, default: "" },
      billNumber: { type: String, default: "" },
      billDate: { type: Date, default: null },
      partyName: { type: String, required: true },
      address: { type: String, default: "" },
      location: { type: String, default: "" },
      contactPerson: { type: String, required: true },
      mobileNo: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
    },
    status: {
      type: String,
      enum: ["Open", "Assigned", "Picked", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    pickedBy: {
      userId: String,
      name: String,
      email: String,
      role: { type: String, enum: ["staff", "admin", null], default: null },
      pickedAt: Date,
    },
    assignedStaff: {
      staffId: String,
      name: String,
      email: String,
      phone: String,
      designation: String,
      department: String,
      assignedAt: Date,
    },
    assignedBy: {
      userId: String,
      name: String,
      email: String,
      role: { type: String, default: "admin" },
      assignedAt: Date,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    taskCode: { type: String, default: "" },
    messages: [messageSchema],
  },
  { timestamps: true },
);

querySchema.pre("save", async function () {
  if (this.isNew && !this.queryId) {
    const last = await mongoose
      .model("Query")
      .findOne({ queryId: /^QRY-/ })
      .sort({ createdAt: -1 })
      .lean();
    let next = 1;
    if (last?.queryId) {
      const parsed = Number(last.queryId.split("-")[1]);
      if (Number.isFinite(parsed)) next = parsed + 1;
    }
    this.queryId = `QRY-${String(next).padStart(5, "0")}`;
  }
});

module.exports = mongoose.models.Query || mongoose.model("Query", querySchema);
