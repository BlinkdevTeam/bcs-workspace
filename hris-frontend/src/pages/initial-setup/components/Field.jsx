export default function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="block text-xs uppercase tracking-widest text-gray-500"
          style={{ fontFamily:"system-ui,sans-serif" }}>{label}</label>
        {hint && <span className="text-xs text-gray-700" style={{ fontFamily:"system-ui,sans-serif" }}>{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>{error}</p>}
    </div>
  );
}