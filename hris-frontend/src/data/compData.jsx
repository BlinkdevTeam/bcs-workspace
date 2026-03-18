// ── compData.js ───────────────────────────────────────────────────────────────
// Seed data and pure helper functions shared across the entire app.
// No React, no JSX — just plain JS so any file can import from here.
//
// Usage:
//   import { EMPLOYEES, DEFAULT_BASIC_PAY_SETS, seedEmpComp } from "../data/compData";
// ─────────────────────────────────────────────────────────────────────────────


// ── EMPLOYEES ─────────────────────────────────────────────────────────────────
export const EMPLOYEES = [
  {
    id: 1,
    name: "Sara Okafor",
    avatar: "SO",
    dept: "Engineering",
    role: "Senior Engineer",
    salary: "$142,000",
    salaryNumeric: 142000,
    payFreq: "Bi-weekly",
    tax: 28,
    benefits: 1280,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "New York",
    joined: "Jan 12, 2021",
    manager: "Devon Park",
    email: "sara.okafor@hera.io",
    phone: "+1 212 555 0191",
    schedule: "Mon–Fri, 9am–5pm",
    benefitsTier: "Premium",
    gender: "Female",
    dob: "Mar 14, 1990",
  },

  {
    id: 2,
    name: "Marcus Chen",
    avatar: "MC",
    dept: "Sales",
    role: "Account Executive",
    salary: "$98,000",
    salaryNumeric: 98000,
    payFreq: "Bi-weekly",
    tax: 22,
    benefits: 960,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "Chicago",
    joined: "Mar 5, 2022",
    manager: "Rita Vance",
    email: "marcus.chen@hera.io",
    phone: "+1 312 555 0144",
    schedule: "Mon–Fri, Flexible",
    benefitsTier: "Standard",
    gender: "Male",
    dob: "Jul 22, 1993",
  },

  {
    id: 3,
    name: "Priya Nair",
    avatar: "PN",
    dept: "Product",
    role: "Product Manager",
    salary: "$126,000",
    salaryNumeric: 126000,
    payFreq: "Semi-monthly",
    tax: 26,
    benefits: 1280,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "Remote",
    joined: "Jul 19, 2023",
    manager: "Devon Park",
    email: "priya.nair@hera.io",
    phone: "+1 415 555 0172",
    schedule: "Mon–Fri, Flexible",
    benefitsTier: "Premium",
    gender: "Female",
    dob: "Nov 5, 1991",
  },

  {
    id: 4,
    name: "James Kowalski",
    avatar: "JK",
    dept: "Engineering",
    role: "DevOps Engineer",
    salary: "$134,000",
    salaryNumeric: 134000,
    payFreq: "Bi-weekly",
    tax: 27,
    benefits: 960,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "Austin",
    joined: "Nov 1, 2020",
    manager: "Sara Okafor",
    email: "james.k@hera.io",
    phone: "+1 512 555 0103",
    schedule: "Mon–Fri, 9am–5pm",
    benefitsTier: "Standard",
    gender: "Male",
    dob: "Apr 18, 1988",
  },

  {
    id: 5,
    name: "Leila Farouk",
    avatar: "LF",
    dept: "Product",
    role: "Senior PM",
    salary: "$148,000",
    salaryNumeric: 148000,
    payFreq: "Monthly",
    tax: 30,
    benefits: 1280,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "New York",
    joined: "Feb 28, 2019",
    manager: "Devon Park",
    email: "leila.f@hera.io",
    phone: "+1 212 555 0165",
    schedule: "4-day week",
    benefitsTier: "Premium",
    gender: "Female",
    dob: "Sep 30, 1987",
  },

  {
    id: 6,
    name: "Devon Park",
    avatar: "DP",
    dept: "Engineering",
    role: "VP Engineering",
    salary: "$210,000",
    salaryNumeric: 210000,
    payFreq: "Monthly",
    tax: 35,
    benefits: 1280,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "New York",
    joined: "Jun 14, 2018",
    manager: "CEO",
    email: "devon.park@hera.io",
    phone: "+1 212 555 0188",
    schedule: "Mon–Fri, Flexible",
    benefitsTier: "Premium",
    gender: "Male",
    dob: "Jan 2, 1982",
  },

  {
    id: 7,
    name: "Rita Vance",
    avatar: "RV",
    dept: "Sales",
    role: "Sales Director",
    salary: "$175,000",
    salaryNumeric: 175000,
    payFreq: "Monthly",
    tax: 32,
    benefits: 1280,
    status: "Active",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "Chicago",
    joined: "Sep 3, 2020",
    manager: "CEO",
    email: "rita.vance@hera.io",
    phone: "+1 312 555 0121",
    schedule: "Mon–Fri, 9am–5pm",
    benefitsTier: "Premium",
    gender: "Female",
    dob: "Jun 15, 1984",
  },

  {
    id: 8,
    name: "Tomás Rivera",
    avatar: "TR",
    dept: "Design",
    role: "UX Designer",
    salary: "$112,000",
    salaryNumeric: 112000,
    payFreq: "Bi-weekly",
    tax: 24,
    benefits: 960,
    status: "Active",
    empType: "Contractual", // restored from first dataset
    taxExempt: false,
    deductOverrides: { sss: false, philhealth: false, pagibig: false },

    location: "Remote",
    joined: "Apr 11, 2022",
    manager: "Leila Farouk",
    email: "tomas.r@hera.io",
    phone: "+1 415 555 0199",
    schedule: "Mon–Fri, Flexible",
    benefitsTier: "Standard",
    gender: "Male",
    dob: "Feb 27, 1994",
  },

  {
    id: 9,
    name: "Ananya Bose",
    avatar: "AB",
    dept: "Operations",
    role: "Data Analyst",
    salary: "$95,000",
    salaryNumeric: 95000,
    payFreq: "Bi-weekly",
    tax: 22,
    benefits: 960,
    status: "On Leave",
    empType: "Regular",
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "Austin",
    joined: "Oct 22, 2021",
    manager: "Rita Vance",
    email: "ananya.b@hera.io",
    phone: "+1 512 555 0177",
    schedule: "Mon–Fri, 9am–5pm",
    benefitsTier: "Standard",
    gender: "Female",
    dob: "Aug 8, 1995",
  },

  {
    id: 10,
    name: "Chris Mendez",
    avatar: "CM",
    dept: "HR & Admin",
    role: "HR Specialist",
    salary: "$88,000",
    salaryNumeric: 88000,
    payFreq: "Bi-weekly",
    tax: 0,
    benefits: 0,
    status: "Active",
    empType: "Regular",
    taxExempt: "Minimum Wage",
    deductOverrides: { sss: true, philhealth: true, pagibig: true },

    location: "New York",
    joined: "Jan 7, 2023",
    manager: "Devon Park",
    email: "chris.m@hera.io",
    phone: "+1 212 555 0134",
    schedule: "Mon–Fri, 9am–5pm",
    benefitsTier: "Standard",
    gender: "Male",
    dob: "Dec 3, 1997",
  },

  {
    id: 11,
    name: "Fatima Al-Hassan",
    avatar: "FA",
    dept: "Engineering",
    role: "Frontend Engineer",
    salary: "$128,000",
    salaryNumeric: 128000,
    payFreq: "Bi-weekly",
    tax: 26,
    benefits: 1280,
    status: "Active",
    empType: "Part-time", // restored from first dataset
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: true, pagibig: false },

    location: "Remote",
    joined: "Mar 30, 2022",
    manager: "Sara Okafor",
    email: "fatima.a@hera.io",
    phone: "+1 415 555 0156",
    schedule: "Mon–Fri, Flexible",
    benefitsTier: "Premium",
    gender: "Female",
    dob: "May 11, 1992",
  },

  {
    id: 12,
    name: "Noah Kim",
    avatar: "NK",
    dept: "Marketing",
    role: "Marketing Manager",
    salary: "$104,000",
    salaryNumeric: 104000,
    payFreq: "Bi-weekly",
    tax: 23,
    benefits: 960,
    status: "Active",
    empType: "Custom", // restored from first dataset
    taxExempt: false,
    deductOverrides: { sss: true, philhealth: false, pagibig: true },

    location: "Chicago",
    joined: "Aug 15, 2021",
    manager: "Rita Vance",
    email: "noah.kim@hera.io",
    phone: "+1 312 555 0143",
    schedule: "Mon–Fri, Flexible",
    benefitsTier: "Standard",
    gender: "Male",
    dob: "Oct 19, 1993",
  },
];

export const DEFAULT_SETTINGS = {
  sss:       { enabled:true,  rate:4.5,  cap:1350,  label:"SSS / Social Security",   note:"Employee share. Employer contributes separately." },
  philhealth:{ enabled:true,  rate:2.0,  cap:3200,  label:"PhilHealth / Medical",     note:"Employee share (2% of basic salary, split equally)." },
  pagibig:   { enabled:true,  rate:2.0,  cap:100,   label:"Pag-IBIG / Housing Fund",  note:"Capped at \u20b1100/month employee share." },
  ot: {
    regular: { rate:1.25, label:"Regular OT (>8h/day)" },
    restDay: { rate:1.30, label:"Rest Day OT" },
    holiday: { rate:2.00, label:"Special Holiday OT" },
    legal:   { rate:2.60, label:"Legal Holiday OT" },
  },
  ut: { deductRate:1.00, graceMins:15 },
  tax: {
    method:"flat",
    flatNote:"Each employee withholding rate is set individually in their compensation record.",
    brackets:[
      { from:0,      to:20833,  rate:0,  fixed:0      },
      { from:20834,  to:33332,  rate:20, fixed:0      },
      { from:33333,  to:66666,  rate:25, fixed:2500   },
      { from:66667,  to:166666, rate:30, fixed:10833  },
      { from:166667, to:666666, rate:32, fixed:40833  },
      { from:666667, to:null,   rate:35, fixed:200833 },
    ],
  },
  schedule: { cutoff1:15, cutoff2:30, payDelay:5, currency:"USD" },
  benefitCategories:[
    { id:1, name:"Health Insurance", defaultAmt:800, enabled:true  },
    { id:2, name:"Dental & Vision",  defaultAmt:240, enabled:true  },
    { id:3, name:"401(k) / Pension", defaultAmt:240, enabled:true  },
    { id:4, name:"Life Insurance",   defaultAmt:60,  enabled:false },
    { id:5, name:"Commuter Benefit", defaultAmt:50,  enabled:false },
  ],
};

export function calcNet(emp, cfg) { return calcDeductions(emp, cfg).net; }

export function fmt(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export function gross(emp) { return emp.salaryNumeric / periodsPerYear(emp.payFreq); }

export function calcDeductions(emp, cfg) {
  const g       = gross(emp);
  const periods = periodsPerYear(emp.payFreq);
  const isContractual = emp.empType === "Contractual";
  const isPartTime    = emp.empType === "Part-time";
  const isCustom      = emp.empType === "Custom";
  const ov            = emp.deductOverrides || {};

  // Tax: exempt employees pay nothing regardless of their tax rate
  const taxAmt = emp.taxExempt ? 0 : g * (emp.tax / 100);

  // Statutory: Contractual = none, Part-time = prorated at 0.5, Custom = per override, Regular = full
  function statutoryAmt(key) {
    const globalOn = cfg[key]?.enabled;
    if (!globalOn) return 0;
    if (isContractual) return 0;
    if (isCustom && !ov[key]) return 0;
    const raw = g * (cfg[key].rate / 100);
    const cap = cfg[key].cap / periods;
    const amt = Math.min(raw, cap);
    return isPartTime ? amt * 0.5 : amt;
  }

  const sssAmt  = statutoryAmt("sss");
  const philAmt = statutoryAmt("philhealth");
  const pagAmt  = statutoryAmt("pagibig");
  // Benefits: Contractual gets none, others full
  const benAmt  = isContractual ? 0 : emp.benefits / periods;

  return { g, taxAmt, sssAmt, philAmt, pagAmt, benAmt,
           net: g - taxAmt - sssAmt - philAmt - pagAmt - benAmt };
}

export const PAYROLL_RUNS = [
  {
    id: "PR-2026-04",
    period: "Feb 1 – Feb 15, 2026",
    payDate: "Feb 28, 2026",
    status: "Scheduled",
    total: 142830,
    headcount: 12,
    type: "Bi-weekly + Monthly",
  },
  {
    id: "PR-2026-03",
    period: "Jan 16 – Jan 31, 2026",
    payDate: "Feb 14, 2026",
    status: "Processed",
    total: 138450,
    headcount: 12,
    type: "Bi-weekly",
  },
  {
    id: "PR-2026-02",
    period: "Jan 1 – Jan 15, 2026",
    payDate: "Jan 31, 2026",
    status: "Processed",
    total: 141200,
    headcount: 12,
    type: "Bi-weekly + Monthly",
  },
  {
    id: "PR-2026-01",
    period: "Dec 16 – Dec 31, 2025",
    payDate: "Jan 14, 2026",
    status: "Processed",
    total: 139800,
    headcount: 12,
    type: "Bi-weekly",
  },
  {
    id: "PR-2025-26",
    period: "Dec 1 – Dec 15, 2025",
    payDate: "Dec 31, 2025",
    status: "Processed",
    total: 144500,
    headcount: 12,
    type: "Bi-weekly + Monthly",
  },
  {
    id: "PR-2025-25",
    period: "Nov 16 – Nov 30, 2025",
    payDate: "Dec 14, 2025",
    status: "Processed",
    total: 137900,
    headcount: 11,
    type: "Bi-weekly",
  },
];

// Attendance records — today's status per employee
export const ATTENDANCE_TODAY = [
  { empId:1,  status:"Present",  timeIn:"8:52 AM",  breakOut:"12:05 PM", breakIn:"12:58 PM", timeOut:null,       hours:null, breakFlag:null },
  { empId:2,  status:"Remote",   timeIn:"9:10 AM",  breakOut:"12:00 PM", breakIn:"1:00 PM",  timeOut:null,       hours:null, breakFlag:null },
  { empId:3,  status:"Present",  timeIn:"9:01 AM",  breakOut:"12:10 PM", breakIn:"1:25 PM",  timeOut:null,       hours:null, breakFlag:"exceeded" },
  { empId:4,  status:"Late",     timeIn:"10:23 AM", breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
  { empId:5,  status:"Present",  timeIn:"8:45 AM",  breakOut:"12:00 PM", breakIn:"12:55 PM", timeOut:null,       hours:null, breakFlag:null },
  { empId:6,  status:"Present",  timeIn:"8:30 AM",  breakOut:"11:45 AM", breakIn:"12:30 PM", timeOut:null,       hours:null, breakFlag:"early" },
  { empId:7,  status:"Remote",   timeIn:"9:00 AM",  breakOut:"12:00 PM", breakIn:"1:00 PM",  timeOut:null,       hours:null, breakFlag:null },
  { empId:8,  status:"Remote",   timeIn:"9:30 AM",  breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
  { empId:9,  status:"On Leave", timeIn:null,        breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
  { empId:10, status:"Present",  timeIn:"8:58 AM",  breakOut:"12:01 PM", breakIn:"12:59 PM", timeOut:null,       hours:null, breakFlag:null },
  { empId:11, status:"Remote",   timeIn:"9:15 AM",  breakOut:"12:00 PM", breakIn:"1:10 PM",  timeOut:null,       hours:null, breakFlag:"exceeded" },
  { empId:12, status:"Absent",   timeIn:null,        breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
];

// Leave requests
export const LEAVE_REQUESTS_SEED = [
  { id:1,  empId:9,  type:"Sick Leave",    from:"Mar 1, 2026",  to:"Mar 5, 2026",  days:5, reason:"Medical procedure and recovery",          status:"Approved",  appliedOn:"Feb 25, 2026" },
  { id:2,  empId:4,  type:"Vacation Leave",from:"Mar 10, 2026", to:"Mar 12, 2026", days:3, reason:"Family trip",                              status:"Pending",   appliedOn:"Feb 28, 2026" },
  { id:3,  empId:12, type:"Vacation Leave",from:"Mar 15, 2026", to:"Mar 18, 2026", days:4, reason:"Personal travel",                          status:"Pending",   appliedOn:"Mar 1, 2026"  },
  { id:4,  empId:2,  type:"Emergency Leave",from:"Mar 3, 2026", to:"Mar 3, 2026",  days:1, reason:"Family emergency",                         status:"Approved",  appliedOn:"Mar 3, 2026"  },
  { id:5,  empId:7,  type:"Sick Leave",    from:"Mar 8, 2026",  to:"Mar 8, 2026",  days:1, reason:"Fever",                                    status:"Approved",  appliedOn:"Mar 7, 2026"  },
  { id:6,  empId:11, type:"Vacation Leave",from:"Mar 20, 2026", to:"Mar 24, 2026", days:5, reason:"Annual leave utilization",                 status:"Pending",   appliedOn:"Mar 2, 2026"  },
  { id:7,  empId:3,  type:"Maternity Leave",from:"Apr 1, 2026", to:"Jun 30, 2026", days:90,"reason":"Maternity leave",                        status:"Approved",  appliedOn:"Feb 20, 2026" },
  { id:8,  empId:5,  type:"Vacation Leave",from:"Mar 25, 2026", to:"Mar 26, 2026", days:2, reason:"Personal day",                             status:"Rejected",  appliedOn:"Feb 27, 2026" },
  { id:9,  empId:1,  type:"Sick Leave",    from:"Mar 6, 2026",  to:"Mar 6, 2026",  days:1, reason:"Not feeling well",                         status:"Pending",   appliedOn:"Mar 5, 2026"  },
  { id:10, empId:8,  type:"Vacation Leave",from:"Apr 5, 2026",  to:"Apr 9, 2026",  days:5, reason:"Holiday vacation",                         status:"Pending",   appliedOn:"Mar 1, 2026"  },
];

// Leave balances per employee
export const LEAVE_BALANCES = [
  { empId:1,  annual:{total:15,used:3},  sick:{total:15,used:1},  emergency:{total:5,used:0} },
  { empId:2,  annual:{total:15,used:8},  sick:{total:15,used:2},  emergency:{total:5,used:1} },
  { empId:3,  annual:{total:20,used:10}, sick:{total:15,used:0},  emergency:{total:5,used:0} },
  { empId:4,  annual:{total:15,used:5},  sick:{total:15,used:3},  emergency:{total:5,used:0} },
  { empId:5,  annual:{total:20,used:18}, sick:{total:15,used:4},  emergency:{total:5,used:2} },
  { empId:6,  annual:{total:20,used:6},  sick:{total:15,used:1},  emergency:{total:5,used:0} },
  { empId:7,  annual:{total:20,used:12}, sick:{total:15,used:5},  emergency:{total:5,used:1} },
  { empId:8,  annual:{total:15,used:4},  sick:{total:15,used:0},  emergency:{total:5,used:0} },
  { empId:9,  annual:{total:15,used:7},  sick:{total:15,used:5},  emergency:{total:5,used:0} },
  { empId:10, annual:{total:15,used:2},  sick:{total:15,used:1},  emergency:{total:5,used:0} },
  { empId:11, annual:{total:15,used:9},  sick:{total:15,used:2},  emergency:{total:5,used:0} },
  { empId:12, annual:{total:15,used:14}, sick:{total:15,used:3},  emergency:{total:5,used:1} },
];

// OT/UT records — current month
export const OT_UT_RECORDS = [
  { empId:1,  date:"Feb 24", type:"OT", hours:2.5, reason:"Sprint deadline",        status:"Approved" },
  { empId:4,  date:"Feb 25", type:"OT", hours:3.0, reason:"Server migration",       status:"Approved" },
  { empId:6,  date:"Feb 26", type:"OT", hours:4.0, reason:"Executive presentation", status:"Approved" },
  { empId:2,  date:"Feb 27", type:"OT", hours:1.5, reason:"Client call overrun",    status:"Pending"  },
  { empId:11, date:"Feb 28", type:"OT", hours:2.0, reason:"Bug fix deployment",     status:"Approved" },
  { empId:4,  date:"Mar 1",  type:"UT", hours:1.0, reason:"Late arrival",           status:"Flagged"  },
  { empId:12, date:"Mar 1",  type:"UT", hours:8.0, reason:"Unexcused absence",      status:"Flagged"  },
  { empId:8,  date:"Feb 20", type:"OT", hours:1.5, reason:"Design review",          status:"Approved" },
  { empId:3,  date:"Feb 22", type:"OT", hours:2.0, reason:"Product launch prep",    status:"Pending"  },
  { empId:7,  date:"Feb 23", type:"OT", hours:3.5, reason:"Quarterly close",        status:"Approved" },
  { empId:5,  date:"Feb 19", type:"UT", hours:0.5, reason:"Left early (approved)",  status:"Approved" },
  { empId:10, date:"Feb 28", type:"OT", hours:1.0, reason:"Audit support",          status:"Pending"  },
];

export const CURRENT_CUTOFF_END = "Mar 15, 2026";

// Offset bank — where earned hours sit until used/expired/voided
export const OFFSET_BANK_SEED = [
  { id:"ob1", empId:1,  source:"OT",     hours:2.5, earnedDate:"Feb 24, 2026", otRef:"OT-001", grantedBy:null,    reason:"Sprint deadline OT — 8AM to 10:30PM",          mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob2", empId:4,  source:"OT",     hours:3.0, earnedDate:"Feb 25, 2026", otRef:"OT-002", grantedBy:null,    reason:"Server migration — stayed until 8PM",           mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob3", empId:6,  source:"OT",     hours:4.0, earnedDate:"Feb 26, 2026", otRef:"OT-003", grantedBy:null,    reason:"Executive presentation prep — worked until 9PM", mode:"early-out",  expiresAt:CURRENT_CUTOFF_END, status:"Used"      },
  { id:"ob4", empId:11, source:"OT",     hours:2.0, earnedDate:"Feb 28, 2026", otRef:"OT-005", grantedBy:null,    reason:"Bug fix deployment — 8AM to 7PM",               mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob5", empId:7,  source:"OT",     hours:3.5, earnedDate:"Feb 23, 2026", otRef:"OT-007", grantedBy:null,    reason:"Quarterly close — stayed until 8:30PM",         mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob6", empId:2,  source:"Custom", hours:4.0, earnedDate:"Mar 1, 2026",  otRef:null,     grantedBy:"Admin", reason:"Exceeded Q1 sales quota by 130% — reward offset", mode:"flexible",  expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob7", empId:8,  source:"Custom", hours:2.0, earnedDate:"Mar 1, 2026",  otRef:null,     grantedBy:"Admin", reason:"Best design award — March recognition",          mode:"early-out",  expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob8", empId:3,  source:"OT",     hours:2.0, earnedDate:"Feb 22, 2026", otRef:"OT-009", grantedBy:null,    reason:"Product launch prep — stayed until 7PM",         mode:"late-in",    expiresAt:CURRENT_CUTOFF_END, status:"Expired"   },
];

// Offset requests — employee's intent to use bank hours on a specific day
export const OFFSET_REQUESTS_SEED = [
  // empId 6 used ob3 (4hrs) — filed by HR
  { id:"or1", empId:6,  bankId:"ob3", hoursUsed:4.0, useDate:"Mar 5, 2026",
    mode:"early-out", timeIn:"8:00 AM", timeOut:"1:00 PM",
    note:"Compensatory for Feb 26 OT", filedBy:"HR",
    status:"Approved", reviewedBy:"Admin", reviewedOn:"Mar 2, 2026" },
  // Pending requests
  { id:"or2", empId:1,  bankId:"ob1", hoursUsed:2.5, useDate:"Mar 7, 2026",
    mode:"late-in",   timeIn:"10:30 AM", timeOut:"5:00 PM",
    note:"Need to attend morning appointment", filedBy:"Employee",
    status:"Pending", reviewedBy:null, reviewedOn:null },
  { id:"or3", empId:4,  bankId:"ob2", hoursUsed:3.0, useDate:"Mar 10, 2026",
    mode:"early-out", timeIn:"8:00 AM", timeOut:"2:00 PM",
    note:"Family commitment in the afternoon", filedBy:"Employee",
    status:"Pending", reviewedBy:null, reviewedOn:null },
  { id:"or4", empId:2,  bankId:"ob6", hoursUsed:4.0, useDate:"Mar 12, 2026",
    mode:"late-in",   timeIn:"12:00 PM", timeOut:"5:00 PM",
    note:"Using reward offset for medical check-up", filedBy:"HR",
    status:"Pending", reviewedBy:null, reviewedOn:null },
];

export function handleApprove(id) { setLeaveRequests(p => p.map(r => r.id === id ? { ...r, status: "Approved" } : r)); }

export function handleReject(id) { setLeaveRequests(p => p.map(r => r.id === id ? { ...r, status: "Rejected" } : r)); }

export function parseTime(t) {
  if (!t) return 0;
  const [time, mer] = t.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (mer==="PM" && h!==12) h+=12;
  if (mer==="AM" && h===12) h=0;
  return h*60+(m||0);
}

export function breakFlags(breakOut, breakIn) {
  if (!breakOut && !breakIn) return [];
  const flags = [];
  const outMins = parseTime(breakOut);
  const inMins  = parseTime(breakIn);
  const dur     = inMins - outMins;
  if (outMins < BREAK_WINDOW_START) flags.push("early");       // clocked out before 12PM
  if (inMins  > BREAK_WINDOW_END)   flags.push("exceeded");    // came back after 1PM
  if (dur > BREAK_MAX_MINS)         flags.push("exceeded");    // duration > 60 min
  return [...new Set(flags)];
}

export function breakMinutes(breakOut, breakIn) {
  if (!breakOut || !breakIn) return null;
  return Math.round((parseTime(breakIn) - parseTime(breakOut)));
}

export function breakDurLabel(breakOut, breakIn) {
  const mins = breakMinutes(breakOut, breakIn);
  if (mins === null) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const BREAK_WINDOW_START = 12 * 60;      // 720
export const BREAK_WINDOW_END   = 13 * 60;      // 780
export const BREAK_MAX_MINS     = 60;

export function empAvailableHours(empId, bank) {
  return bank.filter(b => b.empId===empId && b.status==="Available")
             .reduce((s,b) => s+b.hours, 0);
}

export function hoursWorked(timeIn, timeOut) {
  const diff = (parseTime(timeOut) - parseTime(timeIn)) / 60;
  return diff > 0 ? parseFloat(diff.toFixed(1)) : 0;
}
export function effectiveHours(timeIn, timeOut, offsetHours) {
  return hoursWorked(timeIn, timeOut) + offsetHours;
}

// ── COMPENSATION PACKAGE SETS ─────────────────────────────────────────────────

export const DEFAULT_BASIC_PAY_SETS = [
  { id: "bp1", name: "Standard",   desc: "Default pay structure for full-time employees", payFreq: "Bi-weekly",    overtimeRate: 1.5,  nightDiffRate: 0.1,  holidayRate: 2.0, color: "#5af07a" },
  { id: "bp2", name: "Executive",  desc: "Senior leadership pay structure",               payFreq: "Monthly",      overtimeRate: 2.0,  nightDiffRate: 0.15, holidayRate: 2.5, color: "#f0c85a" },
  { id: "bp3", name: "Part-time",  desc: "Prorated structure for part-time staff",        payFreq: "Bi-weekly",    overtimeRate: 1.25, nightDiffRate: 0.1,  holidayRate: 1.5, color: "#5a9af0" },
  { id: "bp4", name: "Contractor", desc: "Fixed-rate, no overtime or differentials",      payFreq: "Semi-monthly", overtimeRate: 1.0,  nightDiffRate: 0.0,  holidayRate: 1.0, color: "#aaaaaa" },
];

export const DEFAULT_CONTRIBUTION_SETS = [
  { id: "cs1", name: "Full Statutory", desc: "SSS, PhilHealth & Pag-IBIG at standard rates",          sss: true,  sssRate: 4.5, philhealth: true,  philhealthRate: 2.0, pagibig: true,  pagibigRate: 2.0, withholdingTax: true,  taxRate: 20, color: "#5af07a" },
  { id: "cs2", name: "Exempt",         desc: "No statutory deductions — for tax-exempt employees",    sss: false, sssRate: 0,   philhealth: false, philhealthRate: 0,   pagibig: false, pagibigRate: 0,   withholdingTax: false, taxRate: 0,  color: "#9b8aff" },
  { id: "cs3", name: "Minimal",        desc: "Pag-IBIG only — for probationary or project-based staff", sss: false, sssRate: 0, philhealth: false, philhealthRate: 0,   pagibig: true,  pagibigRate: 2.0, withholdingTax: true,  taxRate: 15, color: "#f0c85a" },
];

export const DEFAULT_BENEFITS_SETS = [
  { id: "bf1", name: "Standard", desc: "HMO, life insurance, 15 VL + 15 SL",                    hmo: true,  lifeInsurance: true,  annualLeave: 15, sickLeave: 15, mealAllowance: 0,    transportAllowance: 0,    thirteenthMonth: true,  color: "#5af07a" },
  { id: "bf2", name: "Premium",  desc: "HMO+1, life insurance, 20 VL + 15 SL, allowances",      hmo: true,  lifeInsurance: true,  annualLeave: 20, sickLeave: 15, mealAllowance: 2000, transportAllowance: 1500, thirteenthMonth: true,  color: "#f0c85a" },
  { id: "bf3", name: "Basic",    desc: "SSS & PhilHealth only — no HMO or leave",                hmo: false, lifeInsurance: false, annualLeave: 5,  sickLeave: 5,  mealAllowance: 0,    transportAllowance: 0,    thirteenthMonth: true,  color: "#5a9af0" },
  { id: "bf4", name: "None",     desc: "No company benefits — contractor arrangement",           hmo: false, lifeInsurance: false, annualLeave: 0,  sickLeave: 0,  mealAllowance: 0,    transportAllowance: 0,    thirteenthMonth: false, color: "#aaaaaa" },
];


// ── SEED HELPER ───────────────────────────────────────────────────────────────
// Maps an employee's benefits field to their default package set IDs.
// Used when initialising empComps state in App.jsx.

const EMP_COMP_DEFAULTS = {
  basicPaySetId:     { Premium: "bp2", Standard: "bp1", "Contractor (None)": "bp4" },
  contributionSetId: { Premium: "cs1", Standard: "cs1", "Contractor (None)": "cs2" },
  benefitsSetId:     { Premium: "bf2", Standard: "bf1", "Contractor (None)": "bf4" },
};

export function seedEmpComp(emp) {
  const b = emp.benefits || "Standard";
  return {
    basicPaySetId:     EMP_COMP_DEFAULTS.basicPaySetId[b]     || "bp1",
    contributionSetId: EMP_COMP_DEFAULTS.contributionSetId[b] || "cs1",
    benefitsSetId:     EMP_COMP_DEFAULTS.benefitsSetId[b]     || "bf1",
    adjustments: [],
    // adjustments shape: { id, type: "bonus"|"deduction", amount, reason, date, addedBy }
  };
}


// ── SHARED UI CONSTANTS ───────────────────────────────────────────────────────
// Non-React constants used across multiple components.
// Import these instead of redefining them in each file.

export const DEPTS    = ["All", "Engineering", "Sales", "Product", "Design", "Operations", "Marketing", "HR & Admin"];
export const STATUSES = ["All", "Active", "On Leave", "Inactive"];

// Status badge styles
export const STATUS_STYLES = {
  "Active":   { bg: "#0f1f0f", color: "#5af07a" },
  "On Leave": { bg: "#1f1a0f", color: "#f0c85a" },
  "Inactive": { bg: "#1f0f0f", color: "#f05a5a" },
};

// Avatar background colours (cycled by emp.id)
const AVATAR_COLORS = [
  "#ffffff", "#cccccc", "#999999", "#777777",
  "#555555", "#444444", "#ffffff", "#bbbbbb",
  "#888888", "#666666", "#aaaaaa", "#333333",
];

// Returns { bg, fg } for an employee's avatar
export function getAvatarColors(id) {
  const bg = AVATAR_COLORS[id % AVATAR_COLORS.length] || "#000"; // fallback
  const lightBg =
    bg &&
    ["#fff", "#ddd", "#eee", "#ccc", "#bbb"].some((x) =>
      bg.startsWith(x.slice(0, 4))
    );
  return { bg, fg: lightBg ? "#000" : "#fff" };
}


// ── PAY HELPERS ───────────────────────────────────────────────────────────────
// Pure functions for pay calculations — no React, safe to use anywhere.

export function periodsPerYear(payFreq) {
  if (payFreq === "Monthly")      return 12;
  if (payFreq === "Semi-monthly") return 24;
  return 26; // Bi-weekly / Weekly default
}

export function parseSalary(salary) {
  // Handles both "$142,000" strings and plain numbers
  return parseFloat(String(salary).replace(/[$,]/g, "")) || 0;
}

export function grossPerPeriod(salary, payFreq) {
  return parseSalary(salary) / periodsPerYear(payFreq);
}

export function formatCurrency(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function gc(id) {
  const bg = AV[id % AV.length] || "#000"; // fallback color if undefined
  const fg =
    bg &&
    ["#fff", "#ddd", "#eee", "#ccc", "#bbb"].some((x) =>
      bg.startsWith(x.slice(0, 4))
    )
      ? "#000"
      : "#fff";
  return { bg, fg };
}


export const SS = { 
    "Active":{
        bg:"#0f1f0f",
        color:"#5af07a"
    }, 
    "On Leave":{
        bg:"#1f1a0f",
        color:"#f0c85a"
    }, 
    "Inactive":{
        bg:"#1f0f0f",
        color:"#f05a5a"
    } 
};

export const AV = ["#ffffff","#cccccc","#999999","#777777","#555555","#444444","#ffffff","#bbbbbb","#888888","#666666","#aaaaaa","#333333"];

export function Avatar({emp,size=36}) { 
    const{bg,fg}=gc(emp.id)
    return <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{width:size,height:size,backgroundColor:bg,color:fg,fontFamily:"system-ui,sans-serif",fontSize:size<32?11:size<56?13:20}}>{emp.avatar}</div>
}

export const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";

export const IS = {
    backgroundColor:"#111111",
    border:"1px solid #2a2a2a",
    fontFamily:"system-ui,sans-serif"
};

export function Field({label,children})
    { 
        return <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>{label}</label>{children}
        </div>; 
    }
    
export const BADGE = {
  Approved:    {bg:"#0f1f0f", color:"#5af07a"},
  Pending:     {bg:"#1f1a0f", color:"#f0c85a"},
  Rejected:    {bg:"#1f0f0f", color:"#f05a5a"},
  Flagged:     {bg:"#1f0f0f", color:"#f05a5a"},
  "For Review":{bg:"#0a1a2a", color:"#5a9af0"},
  "—":         {bg:"transparent", color:"#444"},
};

export const ATTENDANCE_STYLE = {
  Present:  { bg:"#0f1f0f", color:"#5af07a", dot:"#5af07a"  },
  Remote:   { bg:"#0a1a2a", color:"#5a9af0", dot:"#5a9af0"  },
  Late:     { bg:"#1f1a0f", color:"#f0c85a", dot:"#f0c85a"  },
  Absent:   { bg:"#1f0f0f", color:"#f05a5a", dot:"#f05a5a"  },
  "On Leave":{ bg:"#1a0f1a",color:"#c07af0", dot:"#c07af0"  },
};

export const LEAVE_STATUS_STYLE = {
  Approved: { bg:"#0f1f0f", color:"#5af07a" },
  Pending:  { bg:"#1f1a0f", color:"#f0c85a" },
  Rejected: { bg:"#1f0f0f", color:"#f05a5a" },
};

export const LEAVE_TYPES = ["All","Vacation Leave","Sick Leave","Emergency Leave","Maternity Leave","Paternity Leave"];

export const OT_STATUS_STYLE = {
  Approved: { bg:"#0f1f0f", color:"#5af07a" },
  Pending:  { bg:"#1f1a0f", color:"#f0c85a" },
  Flagged:  { bg:"#1f0f0f", color:"#f05a5a" },
};

export function PriorityBadge({ priority }) {
  const s = { High:{ bg:"#1f0f0f",color:"#f05a5a" }, Medium:{ bg:"#1f1a0f",color:"#f0c85a" }, Low:{ bg:"#0f1f0f",color:"#5af07a" } }[priority] || {};
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif",...s }}>{priority}</span>;
}

export function CandidateAvatar({ name, size=32 }) {
  const idx = name.charCodeAt(0) % AV_COLORS.length;
  const bg  = AV_COLORS[idx];
  const fg  = "#000";
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width:size, height:size, backgroundColor:bg, color:fg, fontFamily:"system-ui,sans-serif", fontSize:size<28?9:size<40?11:14 }}>
      {initials(name)}
    </div>
  );
}

export const AV_COLORS = ["#e8e0d5", "#c8bfb0", "#a8a090", "#888070", "#686050", "#484030", "#d5e0e8", "#b0c0cf", "#8090a8", "#506080"];

export function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

export function StatusBadge({ status }) {
  const s = {
    Open:{ bg:"#0f1f0f",color:"#5af07a" }, Closed:{ bg:"#1a1a1a",color:"#555" },
    Active:{ bg:"#0a1a2a",color:"#5a9af0" }, Hired:{ bg:"#0f1f0f",color:"#5af07a" },
    Rejected:{ bg:"#1f0f0f",color:"#f05a5a" }, Draft:{ bg:"#1f1a0f",color:"#f0c85a" },
    Accepted:{ bg:"#0f1f0f",color:"#5af07a" }, Declined:{ bg:"#1f0f0f",color:"#f05a5a" },
    Scheduled:{ bg:"#0a1a2a",color:"#5a9af0" }, Completed:{ bg:"#0f1f0f",color:"#5af07a" },
    Cancelled:{ bg:"#1f0f0f",color:"#f05a5a" },
  }[status] || { bg:"#111",color:"#888" };
  return <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ fontFamily:"system-ui,sans-serif",...s }}>{status}</span>;
}

export const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export function Stars({ rating, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange?.(n)} style={{ color: n<=rating?"#f0c85a":"#333", fontSize:12, lineHeight:1 }}>★</button>
      ))}
    </div>
  );
}

export function stageForApplicant(applicant, jobs) {
  const job = jobs.find(j => j.id === applicant.jobId);
  if (!job) return null;
  return job.stages.find(s => s.id === applicant.stageId) || job.stages[0];
}

export const INTERVIEW_TYPES = ["Phone Screen", "Video Call", "In-Person", "Panel", "Technical", "Final"];

// ── DEFAULT GLOBAL PIPELINE STAGES ───────────────────────────────────────────
export const DEFAULT_STAGES_SEED = [
  { id:"s1", label:"Applied",     color:"#555",    icon:"📥" },
  { id:"s2", label:"Screening",   color:"#5a9af0", icon:"🔍" },
  { id:"s3", label:"Interview",   color:"#f0c85a", icon:"🗣" },
  { id:"s4", label:"Assessment",  color:"#c07af0", icon:"📝" },
  { id:"s5", label:"Offer",       color:"#5af07a", icon:"📄" },
  { id:"s6", label:"Hired",       color:"#5af07a", icon:"✅" },
];

// ── SEED DATA ─────────────────────────────────────────────────────────────────
export const JOB_OPENINGS_SEED = [
  {
    id:"j1", title:"Senior Frontend Engineer", dept:"Engineering", type:"Full-time",
    location:"Remote", salary:"₱120,000 – ₱150,000", headcount:2, filled:0,
    postedOn:"Feb 15, 2026", deadline:"Mar 31, 2026", status:"Open", priority:"High",
    description:"We are looking for a Senior Frontend Engineer to join our Engineering team. You will be responsible for building and maintaining high-quality web applications.",
    requirements:"5+ years React experience, TypeScript, strong UI/UX sensibility",
    stages:[
      { id:"s1", label:"Applied",           color:"#555",    icon:"📥" },
      { id:"s2", label:"Technical Screen",  color:"#5a9af0", icon:"💻" },
      { id:"s3", label:"HR Interview",      color:"#f0c85a", icon:"🗣" },
      { id:"s4", label:"Technical Interview",color:"#c07af0",icon:"🔬" },
      { id:"s5", label:"Offer",             color:"#5af07a", icon:"📄" },
      { id:"s6", label:"Hired",             color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j2", title:"Sales Account Executive", dept:"Sales", type:"Full-time",
    location:"On-site · Manila", salary:"₱60,000 – ₱80,000 + commission", headcount:3, filled:1,
    postedOn:"Feb 20, 2026", deadline:"Mar 20, 2026", status:"Open", priority:"High",
    description:"Drive revenue growth by managing the full sales cycle from prospecting to close.",
    requirements:"3+ years B2B sales, strong communication, CRM experience",
    stages:[
      { id:"s1", label:"Applied",      color:"#555",    icon:"📥" },
      { id:"s2", label:"HR Interview", color:"#5a9af0", icon:"🗣" },
      { id:"s3", label:"Sales Demo",   color:"#f0c85a", icon:"🎯" },
      { id:"s4", label:"Offer",        color:"#5af07a", icon:"📄" },
      { id:"s5", label:"Hired",        color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j3", title:"UX Designer", dept:"Design", type:"Full-time",
    location:"Hybrid · Manila", salary:"₱70,000 – ₱90,000", headcount:1, filled:0,
    postedOn:"Feb 28, 2026", deadline:"Apr 15, 2026", status:"Open", priority:"Medium",
    description:"Design intuitive and beautiful user experiences across our product suite.",
    requirements:"3+ years UX/UI, Figma proficiency, portfolio required",
    stages:[
      { id:"s1", label:"Applied",          color:"#555",    icon:"📥" },
      { id:"s2", label:"Portfolio Review", color:"#5a9af0", icon:"🖼" },
      { id:"s3", label:"HR Interview",     color:"#f0c85a", icon:"🗣" },
      { id:"s4", label:"Design Test",      color:"#c07af0", icon:"✏" },
      { id:"s5", label:"Offer",            color:"#5af07a", icon:"📄" },
      { id:"s6", label:"Hired",            color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j4", title:"Data Analyst", dept:"Operations", type:"Full-time",
    location:"Remote", salary:"₱65,000 – ₱85,000", headcount:1, filled:0,
    postedOn:"Mar 1, 2026", deadline:"Apr 1, 2026", status:"Open", priority:"Medium",
    description:"Turn complex data into actionable insights that drive business decisions.",
    requirements:"SQL, Python, BI tools (Tableau/PowerBI), statistics background",
    stages:[
      { id:"s1", label:"Applied",        color:"#555",    icon:"📥" },
      { id:"s2", label:"Screening",      color:"#5a9af0", icon:"🔍" },
      { id:"s3", label:"HR Interview",   color:"#f0c85a", icon:"🗣" },
      { id:"s4", label:"Case Study",     color:"#c07af0", icon:"📊" },
      { id:"s5", label:"Offer",          color:"#5af07a", icon:"📄" },
      { id:"s6", label:"Hired",          color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j5", title:"Marketing Manager", dept:"Marketing", type:"Full-time",
    location:"On-site · Manila", salary:"₱80,000 – ₱100,000", headcount:1, filled:1,
    postedOn:"Jan 10, 2026", deadline:"Feb 28, 2026", status:"Closed", priority:"Low",
    description:"Lead our marketing efforts across digital and traditional channels.",
    requirements:"5+ years marketing, team management, digital marketing expertise",
    stages: DEFAULT_STAGES_SEED,
  },
];

export const APPLICANTS_SEED = [
  { id:"a1",  jobId:"j1", name:"Rafael Santos",    email:"rafael.s@email.com",    phone:"+63 917 123 4567", appliedOn:"Feb 16, 2026", source:"LinkedIn",  stageId:"s3", status:"Active",   rating:4, notes:"Strong React background, great portfolio" },
  { id:"a2",  jobId:"j1", name:"Camille Reyes",    email:"cam.reyes@email.com",   phone:"+63 918 234 5678", appliedOn:"Feb 17, 2026", source:"Referral",  stageId:"s4", status:"Active",   rating:5, notes:"Exceptional candidate, highly recommended by Devon" },
  { id:"a3",  jobId:"j1", name:"Miguel Torres",    email:"m.torres@email.com",    phone:"+63 919 345 6789", appliedOn:"Feb 20, 2026", source:"JobStreet", stageId:"s2", status:"Active",   rating:3, notes:"Decent skills, needs assessment" },
  { id:"a4",  jobId:"j1", name:"Bea Villanueva",   email:"bea.v@email.com",       phone:"+63 920 456 7890", appliedOn:"Feb 22, 2026", source:"Indeed",    stageId:"s1", status:"Active",   rating:0, notes:"" },
  { id:"a5",  jobId:"j2", name:"Carlo Domingo",    email:"carlo.d@email.com",     phone:"+63 921 567 8901", appliedOn:"Feb 21, 2026", source:"LinkedIn",  stageId:"s4", status:"Active",   rating:4, notes:"Hit all targets in previous role, great energy" },
  { id:"a6",  jobId:"j2", name:"Anna Lim",         email:"anna.lim@email.com",    phone:"+63 922 678 9012", appliedOn:"Feb 22, 2026", source:"Referral",  stageId:"s3", status:"Active",   rating:3, notes:"Good communication, sales demo pending" },
  { id:"a7",  jobId:"j2", name:"Rico Mercado",     email:"rico.m@email.com",      phone:"+63 923 789 0123", appliedOn:"Feb 24, 2026", source:"JobStreet", stageId:"s2", status:"Active",   rating:2, notes:"Junior profile, might be a stretch" },
  { id:"a8",  jobId:"j2", name:"Diane Cruz",       email:"diane.c@email.com",     phone:"+63 924 890 1234", appliedOn:"Feb 26, 2026", source:"Indeed",    stageId:"s5", status:"Hired",    rating:5, notes:"Outstanding — offer accepted, starts Mar 15" },
  { id:"a9",  jobId:"j3", name:"Marco Evangelista",email:"marco.e@email.com",     phone:"+63 925 901 2345", appliedOn:"Mar 1, 2026",  source:"Behance",   stageId:"s3", status:"Active",   rating:4, notes:"Beautiful portfolio, interview pending" },
  { id:"a10", jobId:"j3", name:"Tricia Santos",    email:"tricia.s@email.com",    phone:"+63 926 012 3456", appliedOn:"Mar 2, 2026",  source:"LinkedIn",  stageId:"s2", status:"Active",   rating:3, notes:"Good Figma skills, needs portfolio review" },
  { id:"a11", jobId:"j4", name:"Jerome Aquino",    email:"jerome.a@email.com",    phone:"+63 927 123 4568", appliedOn:"Mar 2, 2026",  source:"LinkedIn",  stageId:"s2", status:"Active",   rating:3, notes:"SQL strong, Python moderate" },
  { id:"a12", jobId:"j1", name:"Lea Castillo",     email:"lea.c@email.com",       phone:"+63 928 234 5679", appliedOn:"Feb 25, 2026", source:"Referral",  stageId:"s1", status:"Rejected", rating:1, notes:"Not enough experience for senior level" },
];

export const INTERVIEWS_SEED = [
  { id:"i1", applicantId:"a2", jobId:"j1", type:"Technical Interview", date:"Mar 5, 2026",  time:"2:00 PM", interviewer:"Devon Park",    link:"https://meet.google.com/abc-defg", notes:"Focus on system design and React architecture", feedback:"", status:"Scheduled" },
  { id:"i2", applicantId:"a1", jobId:"j1", type:"HR Interview",        date:"Mar 4, 2026",  time:"10:00 AM",interviewer:"Chris Mendez",  link:"https://zoom.us/j/123456",          notes:"Culture fit, salary expectations", feedback:"Strong candidate, very articulate", status:"Completed" },
  { id:"i3", applicantId:"a5", jobId:"j2", type:"Sales Demo",          date:"Mar 6, 2026",  time:"3:00 PM", interviewer:"Rita Vance",    link:"",                                  notes:"In-person at office, ask them to present a mock pitch", feedback:"", status:"Scheduled" },
  { id:"i4", applicantId:"a9", jobId:"j3", type:"HR Interview",        date:"Mar 7, 2026",  time:"11:00 AM",interviewer:"Chris Mendez",  link:"https://meet.google.com/xyz-abcd",  notes:"Discuss portfolio, design process", feedback:"", status:"Scheduled" },
  { id:"i5", applicantId:"a6", jobId:"j2", type:"HR Interview",        date:"Mar 3, 2026",  time:"1:00 PM", interviewer:"Chris Mendez",  link:"https://zoom.us/j/789012",          notes:"General HR screening", feedback:"Decent, passed to sales demo stage", status:"Completed" },
];

export const OFFERS_SEED = [
  { id:"of1", applicantId:"a8", jobId:"j2", salary:"₱72,000", startDate:"Mar 15, 2026", expiresOn:"Mar 8, 2026",  sentOn:"Mar 3, 2026",  status:"Accepted", notes:"Negotiated ₱72k from initial ₱68k offer" },
  { id:"of2", applicantId:"a2", jobId:"j1", salary:"₱135,000",startDate:"Apr 1, 2026",  expiresOn:"Mar 12, 2026", sentOn:null,           status:"Draft",    notes:"Pending technical interview result" },
];

export const ONBOARDING_TEMPLATES = [
  { id:"ot1", label:"Send welcome email",          category:"Pre-start",  daysRelative:-3 },
  { id:"ot2", label:"Prepare laptop & equipment",  category:"Pre-start",  daysRelative:-2 },
  { id:"ot3", label:"Set up accounts (email, Slack, HR system)", category:"Pre-start", daysRelative:-1 },
  { id:"ot4", label:"Orientation & company overview", category:"Day 1",  daysRelative:0  },
  { id:"ot5", label:"Meet the team",               category:"Day 1",  daysRelative:0  },
  { id:"ot6", label:"HR documentation (contracts, ID)", category:"Day 1", daysRelative:0 },
  { id:"ot7", label:"Department briefing",         category:"Week 1", daysRelative:3  },
  { id:"ot8", label:"Assign buddy / mentor",       category:"Week 1", daysRelative:2  },
  { id:"ot9", label:"30-day check-in scheduled",   category:"Month 1",daysRelative:30 },
];

export const ONBOARDING_SEED = [
  {
    id:"ob1", applicantId:"a8", jobId:"j2", startDate:"Mar 15, 2026",
    tasks: ONBOARDING_TEMPLATES.map(t => ({ ...t, done:t.daysRelative < 0 })),
  },
];

export const TOTAL_STEPS = 4; // steps 1–4 (step 5 is the done state)

export const inputCls = "w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all";

export function inputStyle(error) {
  return {
    fontFamily:      "system-ui,sans-serif",
    backgroundColor: "#111",
    border:          `1px solid ${error ? "#f05a5a66" : "#2a2a2a"}`,
  };
}

export const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Retail & E-commerce",
  "Manufacturing", "Education", "Real Estate", "Logistics & Supply Chain",
  "Media & Entertainment", "Professional Services", "Other",
];

export const COMPANY_SIZES = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "501–1,000 employees", "1,000+ employees",
];

export function parsePasswordStrength(password) {
  const checks = [
    { label:"8+ characters",     pass: password.length >= 8           },
    { label:"Uppercase",         pass: /[A-Z]/.test(password)         },
    { label:"Lowercase",         pass: /[a-z]/.test(password)         },
    { label:"Number",            pass: /[0-9]/.test(password)         },
    { label:"Special character", pass: /[^A-Za-z0-9]/.test(password)  },
  ];
  const score = checks.filter(c => c.pass).length;
  return { checks, score };
}

export const STRENGTH_LABEL = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

export const STRENGTH_COLOR = ["", "#f05a5a", "#f05a5a", "#f0c85a", "#5a9af0", "#5af07a"];

export const ROLE_ACCESS = {
  super_admin: [
    { label:"All employees & records", level:"full", scope:"Full access"       },
    { label:"Payroll & compensation",  level:"full", scope:"Full access"       },
    { label:"Attendance & time",       level:"full", scope:"Full access"       },
    { label:"Leave management",        level:"full", scope:"Full access"       },
    { label:"Recruitment",             level:"full", scope:"Full access"       },
    { label:"Task management",         level:"full", scope:"Full access"       },
    { label:"User & role management",  level:"full", scope:"Full access"       },
    { label:"System audit logs",       level:"full", scope:"Full access"       },
  ],
  hr_admin: [
    { label:"All employees & records", level:"full", scope:"Full access"       },
    { label:"Payroll & compensation",  level:"full", scope:"Full access"       },
    { label:"Attendance & time",       level:"full", scope:"Full access"       },
    { label:"Leave management",        level:"full", scope:"Full access + Approve" },
    { label:"Recruitment",             level:"full", scope:"Full access"       },
    { label:"Task management",         level:"full", scope:"View all + Assign" },
    { label:"User management",         level:"full", scope:"Create & edit users" },
    { label:"System audit logs",       level:"none", scope:"No access"        },
  ],
  manager: [
    { label:"Employees",               level:"dept", scope:"Own department only" },
    { label:"Payroll",                 level:"own",  scope:"Own payslip only"    },
    { label:"Attendance",              level:"dept", scope:"Own department only" },
    { label:"Leave management",        level:"dept", scope:"Approve dept leave"  },
    { label:"Recruitment",             level:"none", scope:"No access"           },
    { label:"Task management",         level:"dept", scope:"Assign within dept"  },
    { label:"User management",         level:"none", scope:"No access"           },
  ],
  employee: [
    { label:"Employee profile",        level:"own",  scope:"Own profile only"  },
    { label:"Payroll",                 level:"own",  scope:"Own payslip only"  },
    { label:"Attendance",              level:"own",  scope:"Own records only"  },
    { label:"Leave",                   level:"own",  scope:"File & view own"   },
    { label:"Offset",                  level:"own",  scope:"View own offsets"  },
    { label:"Recruitment",             level:"none", scope:"No access"         },
    { label:"Tasks",                   level:"own",  scope:"Own tasks only"    },
    { label:"User management",         level:"none", scope:"No access"         },
  ],
};

export const ROLE_LABELS = {
  super_admin: "Super Admin",
  hr_admin:    "HR Admin",
  manager:     "Manager",
  employee:    "Employee",
};

export const ROLE_COLORS = {
  super_admin: "#f05a5a",
  hr_admin:    "#5af07a",
  manager:     "#5a9af0",
  employee:    "#f0c85a",
};

export function avatarBg(id) { return AV_COLORS[id % AV_COLORS.length]; }
