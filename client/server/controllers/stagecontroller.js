const Stage = require("../models/Stage");

// ─── @route  POST /api/stages ─────────────────────────────────────────────────
const createStage = async (req, res) => {
  try {
    const { name, capacity, location, eventId } = req.body;

    if (!name || !eventId) {
      return res.status(400).json({ message: "Stage name and event are required" });
    }

    const stage = await Stage.create({ name, capacity, location, eventId });
    req.io.emit("stageCreated", stage);
    res.status(201).json(stage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/stages ──────────────────────────────────────────────────
// ─── @route  GET /api/stages?eventId=xxx  (filtered)
const getStages = async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    const stages = await Stage.find(filter).populate("eventId", "name date venue");
    res.json(stages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/stages/:id ─────────────────────────────────────────────
const updateStage = async (req, res) => {
  try {
    const stage = await Stage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stage) return res.status(404).json({ message: "Stage not found" });
    res.json(stage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/stages/:id ──────────────────────────────────────────
const deleteStage = async (req, res) => {
  try {
    const stage = await Stage.findByIdAndDelete(req.params.id);
    if (!stage) return res.status(404).json({ message: "Stage not found" });
    req.io.emit("stageDeleted", { id: req.params.id });
    res.json({ message: "Stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStage, getStages, updateStage, deleteStage };