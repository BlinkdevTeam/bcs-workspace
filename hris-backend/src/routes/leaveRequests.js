"use strict";

const { Router } = require("express");
const { protect } = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");
const c = require("../controllers/leaveRequestsController");

const router = Router();
router.use(protect);
router.get("/",             requirePermission("leave.view_all"),   c.list);
router.patch("/:id/status", requirePermission("leave.approve_all"), c.setStatus);

module.exports = router;
