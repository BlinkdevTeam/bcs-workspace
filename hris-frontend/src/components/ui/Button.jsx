/**
 * Button Component
 *
 * Usage:
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="danger" loading>Deleting...</Button>
 */

import React from "react";
import clsx from "clsx";
import Spinner from "./Spinner";

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus:ring-2";

  return (
    <button
      disabled={loading || disabled}
      className={clsx(
        base,
        variantStyles[variant],
        sizeStyles[size],
        (loading || disabled) && "opacity-70 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}