const express = require("express");
const router  = express.Router();
const {
  createStage,
  getStages,
  updateStage,
  deleteStage,
} = require("../controllers/StageController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getStages)
  .post(protect, authorize("admin", "manager"), createStage);

router.route("/:id")
  .put(protect,    authorize("admin", "manager"), updateStage)
  .delete(protect, authorize("admin"),            deleteStage);

module.exports = router;