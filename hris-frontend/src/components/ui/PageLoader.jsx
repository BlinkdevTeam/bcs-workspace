/**
 * PageLoader Component
 *
 * Usage:
 * <PageLoader />
 * <PageLoader message="Loading dashboard..." />
 */

import React from "react";
import Spinner from "./Spinner";

export default function PageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <Spinner size={32} />

      {message && (
        <p className="mt-4 text-sm text-gray-500">
          {message}
        </p>
      )}
    </div>
  );
}