/**
 * EmptyState Component
 *
 * Usage:
 * <EmptyState
 *   variant="no-data"
 *   icon="📭"
 *   action={<Button>Add Item</Button>}
 * />
 */

import React from "react";

const variants = {
  "no-data": {
    title: "No Data",
    description: "Nothing to display here.",
  },
  "no-results": {
    title: "No Results",
    description: "Try adjusting your search.",
  },
  "no-notifications": {
    title: "No Notifications",
    description: "You're all caught up!",
  },
  "no-tasks": {
    title: "No Tasks",
    description: "You don't have any tasks yet.",
  },
};

export default function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  variant = "no-data",
  className = "",
}) {
  const content = variants[variant] || variants["no-data"];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 ${className}`}
    >
      {icon && (
        <div className="text-5xl mb-4 text-gray-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-700">
        {title || content.title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        {description || content.description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}