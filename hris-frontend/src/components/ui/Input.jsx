import React from "react";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
  rightSlot,
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      {label && (
        <label
          className="mb-1 text-sm text-gray-300 font-medium"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            px-3 py-2
            rounded-md
            bg-gray-900
            text-white
            border border-gray-700
            placeholder-gray-500
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
            transition
          "
          style={{ fontFamily: "system-ui, sans-serif" }}
        />
        {rightSlot && <div className="absolute right-2">{rightSlot}</div>}
      </div>
    </div>
  );
}