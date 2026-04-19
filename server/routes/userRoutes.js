const express = require("express");
const router  = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/usercontroller");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, authorize("admin", "manager"), getUsers);

router.route("/:id")
  .get(protect, getUserById)
  .put(protect,    authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;