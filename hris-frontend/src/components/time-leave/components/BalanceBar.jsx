import React from "react";

export default function BalanceBar({ label, used = 0, total = 0 }) {
  const safeUsed = Number(used) || 0;
  const safeTotal = Number(total) || 0;

  const remaining = safeTotal - safeUsed;
  const pct = safeTotal > 0 ? (safeUsed / safeTotal) * 100 : 0;

  const color =
    pct >= 90
      ? "#f05a5a"
      : pct >= 70
      ? "#f0c85a"
      : "#5af07a";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-xs text-gray-500"
          style={{ fontFamily: "system-ui,sans-serif" }}
        >
          {label}
        </span>

        <span
          className="text-xs"
          style={{ fontFamily: "monospace", color }}
        >
          {remaining} / {safeTotal} left
        </span>
      </div>

      <div
        className="h-1.5 rounded-full"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}