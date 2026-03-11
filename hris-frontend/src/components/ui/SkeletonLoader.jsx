import React from "react";

export default function SkeletonLoader({ count = 1, className = "" }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-800 rounded-lg ${className}`}
        >
          <div className="h-full w-full rounded-lg bg-gray-800" />
        </div>
      ))}
    </>
  );
}