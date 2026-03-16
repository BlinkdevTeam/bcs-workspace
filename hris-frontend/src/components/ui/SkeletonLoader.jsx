/**
 * SkeletonLoader Component
 *
 * Usage:
 * <SkeletonLoader variant="text" width="200px" />
 * <SkeletonLoader variant="avatar" />
 * <SkeletonLoader variant="block" height="100px" />
 * <SkeletonLoader variant="table" count={5} />
 */

import React from "react";

export default function SkeletonLoader({
  variant = "block",
  width = "100%",
  height = "16px",
  count = 1,
  className = "",
}) {
  const base = "animate-pulse bg-gray-300";

  const style = {
    width,
    height,
  };

  if (variant === "avatar") {
    return (
      <div
        className={`${base} rounded-full ${className}`}
        style={{ width: width || "40px", height: height || "40px" }}
      />
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className={`${base} h-4 w-1/4 rounded`} />
            <div className={`${base} h-4 w-1/3 rounded`} />
            <div className={`${base} h-4 w-1/6 rounded`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${base} rounded ${className}`}
          style={style}
        />
      ))}
    </>
  );
}