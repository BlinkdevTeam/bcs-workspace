import SetCard from "./SetCard";

export default function PackageSection({ title, type, sets, onEdit, onAdd, description }) {
  const icons = { basicPay: "💰", contributions: "📋", benefits: "🏥" };
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span>{icons[type]}</span>
            <h3 className="text-sm font-normal text-white" style={{ fontFamily: "system-ui,sans-serif" }}>{title}</h3>
          </div>
          <p className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>{description}</p>
        </div>
        <button onClick={onAdd} className="text-xs px-3 py-1.5 rounded hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>+ New Set</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sets.map(s => <SetCard key={s.id} set={s} type={type} onEdit={onEdit} />)}
      </div>
    </div>
  );
}