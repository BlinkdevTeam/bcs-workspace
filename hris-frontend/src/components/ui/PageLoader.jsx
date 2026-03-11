import React from "react";
import Spinner from "./Spinner";

export default function PageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center space-y-3">
        <Spinner size={12} borderColor="#4b5563" borderTopColor="#ffffff" />
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    </div>
  );
}