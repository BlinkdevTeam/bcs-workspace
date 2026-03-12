import React from "react";

export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  error,
  register,
  required = false,
  className = "",
  ...props
}) {
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

      <textarea
        name={name}
        rows={rows}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100
          ${error ? "border-red-500" : ""}
          ${className}`}
        {...(register ? register(name) : {})}
        {...props}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}