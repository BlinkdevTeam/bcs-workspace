"use strict";

const { Router } = require("express");
const { protect } = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");
const c = require("../controllers/overtimeController");

const router = Router();
router.use(protect);
router.get("/",              requirePermission("attendance.view_all"), c.list);
router.patch("/:id/status",  requirePermission("attendance.correct"),  c.setStatus);

module.exports = router;
