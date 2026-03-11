// ── COMPENSATION CONFIG TAB ───────────────────────────────────────────────────
export default function SetCard({ set, type, onEdit }) {
  const typeColor = { basicPay: "#5af07a", contributions: "#5a9af0", benefits: "#f0c85a" };
  const tc = typeColor[type];
  return (
    <div className="rounded-lg p-4 group relative" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: set.color }} />
          <p className="text-white text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif" }}>{set.name}</p>
        </div>
        <button onClick={() => onEdit(set)} className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 hover:text-white px-2 py-1 rounded transition-all" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1a1a1a" }}>Edit</button>
      </div>
      <p className="text-gray-500 text-xs mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>{set.desc}</p>
      {type === "basicPay" && (
        <div className="grid grid-cols-2 gap-2">
          {[["Pay Freq.", set.payFreq], ["OT Rate", `×${set.overtimeRate}`], ["Night Diff", `${(set.nightDiffRate*100).toFixed(0)}%`], ["Holiday", `×${set.holidayRate}`]].map(([l,v]) => (
            <div key={l} className="flex justify-between">
              <span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</span>
              <span className="text-xs" style={{ fontFamily: "monospace", color: tc }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      {type === "contributions" && (
        <div className="grid grid-cols-3 gap-2">
          {[["SSS", set.sss, `${set.sssRate}%`], ["PhilHealth", set.philhealth, `${set.philhealthRate}%`], ["Pag-IBIG", set.pagibig, `${set.pagibigRate}%`]].map(([l,on,v]) => (
            <div key={l} className="text-center">
              <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</p>
              <p className="text-xs font-medium" style={{ fontFamily: "monospace", color: on ? tc : "#444" }}>{on ? v : "Off"}</p>
            </div>
          ))}
        </div>
      )}
      {type === "benefits" && (
        <div className="grid grid-cols-2 gap-2">
          {[["HMO", set.hmo?"✓":"—"], ["Life Ins.", set.lifeInsurance?"✓":"—"], ["Annual Leave", set.annualLeave+"d"], ["Sick Leave", set.sickLeave+"d"], ["13th Month", set.thirteenthMonth?"✓":"—"], ["Meal Allow.", set.mealAllowance?`₱${set.mealAllowance.toLocaleString()}`:"—"]].map(([l,v]) => (
            <div key={l} className="flex justify-between">
              <span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</span>
              <span className="text-xs" style={{ fontFamily: "monospace", color: v === "—" ? "#444" : tc }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}