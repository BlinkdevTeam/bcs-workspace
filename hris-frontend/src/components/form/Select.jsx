import React from "react";

export default function Select({
  label,
  name,
  options = [],
  placeholder = "Select…",
  disabled = false,
  error,
  register,
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
        </label>
      )}

      <select
        name={name}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100
          ${error ? "border-red-500" : ""}
          ${className}`}
        {...(register ? register(name) : {})}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, i) =>
          typeof opt === "string" ? (
            <option key={i} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}