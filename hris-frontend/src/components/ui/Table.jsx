/**
 * Table Component
 *
 * Usage:
 * <Table
 *   columns={[
 *     { key: "name", label: "Name", sortable: true },
 *     { key: "email", label: "Email", sortable: true },
 *     { label: "Actions", render: (row) => <button>Edit</button> }
 *   ]}
 *   rows={users}
 * />
 */

import React, { useState, useMemo } from "react";

export default function Table({ columns = [], rows = [], className = "" }) {
  const [sortKey, setSortKey] = useState(null);
  const [direction, setDirection] = useState("asc");

  const handleSort = (key) => {
    if (!key) return;

    if (sortKey === key) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;

    return [...rows].sort((a, b) => {
      if (a[sortKey] === b[sortKey]) return 0;

      if (direction === "asc") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      }

      return a[sortKey] < b[sortKey] ? 1 : -1;
    });
  }, [rows, sortKey, direction]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border-collapse">

        {/* HEADER */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-4 py-2 border-b text-left text-sm font-medium text-gray-500 ${
                  col.sortable ? "cursor-pointer select-none" : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  {col.label}

                  {col.sortable && sortKey === col.key && (
                    <span className="text-xs">
                      {direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key || col.label}
                    className="px-4 py-2 border-b text-sm"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}