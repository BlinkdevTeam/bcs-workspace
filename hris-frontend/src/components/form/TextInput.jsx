/**
 * TextInput
 */

import React from "react";
import clsx from "clsx";

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full rounded-md px-3 py-2 text-sm bg-[#111] text-white border",
          "focus:outline-none focus:ring-2 focus:ring-white/20",
          error ? "border-red-500" : "border-[#2a2a2a]",
          disabled && "bg-gray-800 cursor-not-allowed",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}