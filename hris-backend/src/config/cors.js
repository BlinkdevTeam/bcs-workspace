"use strict";

const cors = require("cors");

module.exports = cors({
  origin: "http://localhost:5173", // match your frontend port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
