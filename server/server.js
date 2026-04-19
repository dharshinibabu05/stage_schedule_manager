const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins (LOCAL + VERCEL)
const allowedOrigins = [
  "http://localhost:3000",
  "https://stage-schedule-manager-9u14jha4z.vercel.app"
];

// ─── Socket.io Setup ─────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/events",    require("./routes/eventRoutes"));
app.use("/api/stages",    require("./routes/stageRoutes"));
app.use("/api/schedules", require("./routes/scheduleRoutes"));
app.use("/api/tasks",     require("./routes/taskRoutes"));
app.use("/api/users",     require("./routes/userRoutes"));

// ─── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🎭 Stage Scheduler API is running!" });
});

// ─── MongoDB Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });