import React from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div
      className="h-screen text-white flex overflow-hidden"
      style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000", position: "relative" }}
    >
      <Sidebar />

      {/* Only the content area scrolls; the sidebar stays put */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
