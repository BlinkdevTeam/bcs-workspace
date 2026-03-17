/**
 * DatePicker Component
 */

import React from "react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";

export default function DatePicker({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
  disabled = false,
  className = "",
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}

      <DatePickerLib
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange({ target: { value: date } })}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        showYearDropdown // ✅ allow selecting year from dropdown
        dropdownMode="select" // ✅ shows a select dropdown (instead of scrolling)
        className={clsx(
          "w-full rounded-md px-3 py-2 text-sm bg-[#111] text-white border",
          "focus:outline-none focus:ring-2 focus:ring-white/20",
          error ? "border-red-500" : "border-[#2a2a2a]",
          disabled && "bg-gray-800 cursor-not-allowed",
          className,
        )}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
