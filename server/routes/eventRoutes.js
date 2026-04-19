const express = require("express");
const router  = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/EventController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getEvents)
  .post(protect, authorize("admin"), createEvent);

router.route("/:id")
  .get(protect, getEventById)
  .put(protect,    authorize("admin"), updateEvent)
  .delete(protect, authorize("admin"), deleteEvent);

module.exports = router;