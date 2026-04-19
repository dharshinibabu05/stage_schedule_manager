const express = require("express");
const router  = express.Router();
const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getSchedules)
  .post(protect, authorize("admin", "manager"), createSchedule);

router.route("/:id")
  .get(protect, getScheduleById)
  .put(protect,    authorize("admin", "manager"), updateSchedule)
  .delete(protect, authorize("admin", "manager"), deleteSchedule);

module.exports = router;