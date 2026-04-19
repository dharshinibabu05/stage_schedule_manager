const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      required: true,
    },
    performerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    performanceName: { type: String, required: true },
    startTime:       { type: String, required: true }, // "HH:MM" format
    endTime:         { type: String, required: true }, // "HH:MM" format
    rehearsalTime:   { type: String, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "on-time", "delayed", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);