import React from "react";
import clsx from "clsx";

/**
 * Badge component
 * @param {string} children - text or element inside the badge
 * @param {string} color - background color or type: 'green', 'red', 'blue', etc.
 * @param {string} className - additional tailwind/custom classes
 */
export default function Badge({ children, color = "gray", className = "" }) {
  // Define some default colors
  const colorMap = {
    gray: "bg-gray-700 text-gray-200",
    red: "bg-red-600 text-white",
    green: "bg-green-600 text-white",
    yellow: "bg-yellow-500 text-black",
    blue: "bg-blue-600 text-white",
    purple: "bg-purple-600 text-white",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colorMap[color] || colorMap.gray,
        className
      )}
    >
      {children}
    </span>
  );
}