/**
 * Card Component
 *
 * Usage:
 * <Card>
 *   <h2>Dashboard Section</h2>
 * </Card>
 */

import React from "react";
import clsx from "clsx";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "bg-[#0D0D0D] rounded-lg shadow p-6",
        className
      )}
    >
      {children}
    </div>
  );
}