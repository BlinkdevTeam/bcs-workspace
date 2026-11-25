"use strict";

const { Router } = require("express");
const { protect } = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");
const c = require("../controllers/leaveTypesController");

const router = Router();

router.use(protect);
router.get("/",       requirePermission("leave.view_all", "leave.view_dept", "leave.configure"), c.list);
router.post("/",      requirePermission("leave.configure"), c.create);
router.patch("/:id",  requirePermission("leave.configure"), c.update);
router.delete("/:id", requirePermission("leave.configure"), c.remove);

module.exports = router;
