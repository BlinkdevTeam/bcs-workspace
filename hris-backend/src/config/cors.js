"use strict";

const cors = require("cors");

// Allow the HRIS frontend on 5173 or, when another Vite app already holds 5173, on 5174.
// Extra origins (for example the Vercel time-clock page) come from EXTRA_ORIGINS in .env,
// comma separated: EXTRA_ORIGINS=https://my-timeclock.vercel.app
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  ...String(process.env.EXTRA_ORIGINS || "").split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean),
];

module.exports = cors({
  origin(origin, callback) {
    // no Origin header = curl / server-to-server, allow it
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true, // allow sending cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-kiosk-key"],
});
