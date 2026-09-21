const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['assigned', 'due', 'overdue', 'status', 'admin'],
      default: 'admin',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);