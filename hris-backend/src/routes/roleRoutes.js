// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const { createRole } = require("../controllers/roleController");

router.post("/", createRole); // POST /api/roles

module.exports = router;
