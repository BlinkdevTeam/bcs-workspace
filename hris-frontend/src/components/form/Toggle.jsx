/**
 * Toggle Switch Component
 */

import React from "react";

export default function Toggle({
  label,
  name,
  register,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        {...register(name)}
        disabled={disabled}
        className="w-4 h-4"
      />

      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
}