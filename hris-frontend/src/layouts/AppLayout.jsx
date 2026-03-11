import React from "react";
import Header from "../Header/Header";

export default function AppLayout({ children }) {
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000" }}
    >
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}