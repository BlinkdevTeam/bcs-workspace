import { useNavigate } from "react-router-dom";

export default function StepDone({ admin, company }) {
  const navigate = useNavigate();

  function handleGoToLogin() {
    // Optionally, mark setup as complete in localStorage
    localStorage.setItem("setupComplete", "true");

    // Navigate to login
    navigate("/login");
  }

  return (
    <div className="text-center py-4">
      {/* Animated checkmark */}
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#0a1a0a", border: "2px solid #5af07a" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5af07a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#fff" }}
        >
          <span
            className="text-xs font-bold text-black"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            H
          </span>
        </div>
      </div>

      <h2
        className="text-2xl font-normal text-white mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        You're all set, {admin.firstName}
      </h2>
      <p
        className="text-sm text-gray-500 mb-8 leading-relaxed"
        style={{ fontFamily: "system-ui,sans-serif" }}
      >
        <strong className="text-white">{company.companyName}</strong> is ready.
        <br />
        Sign in with <strong className="text-white">{admin.email}</strong> to
        get started.
      </p>

      {/* Next steps */}
      <div
        className="text-left rounded-lg p-4 mb-8 space-y-3"
        style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}
      >
        <p
          className="text-xs uppercase tracking-widest text-gray-600"
          style={{ fontFamily: "system-ui,sans-serif" }}
        >
          Next steps
        </p>
        {[
          { icon: "👥", text: "Go to People and add your employees" },
          { icon: "✉️", text: "Invite your HR team — they'll get an email link" },
          { icon: "💰", text: "Set up compensation packages in Payroll" },
          { icon: "📋", text: "Configure leave types in Time & Leave" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base">{item.icon}</span>
            <p
              className="text-sm text-gray-400"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handleGoToLogin}
        className="w-full py-3 rounded-lg text-sm font-medium bg-white text-black hover:opacity-90 transition-all"
        style={{ fontFamily: "system-ui,sans-serif" }}
      >
        Go to Login →
      </button>
    </div>
  );
}