const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/requirePermission");

// Everything here needs a logged-in HRIS user with the matching permission.
router.use(protect);

router.post("/",      requirePermission("employees.create"),     EmployeeController.createEmployee);
router.get("/",       requirePermission("employees.view_all", "employees.view_dept", "employees.view_own"), EmployeeController.getAllEmployees);
router.get("/:id",    requirePermission("employees.view_all", "employees.view_dept", "employees.view_own"), EmployeeController.getEmployeeById);
router.put("/:id",    requirePermission("employees.edit_all"),   EmployeeController.updateEmployee);
router.delete("/:id", requirePermission("employees.deactivate"), EmployeeController.deleteEmployee);

module.exports = router;
