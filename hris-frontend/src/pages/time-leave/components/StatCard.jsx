import React from "react";

export default function StatCard({
  label,
  value,
  sub,
  color = "#fff",
  accent = false
}) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        backgroundColor: accent ? "#111" : "#0d0d0d",
        border: `1px solid ${accent ? "#2a2a2a" : "#1e1e1e"}`
      }}
    >
      <p
        className="text-xs uppercase tracking-widest text-gray-600 mb-2"
        style={{ fontFamily: "system-ui,sans-serif" }}
      >
        {label}
      </p>

      <p
        className="text-2xl font-light mb-0.5"
        style={{ fontFamily: "monospace", color }}
      >
        {value}
      </p>

      {sub && (
        <p
          className="text-xs text-gray-600"
          style={{ fontFamily: "system-ui,sans-serif" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}