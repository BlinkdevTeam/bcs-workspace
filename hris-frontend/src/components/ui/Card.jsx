import React from "react";

/**
 * Card component for dashboard sections
 * Props:
 * - children: content inside the card
 * - className: additional classes
 * - style: inline styles
 */
export default function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-lg p-6 ${className}`}
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid #222222",
        ...style,
      }}
    >
      {children}
    </div>
  );
}