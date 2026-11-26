"use strict";

const { Router } = require("express");
const { protect } = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");
const c = require("../controllers/attendanceController");

const router = Router();
router.use(protect);
router.get("/",       requirePermission("attendance.view_all"), c.list);
router.post("/",      requirePermission("attendance.correct"),  c.create);
router.patch("/:id",  requirePermission("attendance.correct"),  c.update);
router.delete("/:id", requirePermission("attendance.correct"),  c.remove);

module.exports = router;
