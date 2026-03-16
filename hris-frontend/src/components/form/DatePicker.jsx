/**
 * DatePicker Component
 */

import React from "react";
import DatePickerLib from "react-datepicker";
import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker({
  label,
  name,
  control,
  error,
  minDate,
  maxDate,
  disabled = false,
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePickerLib
            selected={field.value}
            onChange={field.onChange}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            className={`w-full border rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : "border-gray-300"}`}
          />
        )}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}