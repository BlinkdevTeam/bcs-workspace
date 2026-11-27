"use strict";

// Every scan from the time clock (or, later, a biometric device) is kept here, untouched.
// The daily attendance record is worked out from these: first scan = time in, last scan = time out.
const { sequelize } = require("./database");

let ready = null;
exports.ensureTimePunches = () => (ready ||= sequelize.query(
  `CREATE TABLE IF NOT EXISTS time_punches (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     employee_id UUID NOT NULL,
     punched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     work_date DATE NOT NULL,
     source VARCHAR(20) NOT NULL DEFAULT 'timeclock',
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   CREATE INDEX IF NOT EXISTS time_punches_emp_date_idx ON time_punches (employee_id, work_date);
   ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS source VARCHAR(20);
   ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS corrected_by VARCHAR(255);
   ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS corrected_at TIMESTAMPTZ;
   ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS correction_reason VARCHAR(255)`
).catch((e) => { ready = null; throw e; }));
