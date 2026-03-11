"use strict";

// ── LOAD MODELS ─────────────────────────────────────────────
require("./models"); // Important: loads all Sequelize models

// ── IMPORT DEPENDENCIES ────────────────────────────────────
const express = require("express");
const app = express();
const config = require("./config");
const { connectDB } = require("./config/database");

// ── MIDDLEWARE ─────────────────────────────────────────────
const corsMiddleware = require("./config/cors");

app.use(corsMiddleware); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ────────────────────────────────────────────────

// Initial Setup (first admin creation)
const setupRoutes = require("./routes/setupRoutes");
app.use("/setup", setupRoutes);

// Authentication (login)
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const healthRoutes = require("./routes/health");
app.use("/api", healthRoutes);

// Stats API
const statsRoutes = require("./routes/stats");
app.use("/api", statsRoutes);

const employeeRoutes = require("./routes/employeeRoutes");

// This makes all /employees routes work
app.use("/employees", employeeRoutes);

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
