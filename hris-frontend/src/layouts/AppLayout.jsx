import React from "react";
import Header from "../Header/Header";

export default function AppLayout({ children }) {
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ 
        fontFamily: "'Georgia', serif", 
        backgroundColor: "#000",
        position: "relative" // Ensures absolute/fixed children align correctly
      }}
    >
      {/* Wrapping the Header in a div with a z-index ensures 
         it stays above any content within the {children} 
      */}
      <div className="z-50 w-full bg-black border-b border-gray-900">
        <Header />
      </div>

      {/* Changed overflow-hidden to overflow-y-auto 
         If children are taller than the screen, you need to allow scrolling
         while keeping the header visible.
      */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}