"use strict";

// Company working-time rules used to compare time-in / time-out against filed OT / UT.
// Change these numbers to match your policy.
module.exports = {
  SHIFT_HOURS: 8,      // paid hours expected in a normal day
  BREAK_HOURS: 1,      // unpaid break, subtracted from any day longer than BREAK_AFTER_HOURS
  BREAK_AFTER_HOURS: 5,
  TOLERANCE_HOURS: 0.25, // filed hours within this of the punches still count as a match
};
