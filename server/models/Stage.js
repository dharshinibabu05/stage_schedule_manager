const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    capacity: { type: Number, default: 0 },
    location: { type: String, default: "" },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stage", stageSchema);