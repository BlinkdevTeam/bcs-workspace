"use strict";

const { Router } = require("express");
const { protect } = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");
const c = require("../controllers/leaveBalancesController");

const router = Router();

router.use(protect);
router.get("/", requirePermission("leave.view_all"), c.list);

module.exports = router;
