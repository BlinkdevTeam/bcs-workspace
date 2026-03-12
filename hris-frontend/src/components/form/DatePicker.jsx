import React from "react";
import { Controller } from "react-hook-form";

export default function DatePicker({
  label,
  name,
  control,
  error,
  minDate,
  maxDate,
  disabled = false,
  required = false,
  className = "",
  ...props
}) {
  if (!control) {
    // fallback to normal input if no control
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="date"
          name={name}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100
            ${error ? "border-red-500" : ""}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && (
            <label
              className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <input
            type="date"
            {...field}
            min={minDate}
            max={maxDate}
            disabled={disabled}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100
              ${error ? "border-red-500" : ""}
              ${className}`}
            {...props}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}
    />
  );
}