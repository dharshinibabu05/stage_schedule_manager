const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    date:    { type: Date,   required: true },
    venue:   { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);