"use strict";

// ── LOAD MODELS ─────────────────────────────────────────────
require("./models"); // Important: loads all Sequelize models

// ── IMPORT DEPENDENCIES ────────────────────────────────────
const express = require("express");
const cookieParser = require("cookie-parser"); // <-- added
const app = express();
const config = require("./config");
const { connectDB } = require("./config/database");

// ── MIDDLEWARE ─────────────────────────────────────────────
const corsMiddleware = require("./config/cors");

app.use(corsMiddleware); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <-- parse httpOnly cookies

// ── ROUTES ────────────────────────────────────────────────

// Initial Setup (first admin creation)
const setupRoutes = require("./routes/setupRoutes");
app.use("/api/setup", setupRoutes);

// Authentication (login + refresh token)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes); // <-- frontend calls /api/auth/login & /api/auth/refresh

// Health check route
const healthRoutes = require("./routes/health");
app.use("/api", healthRoutes);

// Stats API
const statsRoutes = require("./routes/stats");
app.use("/api", statsRoutes);

// Employees API
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/employees", employeeRoutes);

// ── Departments API (added) ───────────────────────────────
const departmentRoutes = require("./routes/departmentRoutes");
app.use("/api/departments", departmentRoutes);

// ── ROLES API ───────────────────────────────
const roleRoutes = require("./routes/roleRoutes");
app.use("/api/roles", roleRoutes);

// ── LEAVE TYPES API (HR configures leave kinds and yearly days) ─────
const leaveTypesRoutes = require("./routes/leaveTypes");
app.use("/api/leave-types", leaveTypesRoutes);

// ── LEAVE BALANCES API (active employees x active leave types) ─────
const leaveBalancesRoutes = require("./routes/leaveBalances");
app.use("/api/leave-balances", leaveBalancesRoutes);

// ── TIME RECORDS (time-in / time-out) AND OT / UT REVIEW ─────────
const attendanceRoutes = require("./routes/attendance");
app.use("/api/attendance", attendanceRoutes);
const overtimeRoutes = require("./routes/overtime");
app.use("/api/overtime", overtimeRoutes);
const leaveRequestsRoutes = require("./routes/leaveRequests");
app.use("/api/leave-requests", leaveRequestsRoutes);

// ── TIME CLOCK (public test kiosk) ───────────────────────────────
const timeclockRoutes = require("./routes/timeclock");
app.use("/api/timeclock", timeclockRoutes);

// ── HEALTH CHECK (Optional but useful) ─────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "HRIS Backend API running",
  });
});

// ── CONNECT DATABASE & START SERVER ───────────────────────
const start = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} [${config.env}]`);
      console.log(`API Base URL: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
