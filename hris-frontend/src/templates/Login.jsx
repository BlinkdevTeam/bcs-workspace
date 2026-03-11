import { useState } from "react";

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
// Covers:
//   1. Sign In  (email + password)
//   2. Forgot Password  (email → reset link sent)
//   3. Set Password  (invite link / reset link — first-time or forgot)
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_LABELS = {
  super_admin: "Super Admin",
  hr_admin:    "HR Admin",
  manager:     "Manager",
  employee:    "Employee",
};

const ROLE_COLORS = {
  super_admin: "#f05a5a",
  hr_admin:    "#5af07a",
  manager:     "#5a9af0",
  employee:    "#f0c85a",
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function InputField({ label, type="text", value, onChange, placeholder, error, autoFocus=false, rightSlot }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-widest text-gray-500"
        style={{ fontFamily:"system-ui,sans-serif" }}>{label}</label>
      <div className="relative">
        <input
          type={type}
          autoFocus={autoFocus}
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all"
          style={{
            fontFamily:      "system-ui,sans-serif",
            backgroundColor: "#111",
            border:          `1px solid ${error ? "#f05a5a55" : "#2a2a2a"}`,
            paddingRight:    rightSlot ? 44 : undefined,
          }}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>{error}</p>
      )}
    </div>
  );
}

function Btn({ children, onClick, disabled, variant="primary", type="button" }) {
  const styles = {
    primary:   { bg: disabled ? "#1a1a1a" : "#fff",    color: disabled ? "#444" : "#000" },
    secondary: { bg: "#111",                           color: "#aaa", border:"1px solid #2a2a2a" },
    danger:    { bg: "#1f0f0f",                        color: "#f05a5a", border:"1px solid #3a1515" },
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className="w-full py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
      style={{ fontFamily:"system-ui,sans-serif", cursor: disabled ? "not-allowed" : "pointer", ...styles }}>
      {children}
    </button>
  );
}

function EyeIcon({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className="text-gray-600 hover:text-gray-300 transition-colors">
      {show
        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      }
    </button>
  );
}

// Password strength checker
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label:"8+ characters",       pass: password.length >= 8        },
    { label:"Uppercase letter",     pass: /[A-Z]/.test(password)      },
    { label:"Lowercase letter",     pass: /[a-z]/.test(password)      },
    { label:"Number",               pass: /[0-9]/.test(password)      },
    { label:"Special character",    pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const levels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "#f05a5a", "#f05a5a", "#f0c85a", "#5a9af0", "#5af07a"];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all"
            style={{ backgroundColor: i <= score ? colors[score] : "#1e1e1e" }}/>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(c => (
            <span key={c.label} className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color: c.pass ? "#5af07a" : "#444" }}>
              {c.pass ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className="text-xs font-medium ml-2 whitespace-nowrap" style={{ fontFamily:"system-ui,sans-serif", color: colors[score] }}>
            {levels[score]}
          </span>
        )}
      </div>
    </div>
  );
}

// ── VIEW: SIGN IN ─────────────────────────────────────────────────────────────
function SignInView({ onLogin, onForgotPassword }) {
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit() {
    setError("");
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Replace with: POST /auth/login
    // In production: validate against backend, receive JWT on success
    // Simulate wrong credentials for any non-company email
    if (!email.endsWith("@company.com")) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false);
    onLogin({ name:"Authenticated User", role:"employee", email });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-white mb-1" style={{ letterSpacing:"-0.02em" }}>Sign in</h1>
        <p className="text-sm text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
          Use your company email to access the HRIS.
        </p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Email address"
          type="email"
          value={email}
          onChange={v => { setEmail(v); setError(""); }}
          placeholder="you@company.com"
          autoFocus
          error={error && !password ? error : ""}
        />
        <InputField
          label="Password"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={v => { setPassword(v); setError(""); }}
          placeholder="Enter your password"
          error={error && password ? error : ""}
          rightSlot={<EyeIcon show={showPass} onToggle={() => setShowPass(p => !p)}/>}
        />
        {error && <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>{error}</p>}
      </div>

      <div className="flex justify-end">
        <button onClick={onForgotPassword}
          className="text-xs text-gray-500 hover:text-white transition-colors"
          style={{ fontFamily:"system-ui,sans-serif" }}>
          Forgot password?
        </button>
      </div>

      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in…" : "Sign In →"}
      </Btn>

    </div>
  );
}

// ── VIEW: FORGOT PASSWORD ─────────────────────────────────────────────────────
function ForgotPasswordView({ onBack }) {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit() {
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  }

  if (sent) return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor:"#0a1a0a", border:"1px solid #1e3a1e" }}>
          <span className="text-2xl">📧</span>
        </div>
        <h2 className="text-xl font-normal text-white mb-2" style={{ letterSpacing:"-0.01em" }}>Check your email</h2>
        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>
          If <span className="text-white">{email}</span> is registered, you'll receive a password reset link shortly. The link expires in <strong className="text-white">1 hour</strong>.
        </p>
      </div>
      <Btn onClick={onBack} variant="secondary">← Back to Sign In</Btn>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors mb-4"
          style={{ fontFamily:"system-ui,sans-serif" }}>← Back
        </button>
        <h1 className="text-2xl font-normal text-white mb-1" style={{ letterSpacing:"-0.02em" }}>Reset password</h1>
        <p className="text-sm text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
          Enter your work email and we'll send you a reset link.
        </p>
      </div>
      <InputField
        label="Work email"
        type="email"
        value={email}
        onChange={v => { setEmail(v); setError(""); }}
        placeholder="you@company.com"
        error={error}
        autoFocus
      />
      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending…" : "Send Reset Link"}
      </Btn>
    </div>
  );
}

// ── VIEW: SET PASSWORD (invite / reset) ───────────────────────────────────────
function SetPasswordView({ mode="invite", onComplete }) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});

  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  async function handleSubmit() {
    const errs = {};
    if (passwordScore < 3) errs.password = "Password is too weak. Please meet at least 3 requirements.";
    if (password !== confirm) errs.confirm = "Passwords don't match.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onComplete();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-white mb-1" style={{ letterSpacing:"-0.02em" }}>
          {mode === "invite" ? "Welcome — set your password" : "Set new password"}
        </h1>
        <p className="text-sm text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
          {mode === "invite"
            ? "Your account has been created. Set a password to get started."
            : "Choose a strong new password for your account."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <InputField
            label="New password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={v => { setPassword(v); setErrors(e => ({...e, password:""})); }}
            placeholder="Create a strong password"
            error={errors.password}
            rightSlot={<EyeIcon show={showPass} onToggle={() => setShowPass(p => !p)}/>}
            autoFocus
          />
          <PasswordStrength password={password}/>
        </div>
        <InputField
          label="Confirm password"
          type={showConf ? "text" : "password"}
          value={confirm}
          onChange={v => { setConfirm(v); setErrors(e => ({...e, confirm:""})); }}
          placeholder="Repeat your password"
          error={errors.confirm}
          rightSlot={<EyeIcon show={showConf} onToggle={() => setShowConf(p => !p)}/>}
        />
      </div>

      <Btn onClick={handleSubmit} disabled={loading || !password || !confirm}>
        {loading ? "Saving…" : mode === "invite" ? "Set Password & Sign In →" : "Update Password →"}
      </Btn>
    </div>
  );
}

// ── VIEW: LOGGED IN (dashboard preview) ───────────────────────────────────────
function LoggedInView({ user, onLogout }) {
  const color = ROLE_COLORS[user.role];
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
          style={{ backgroundColor:color+"22", border:`1px solid ${color}44`, color }}>
          {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
        </div>
        <h2 className="text-xl font-normal text-white mb-1" style={{ letterSpacing:"-0.01em" }}>
          Welcome back, {user.name.split(" ")[0]}
        </h2>
        <span className="text-xs px-3 py-1 rounded-full"
          style={{ fontFamily:"system-ui,sans-serif", backgroundColor:color+"18", color }}>
          {ROLE_LABELS[user.role]}
        </span>
      </div>

      {/* What this role can access */}
      <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily:"system-ui,sans-serif" }}>
          Your access level
        </p>
        {ROLE_ACCESS[user.role].map(item => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.level === "full" ? "#5af07a" : item.level === "dept" ? "#5a9af0" : item.level === "own" ? "#f0c85a" : "#333" }}/>
            <span className="text-sm text-gray-400 flex-1" style={{ fontFamily:"system-ui,sans-serif" }}>{item.label}</span>
            <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{item.scope}</span>
          </div>
        ))}
      </div>

      <Btn onClick={onLogout} variant="secondary">Sign Out</Btn>
    </div>
  );
}

const ROLE_ACCESS = {
  super_admin: [
    { label:"All employees & records", level:"full", scope:"Full access"       },
    { label:"Payroll & compensation",  level:"full", scope:"Full access"       },
    { label:"Attendance & time",       level:"full", scope:"Full access"       },
    { label:"Leave management",        level:"full", scope:"Full access"       },
    { label:"Recruitment",             level:"full", scope:"Full access"       },
    { label:"Task management",         level:"full", scope:"Full access"       },
    { label:"User & role management",  level:"full", scope:"Full access"       },
    { label:"System audit logs",       level:"full", scope:"Full access"       },
  ],
  hr_admin: [
    { label:"All employees & records", level:"full", scope:"Full access"       },
    { label:"Payroll & compensation",  level:"full", scope:"Full access"       },
    { label:"Attendance & time",       level:"full", scope:"Full access"       },
    { label:"Leave management",        level:"full", scope:"Full access + Approve" },
    { label:"Recruitment",             level:"full", scope:"Full access"       },
    { label:"Task management",         level:"full", scope:"View all + Assign" },
    { label:"User management",         level:"full", scope:"Create & edit users" },
    { label:"System audit logs",       level:"none", scope:"No access"        },
  ],
  manager: [
    { label:"Employees",               level:"dept", scope:"Own department only" },
    { label:"Payroll",                 level:"own",  scope:"Own payslip only"    },
    { label:"Attendance",              level:"dept", scope:"Own department only" },
    { label:"Leave management",        level:"dept", scope:"Approve dept leave"  },
    { label:"Recruitment",             level:"none", scope:"No access"           },
    { label:"Task management",         level:"dept", scope:"Assign within dept"  },
    { label:"User management",         level:"none", scope:"No access"           },
  ],
  employee: [
    { label:"Employee profile",        level:"own",  scope:"Own profile only"  },
    { label:"Payroll",                 level:"own",  scope:"Own payslip only"  },
    { label:"Attendance",              level:"own",  scope:"Own records only"  },
    { label:"Leave",                   level:"own",  scope:"File & view own"   },
    { label:"Offset",                  level:"own",  scope:"View own offsets"  },
    { label:"Recruitment",             level:"none", scope:"No access"         },
    { label:"Tasks",                   level:"own",  scope:"Own tasks only"    },
    { label:"User management",         level:"none", scope:"No access"         },
  ],
};

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
