import React from "react";

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  className = "",
  style = {},
  error,
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
        </label>
      )}

      <select
        value={value || ""}
        onChange={onChange}
        className={className}
        style={style}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((opt, i) => {
          if (typeof opt === "string") {
            return (
              <option key={i} value={opt}>
                {opt}
              </option>
            );
          }

          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}