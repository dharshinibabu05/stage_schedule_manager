const Task = require("../models/Task");

// ─── @route  POST /api/tasks ──────────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { name, crewId, stageId, deadline } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Task name is required" });
    }

    const task = await Task.create({
      name,
      crewId:    crewId    || null,
      stageId:   stageId   || null,
      deadline:  deadline  || null,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/tasks ───────────────────────────────────────────────────
const getTasks = async (req, res) => {
  try {
    // Crew members only see their own tasks; admins/managers see all
    let filter = {};
    if (req.user.role === "crew") {
      filter.crewId = req.user._id;
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("crewId",    "firstName lastName")
      .populate("stageId",   "name")
      .populate("createdBy", "firstName lastName");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/tasks/:id ───────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/tasks/:id ───────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };