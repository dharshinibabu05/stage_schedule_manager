const express = require("express");
const router  = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/TaskController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getTasks)
  .post(protect, authorize("admin", "manager"), createTask);

router.route("/:id")
  .put(protect, updateTask)                        // crew can mark complete
  .delete(protect, authorize("admin", "manager"), deleteTask);

module.exports = router;