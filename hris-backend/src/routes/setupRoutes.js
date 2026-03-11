"use strict";

const express = require("express");
const router = express.Router();
const setupController = require("../controllers/setupController");

// Health check
router.get("/", (_req, res) => {
  res.json({ message: "Setup endpoint is alive" });
});

// NEW: check if setup completed
router.get("/status", setupController.getSetupStatus);

// Initial setup
router.post("/", setupController.createSetup);

module.exports = router;
