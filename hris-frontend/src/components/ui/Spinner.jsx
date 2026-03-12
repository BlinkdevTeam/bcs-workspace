/**
 * Spinner Component
 *
 * Usage:
 * <Spinner />
 * <Spinner size={20} />
 * <Spinner size={16} className="mr-2" />
 *
 * Can be used standalone or inside buttons when loading.
 */

import React from "react";

export default function Spinner({
  size = 16,
  className = "",
}) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-gray-600 border-t-white ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}