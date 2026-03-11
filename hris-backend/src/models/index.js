"use strict";

// ─────────────────────────────────
// CORE MODELS
// ─────────────────────────────────
const User = require("./core/user");
const Employee = require("./core/employee");
const Department = require("./core/department");

// ─────────────────────────────────
// PAYROLL MODELS
// ─────────────────────────────────
const PayrollCutoff = require("./payroll/payrollCutoff");
const CompensationPackage = require("./payroll/compensationPackage");
const EmployeeCompensation = require("./payroll/employeeCompensation");
const SalaryHistory = require("./payroll/salaryHistory");
const PayrollAdjustment = require("./payroll/payrollAdjustment");
const Payslip = require("./payroll/payslip");

// ─────────────────────────────────
// ATTENDANCE MODELS
// ─────────────────────────────────
const AttendanceRecord = require("./attendance/attendanceRecord");
const AttendanceCorrection = require("./attendance/attendanceCorrection");
const OtUtRecord = require("./attendance/otUtRecord");

// ─────────────────────────────────
// LEAVE MODELS
// ─────────────────────────────────
const LeaveType = require("./leave/leaveType");
const LeaveBalance = require("./leave/leaveBalance");
const LeaveRequest = require("./leave/leaveRequest");

// ─────────────────────────────────
// OFFSET MODELS
// ─────────────────────────────────
const Offset = require("./offset/offset");

// ─────────────────────────────────
// RECRUITMENT MODELS
// ─────────────────────────────────
const JobOpening = require("./recruitment/jobOpening");
const PipelineStage = require("./recruitment/pipelineStage");
const Candidate = require("./recruitment/candidate");
const Application = require("./recruitment/application");
const ApplicationStageHistory = require("./recruitment/applicationStageHistory");
const Interview = require("./recruitment/interview");
const Offer = require("./recruitment/offer");
const OnboardingChecklist = require("./recruitment/onboardingChecklist");
const OnboardingTaskTemplate = require("./recruitment/onboardingTaskTemplate");
const OnboardingTask = require("./recruitment/onboardingTask");

// ─────────────────────────────────
// TASK MODELS
// ─────────────────────────────────
const Project = require("./task/project");
const ProjectMember = require("./task/projectMember");
const Task = require("./task/task");
const TaskTag = require("./task/taskTag");
const TaskTagAssignment = require("./task/taskTagAssignment");
const TaskTimeLog = require("./task/taskTimeLog");

// ─────────────────────────────────
// COMPANY PROFILE MODELS
// ─────────────────────────────────
const CompanyProfile = require("./company/profile");

// ─────────────────────────────────
// LOGS HISTORY MODELS
// ─────────────────────────────────
const LogsHistory = require("./logs/history");

// ─────────────────────────────────
// CORE RELATIONSHIPS
// ─────────────────────────────────
Employee.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(Employee, { foreignKey: "department_id" });

User.belongsTo(Employee, { foreignKey: "employee_id" });
Employee.hasOne(User, { foreignKey: "employee_id" });

// ─────────────────────────────────
// PAYROLL RELATIONSHIPS
// ─────────────────────────────────
Employee.hasMany(EmployeeCompensation, { foreignKey: "employee_id" });
EmployeeCompensation.belongsTo(Employee, { foreignKey: "employee_id" });

CompensationPackage.hasMany(EmployeeCompensation, {
  foreignKey: "compensation_package_id",
});
EmployeeCompensation.belongsTo(CompensationPackage, {
  foreignKey: "compensation_package_id",
});

Employee.hasMany(SalaryHistory, { foreignKey: "employee_id" });
SalaryHistory.belongsTo(Employee, { foreignKey: "employee_id" });

Employee.hasMany(PayrollAdjustment, { foreignKey: "employee_id" });
PayrollAdjustment.belongsTo(Employee, { foreignKey: "employee_id" });

PayrollCutoff.hasMany(PayrollAdjustment, { foreignKey: "payroll_cutoff_id" });
PayrollAdjustment.belongsTo(PayrollCutoff, { foreignKey: "payroll_cutoff_id" });

Employee.hasMany(Payslip, { foreignKey: "employee_id" });
Payslip.belongsTo(Employee, { foreignKey: "employee_id" });

PayrollCutoff.hasMany(Payslip, { foreignKey: "payroll_cutoff_id" });
Payslip.belongsTo(PayrollCutoff, { foreignKey: "payroll_cutoff_id" });

// ─────────────────────────────────
// ATTENDANCE RELATIONSHIPS
// ─────────────────────────────────
Employee.hasMany(AttendanceRecord, { foreignKey: "employee_id" });
AttendanceRecord.belongsTo(Employee, { foreignKey: "employee_id" });

AttendanceRecord.hasMany(AttendanceCorrection, {
  foreignKey: "attendance_record_id",
});
AttendanceCorrection.belongsTo(AttendanceRecord, {
  foreignKey: "attendance_record_id",
});

Employee.hasMany(AttendanceCorrection, { foreignKey: "employee_id" });
AttendanceCorrection.belongsTo(Employee, { foreignKey: "employee_id" });

Employee.hasMany(OtUtRecord, { foreignKey: "employee_id" });
OtUtRecord.belongsTo(Employee, { foreignKey: "employee_id" });

// ─────────────────────────────────
// LEAVE RELATIONSHIPS
// ─────────────────────────────────
LeaveType.hasMany(LeaveBalance, { foreignKey: "leave_type_id" });
LeaveBalance.belongsTo(LeaveType, { foreignKey: "leave_type_id" });

LeaveType.hasMany(LeaveRequest, { foreignKey: "leave_type_id" });
LeaveRequest.belongsTo(LeaveType, { foreignKey: "leave_type_id" });

Employee.hasMany(LeaveBalance, { foreignKey: "employee_id" });
LeaveBalance.belongsTo(Employee, { foreignKey: "employee_id" });

Employee.hasMany(LeaveRequest, { foreignKey: "employee_id" });
LeaveRequest.belongsTo(Employee, { foreignKey: "employee_id" });

// ─────────────────────────────────
// RECRUITMENT RELATIONSHIPS
// ─────────────────────────────────
JobOpening.hasMany(PipelineStage, { foreignKey: "job_opening_id" });
PipelineStage.belongsTo(JobOpening, { foreignKey: "job_opening_id" });

Candidate.hasMany(Application, { foreignKey: "candidate_id" });
Application.belongsTo(Candidate, { foreignKey: "candidate_id" });

JobOpening.hasMany(Application, { foreignKey: "job_opening_id" });
Application.belongsTo(JobOpening, { foreignKey: "job_opening_id" });

Application.hasMany(ApplicationStageHistory, { foreignKey: "application_id" });
ApplicationStageHistory.belongsTo(Application, {
  foreignKey: "application_id",
});

PipelineStage.hasMany(ApplicationStageHistory, {
  foreignKey: "pipeline_stage_id",
});
ApplicationStageHistory.belongsTo(PipelineStage, {
  foreignKey: "pipeline_stage_id",
});

Application.hasMany(Interview, { foreignKey: "application_id" });
Interview.belongsTo(Application, { foreignKey: "application_id" });

Application.hasOne(Offer, { foreignKey: "application_id" });
Offer.belongsTo(Application, { foreignKey: "application_id" });

Application.hasMany(OnboardingChecklist, { foreignKey: "application_id" });
OnboardingChecklist.belongsTo(Application, { foreignKey: "application_id" });

OnboardingChecklist.hasMany(OnboardingTask, { foreignKey: "checklist_id" });
OnboardingTask.belongsTo(OnboardingChecklist, { foreignKey: "checklist_id" });

OnboardingTaskTemplate.hasMany(OnboardingTask, { foreignKey: "template_id" });
OnboardingTask.belongsTo(OnboardingTaskTemplate, { foreignKey: "template_id" });

// ─────────────────────────────────
// TASK RELATIONSHIPS
// ─────────────────────────────────
Project.hasMany(ProjectMember, { foreignKey: "project_id" });
ProjectMember.belongsTo(Project, { foreignKey: "project_id" });

Employee.hasMany(ProjectMember, { foreignKey: "employee_id" });
ProjectMember.belongsTo(Employee, { foreignKey: "employee_id" });

Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

Employee.hasMany(Task, { foreignKey: "assigned_to" });
Task.belongsTo(Employee, { foreignKey: "assigned_to" });

Task.hasMany(TaskTagAssignment, { foreignKey: "task_id" });
TaskTagAssignment.belongsTo(Task, { foreignKey: "task_id" });

TaskTag.hasMany(TaskTagAssignment, { foreignKey: "tag_id" });
TaskTagAssignment.belongsTo(TaskTag, { foreignKey: "tag_id" });

Task.hasMany(TaskTimeLog, { foreignKey: "task_id" });
TaskTimeLog.belongsTo(Task, { foreignKey: "task_id" });

Employee.hasMany(TaskTimeLog, { foreignKey: "employee_id" });
TaskTimeLog.belongsTo(Employee, { foreignKey: "employee_id" });

// ─────────────────────────────────
// EXPORT ALL MODELS
// ─────────────────────────────────
module.exports = {
  User,
  Employee,
  Department,

  PayrollCutoff,
  CompensationPackage,
  EmployeeCompensation,
  SalaryHistory,
  PayrollAdjustment,
  Payslip,

  AttendanceRecord,
  AttendanceCorrection,
  OtUtRecord,

  LeaveType,
  LeaveBalance,
  LeaveRequest,

  Offset,

  JobOpening,
  PipelineStage,
  Candidate,
  Application,
  ApplicationStageHistory,
  Interview,
  Offer,
  OnboardingChecklist,
  OnboardingTaskTemplate,
  OnboardingTask,

  Project,
  ProjectMember,
  Task,
  TaskTag,
  TaskTagAssignment,
  TaskTimeLog,

  CompanyProfile,

  LogsHistory,
};
