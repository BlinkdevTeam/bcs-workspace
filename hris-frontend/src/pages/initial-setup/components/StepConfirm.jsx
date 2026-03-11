import NavButtons from "./NavButtons";

import { TOTAL_STEPS } from "../../../data/compData";

export default function StepConfirm({ company, admin, onBack, onSubmit, loading }) {
  const fullName = `${admin.firstName} ${admin.lastName}`;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Step 3 of {TOTAL_STEPS}</p>
        <h2 className="text-2xl font-normal text-white" style={{ letterSpacing:"-0.02em" }}>Confirm & finish</h2>
        <p className="text-sm text-gray-600 mt-1" style={{ fontFamily:"system-ui,sans-serif" }}>
          Review the details below before creating your account.
        </p>
      </div>

      {/* Company summary */}
      <div className="rounded-lg overflow-hidden mb-4" style={{ border:"1px solid #1e1e1e" }}>
        <div className="px-4 py-2.5 flex items-center gap-2"
          style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
          <span className="text-sm">🏢</span>
          <p className="text-xs uppercase tracking-widest text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Company</p>
        </div>
        <div className="px-4 py-4 space-y-3" style={{ backgroundColor:"#0d0d0d" }}>
          {[
            ["Name",     company.companyName],
            ["Industry", company.industry],
            ["Size",     company.size],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between">
              <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{l}</span>
              <span className="text-sm text-gray-200" style={{ fontFamily:"system-ui,sans-serif" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin summary */}
      <div className="rounded-lg overflow-hidden mb-6" style={{ border:"1px solid #1e1e1e" }}>
        <div className="px-4 py-2.5 flex items-center gap-2"
          style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
          <span className="text-sm">🔐</span>
          <p className="text-xs uppercase tracking-widest text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Super Admin Account</p>
        </div>
        <div className="px-4 py-4 space-y-3" style={{ backgroundColor:"#0d0d0d" }}>
          {[
            ["Name",  fullName],
            ["Email", admin.email],
            ["Role",  "Super Admin"],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between">
              <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{l}</span>
              <span className="text-sm" style={{ fontFamily:"system-ui,sans-serif",
                color: l === "Role" ? "#f05a5a" : "#gray-200" }}>{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>Password</span>
            <span className="text-sm text-gray-500" style={{ fontFamily:"monospace" }}>••••••••••••</span>
          </div>
        </div>
      </div>

      {/* Final warning */}
      <div className="rounded-lg px-4 py-3 flex items-start gap-2.5 mb-2"
        style={{ backgroundColor:"#0a1a0a", border:"1px solid #1e3a1e" }}>
        <span className="text-green-400 flex-shrink-0 mt-0.5 text-sm">✓</span>
        <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>
          After clicking <strong className="text-white">Create Account</strong>, this setup page will be <strong className="text-white">permanently closed</strong>. You will be redirected to the login page.
        </p>
      </div>

      <NavButtons
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Create Account ✓"
        loading={loading}
      />
    </div>
  );
}