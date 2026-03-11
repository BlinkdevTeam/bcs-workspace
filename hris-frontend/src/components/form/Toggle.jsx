import React from "react";

export default function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = "",
  style = {},
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5"
          style={{ fontFamily: "system-ui,sans-serif", ...style }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />

        <div
          className={`w-10 h-5 rounded-full transition
            ${checked ? "bg-blue-600" : "bg-gray-300"} ${className}`}
        />

        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition
            ${checked ? "translate-x-5" : ""}`}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}