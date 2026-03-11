import { useState } from "react";

const navItems = ["Dashboard", "People", "Payroll", "Time & Leave", "Recruitment", "Reports"];

const Header = ({activeNav, setActiveNav}) => {

    return (
      <header className="border-b px-8 py-4 flex items-center justify-between" style={{ backgroundColor: "#000000", borderColor: "#222222" }}>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-white">
              <span className="text-black font-bold text-sm" style={{ fontFamily: "monospace" }}>H</span>
            </div>
            <span className="text-lg text-white" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Hera
            </span>
          </div>
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className="px-4 py-1.5 rounded text-sm transition-all"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  backgroundColor: activeNav === item ? "#ffffff" : "transparent",
                  color: activeNav === item ? "#000000" : "#666666",
                  fontWeight: activeNav === item ? 600 : 400,
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-white transition-colors">
            <span className="text-xl">🔔</span>
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs text-black flex items-center justify-center font-bold bg-white"
              style={{ fontFamily: "monospace" }}
            >
              3
            </span>
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm bg-white">
            AK
          </div>
        </div>
    </header>
    )
}

export default Header;