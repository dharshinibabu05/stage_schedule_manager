const User = require("../models/User");

// ─── @route  GET /api/users ───────────────────────────────────────────────────
// ─── @access Private (admin / manager)
// ─── Optional: ?role=performer  or  ?role=crew
const getUsers = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).select("-password").sort({ firstName: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  GET /api/users/:id ──────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/users/:id ──────────────────────────────────────────────
// ─── @access Private (admin only)
const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body; // don't allow password update here
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/users/:id ───────────────────────────────────────────
// ─── @access Private (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };