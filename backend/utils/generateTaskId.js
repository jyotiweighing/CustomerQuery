const Counter = require("../models/counterModel");

const generateTaskId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "taskId" },
    { $inc: { sequenceValue: 1 } },
    {
      new: true,
      upsert: true,
    }
  );

  return `TSK-${String(counter.sequenceValue).padStart(4, "0")}`;
};

module.exports = generateTaskId;