export default function NavButtons({ onBack, onNext, nextLabel="Continue →", nextDisabled=false, loading=false }) {
  return (
    <div className="flex items-center justify-between mt-8">
      {onBack
        ? <button onClick={onBack}
            className="px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-80"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#666", border:"1px solid #2a2a2a" }}>
            ← Back
          </button>
        : <div />
      }
      <button onClick={onNext} disabled={nextDisabled || loading}
        className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
        style={{
          fontFamily:      "system-ui,sans-serif",
          backgroundColor: nextDisabled || loading ? "#1a1a1a" : "#fff",
          color:           nextDisabled || loading ? "#444"    : "#000",
          cursor:          nextDisabled || loading ? "not-allowed" : "pointer",
        }}>
        {loading ? "Setting up…" : nextLabel}
      </button>
    </div>
  );
}
