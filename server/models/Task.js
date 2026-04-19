const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    crewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      default: null,
    },
    deadline:  { type: Date,    default: null },
    completed: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);