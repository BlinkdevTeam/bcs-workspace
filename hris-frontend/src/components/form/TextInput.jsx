/**
 * TextInput
 */

import React from "react";

export default function TextInput({
  label,
  name,
  register,
  error,
  placeholder,
  disabled = false,
  type = "text",
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={`w-full border rounded-md px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error ? "border-red-500" : "border-gray-300"}
        disabled:bg-gray-100`}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}