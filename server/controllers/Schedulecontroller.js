const Schedule = require("../models/Schedule");

// ─── Time Conflict Detection Helper ──────────────────────────────────────────
// Returns true if two time ranges overlap
const hasConflict = (newStart, newEnd, existingStart, existingEnd) => {
  return newStart < existingEnd && newEnd > existingStart;
};

// ─── @route  POST /api/schedules ─────────────────────────────────────────────
const createSchedule = async (req, res) => {
  try {
    const {
      eventId,
      stageId,
      performerId,
      performanceName,
      startTime,
      endTime,
      rehearsalTime,
    } = req.body;

    if (!eventId || !stageId || !performanceName || !startTime || !endTime) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // ─── Check for time conflicts on the same stage ───────────────────────
    const existingSchedules = await Schedule.find({ stageId });

    const conflict = existingSchedules.find((s) =>
      hasConflict(startTime, endTime, s.startTime, s.endTime)
    );

    if (conflict) {
      return res.status(409).json({
        message: `Time conflict! "${conflict.performanceName}" is already scheduled from ${conflict.startTime} to ${conflict.endTime} on this stage.`,
        conflict,
      });
    }

    const schedule = await Schedule.create({
      eventId,
      stageId,
      performerId: performerId || null,
      performanceName,
      startTime,
      endTime,
      rehearsalTime: rehearsalTime || "",
    });

    const populated = await Schedule.findById(schedule._id)
      .populate("eventId", "name date")
      .populate("stageId", "name")
      .populate("performerId", "firstName lastName email");

    // Notify all connected clients
    req.io.emit("scheduleCreated", populated);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/schedules ───────────────────────────────────────────────
// ─── Optional filters: ?eventId=xxx  or  ?stageId=xxx
const getSchedules = async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.stageId) filter.stageId = req.query.stageId;

    const schedules = await Schedule.find(filter)
      .sort({ startTime: 1 })
      .populate("eventId", "name date venue")
      .populate("stageId", "name")
      .populate("performerId", "firstName lastName email");

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/schedules/:id ──────────────────────────────────────────
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("eventId", "name date venue")
      .populate("stageId", "name")
      .populate("performerId", "firstName lastName email");

    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/schedules/:id ──────────────────────────────────────────
const updateSchedule = async (req, res) => {
  try {
    const { startTime, endTime, stageId } = req.body;
    const scheduleId = req.params.id;

    // Re-check conflicts if times are being updated
    if (startTime && endTime && stageId) {
      const existing = await Schedule.find({
        stageId,
        _id: { $ne: scheduleId }, // exclude current schedule
      });

      const conflict = existing.find((s) =>
        hasConflict(startTime, endTime, s.startTime, s.endTime)
      );

      if (conflict) {
        return res.status(409).json({
          message: `Time conflict with "${conflict.performanceName}" (${conflict.startTime} - ${conflict.endTime})`,
        });
      }
    }

    const schedule = await Schedule.findByIdAndUpdate(scheduleId, req.body, { new: true })
      .populate("eventId", "name date")
      .populate("stageId", "name")
      .populate("performerId", "firstName lastName email");

    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    req.io.emit("scheduleUpdated", schedule);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/schedules/:id ───────────────────────────────────────
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    req.io.emit("scheduleDeleted", { id: req.params.id });
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};