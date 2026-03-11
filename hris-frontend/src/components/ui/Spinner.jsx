import React from "react";

export default function Spinner({ size = 12, borderColor = "gray-600", borderTopColor = "white" }) {
  return (
    <div
      className={`w-${size} h-${size} border-4 rounded-full animate-spin`}
      style={{
        borderColor: borderColor,
        borderTopColor: borderTopColor,
      }}
    />
  );
}