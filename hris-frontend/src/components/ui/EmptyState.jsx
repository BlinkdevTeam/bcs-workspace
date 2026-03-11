import React from "react";

export default function EmptyState({ title = "No Data", description = "Nothing to show here.", icon, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-10 ${className}`}>
      {icon && <div className="mb-4 text-gray-400 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </div>
  );
}