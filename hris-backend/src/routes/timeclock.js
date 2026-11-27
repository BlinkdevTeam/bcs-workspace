"use strict";

const { Router } = require("express");
const c = require("../controllers/timeclockController");

// Public on purpose (no login): the kiosk page only sends an employee number or email.
const router = Router();
router.get("/now", c.now);
router.post("/", c.punch);

module.exports = router;
