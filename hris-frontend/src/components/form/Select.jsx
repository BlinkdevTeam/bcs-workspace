/**
 * Select Component
 */

import React from "react";

export default function Select({
  label,
  name,
  register,
  options = [],
  placeholder = "Select option",
  disabled = false,
  error,
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select
        {...register(name)}
        disabled={disabled}
        className={`w-full border rounded-md px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error ? "border-red-500" : "border-gray-300"}
        disabled:bg-gray-100`}
      >
        <option value="">{placeholder}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}