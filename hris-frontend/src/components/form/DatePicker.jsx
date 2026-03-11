import React from "react";

export default function DatePicker({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  style = {},
  placeholder = "",
  ...props
}) {
  return (
    <div>
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
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:bg-gray-100
        ${error ? "border-red-500" : ""}
        ${className}`}
        style={style}
        {...props}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}