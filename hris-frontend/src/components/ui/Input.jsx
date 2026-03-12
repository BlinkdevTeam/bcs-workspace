/**
 * Input Component
 *
 * Usage:
 * <Input
 *   label="Email"
 *   placeholder="Enter email"
 *   value={email}
 *   onChange={setEmail}
 *   error="Invalid email"
 *   disabled={false}
 *   leftIcon={<MailIcon />}
 *   rightIcon={<EyeIcon />}
 * />
 */

import React from "react";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = "",
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
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
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 text-gray-400 flex items-center">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            px-3 py-2
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            rounded-md
            bg-gray-900
            text-white
            border
            ${error ? "border-red-500" : "border-gray-700"}
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            ${error ? "focus:ring-red-500" : "focus:ring-blue-500"}
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          `}
          style={{ fontFamily: "system-ui, sans-serif" }}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 text-gray-400 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <span className="mt-1 text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}