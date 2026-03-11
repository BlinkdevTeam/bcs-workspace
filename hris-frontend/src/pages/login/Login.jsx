import { useState } from "react";

import SignInView from "./components/SignInView";
import ForgotPasswordView from "./components/ForgotPasswordView";
import SetPasswordView from "./components/SetPasswordView";
import LoggedInView from "./components/LoggedInView";

// ── LOGIN PAGE ROOT ───────────────────────────────────────────────────────────
export default function LoginPage() {
  // view: "signin" | "forgot" | "set-password-invite" | "set-password-reset" | "logged-in"
  const [view,    setView]    = useState("signin");
  const [authedUser, setAuthedUser] = useState(null);

  function handleLogin(user) {
    setAuthedUser(user);
    setView("logged-in");
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor:"#000" }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-96 flex-shrink-0 p-10"
        style={{ backgroundColor:"#080808", borderRight:"1px solid #141414" }}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor:"#fff" }}>
              <span className="text-black font-bold text-sm">H</span>
            </div>
            <span className="text-white font-medium text-sm" style={{ fontFamily:"system-ui,sans-serif", letterSpacing:"0.05em" }}>
              HRIS SYSTEM
            </span>
          </div>

          {/* Feature list */}
          <div className="space-y-8">
            {[
              { icon:"👥", title:"People Management",    desc:"Employees, compensation, documents, org chart" },
              { icon:"💰", title:"Payroll",              desc:"Cutoffs, payslips, adjustments, contributions" },
              { icon:"⏱",  title:"Time & Leave",        desc:"Attendance, breaks, leave, OT/UT, offsets"     },
              { icon:"🎯", title:"Recruitment",          desc:"Job openings, pipeline, interviews, onboarding" },
              { icon:"✅", title:"Task Management",      desc:"Projects, assignments, time tracking, comments" },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm text-white font-medium" style={{ fontFamily:"system-ui,sans-serif" }}>{f.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-700" style={{ fontFamily:"system-ui,sans-serif" }}>
          © 2026 HRIS System · All rights reserved
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {view === "signin" && (
            <SignInView onLogin={handleLogin} onForgotPassword={() => setView("forgot")}/>
          )}
          {view === "forgot" && (
            <ForgotPasswordView onBack={() => setView("signin")}/>
          )}
          {view === "set-password-invite" && (
            <SetPasswordView mode="invite" onComplete={() => setView("signin")}/>
          )}
          {view === "set-password-reset" && (
            <SetPasswordView mode="reset" onComplete={() => setView("signin")}/>
          )}
          {view === "logged-in" && authedUser && (
            <LoggedInView user={authedUser} onLogout={() => { setAuthedUser(null); setView("signin"); }}/>
          )}
        </div>
      </div>
    </div>
  );
}