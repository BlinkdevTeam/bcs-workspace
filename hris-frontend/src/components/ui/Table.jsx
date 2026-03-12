/**
 * Table Component
 *
 * Usage:
 * <Table
 *   columns={[
 *     { key: "name", label: "Name", sortable: true },
 *     { key: "email", label: "Email", sortable: true },
 *     { key: "role", label: "Role" },
 *     {
 *       label: "Actions",
 *       render: (row) => <button>Edit</button>
 *     }
 *   ]}
 *   data={users}
 * />
 */

import React, { useState, useMemo } from "react";

export default function Table({ columns = [], data = [], className = "" }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Handle sorting
  const handleSort = (key) => {
    if (!key) return;

    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === bValue) return 0;

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortKey, sortDirection]);

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
                className={`px-4 py-2 border-b border-gray-700 text-sm font-medium text-gray-400 text-left ${
                  col.sortable
                    ? "cursor-pointer hover:text-white select-none"
                    : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  {col.label}

                  {/* Sort Indicator */}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-gray-500 py-4"
              >
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-900">
                {columns.map((col) => (
                  <td
                    key={col.key || col.label}
                    className="px-4 py-2 text-sm text-white border-b border-gray-800"
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