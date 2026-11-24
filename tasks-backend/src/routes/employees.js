"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/employeeController");

const router = Router();
router.use(requireAuth);

router.get("/", c.listEmployees);

// "me" routes (must stay above any "/:id" route)
router.get("/me",             c.getMe);
router.patch("/me",           c.updateMe);
router.post("/me/password",   c.changePassword);

module.exports = router;
