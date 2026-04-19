const Event = require("../models/Event");

// ─── @route  POST /api/events ─────────────────────────────────────────────────
// ─── @access Private (admin)
const createEvent = async (req, res) => {
  try {
    const { name, date, venue } = req.body;

    if (!name || !date || !venue) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      name,
      date,
      venue,
      createdBy: req.user._id,
    });

    // Notify all connected clients about the new event
    req.io.emit("eventCreated", event);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/events ──────────────────────────────────────────────────
// ─── @access Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate("createdBy", "firstName lastName");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/events/:id ─────────────────────────────────────────────
// ─── @access Private
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "firstName lastName");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/events/:id ─────────────────────────────────────────────
// ─── @access Private (admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    req.io.emit("eventUpdated", event);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/events/:id ──────────────────────────────────────────
// ─── @access Private (admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    req.io.emit("eventDeleted", { id: req.params.id });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };