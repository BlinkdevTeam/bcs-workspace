import { useState } from "react";

// ── FIRST-RUN SETUP WIZARD ────────────────────────────────────────────────────
// Shown ONCE when the database has zero users.
// After completion it is permanently inaccessible.
//
// Steps:
//   1. Welcome          — explain what this is and what's about to happen
//   2. Company Info     — company name, industry, size
//   3. Admin Account    — name, email, password (with strength check)
//   4. Confirmation     — review everything before submitting
//   5. Done             — success state, redirect to login
//
// In production:
//   - The backend checks users.count === 0 before serving this page
//   - Once step 5 completes, the route /setup returns 404 forever
//   - The created account gets role = super_admin, must_change_password = false
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4; // steps 1–4 (step 5 is the done state)

const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Retail & E-commerce",
  "Manufacturing", "Education", "Real Estate", "Logistics & Supply Chain",
  "Media & Entertainment", "Professional Services", "Other",
];

const COMPANY_SIZES = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "501–1,000 employees", "1,000+ employees",
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function parsePasswordStrength(password) {
  const checks = [
    { label:"8+ characters",     pass: password.length >= 8           },
    { label:"Uppercase",         pass: /[A-Z]/.test(password)         },
    { label:"Lowercase",         pass: /[a-z]/.test(password)         },
    { label:"Number",            pass: /[0-9]/.test(password)         },
    { label:"Special character", pass: /[^A-Za-z0-9]/.test(password)  },
  ];
  const score = checks.filter(c => c.pass).length;
  return { checks, score };
}

const STRENGTH_LABEL = ["", "Very Weak", "Weak", "Fair",   "Strong",  "Very Strong"];
const STRENGTH_COLOR = ["", "#f05a5a",   "#f05a5a","#f0c85a","#5a9af0", "#5af07a"   ];

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Field({ label, hint, error, children }) {
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

const inputCls = "w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all";
function inputStyle(error) {
  return {
    fontFamily:      "system-ui,sans-serif",
    backgroundColor: "#111",
    border:          `1px solid ${error ? "#f05a5a66" : "#2a2a2a"}`,
  };
}

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
      {show
        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      }
    </button>
  );
}

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const num      = i + 1;
        const done     = step > num;
        const active   = step === num;
        return (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all"
                style={{
                  backgroundColor: done ? "#5af07a" : active ? "#fff" : "#111",
                  color:           done ? "#000"    : active ? "#000" : "#333",
                  border:          done || active ? "none" : "1px solid #2a2a2a",
                  fontFamily:      "system-ui,sans-serif",
                }}>
                {done ? "✓" : num}
              </div>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className="flex-1 h-px" style={{ backgroundColor: done ? "#5af07a44" : "#1a1a1a" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel="Continue →", nextDisabled=false, loading=false }) {
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

// ── STEP 1: WELCOME ───────────────────────────────────────────────────────────
function StepWelcome({ onNext }) {
  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{ backgroundColor:"#fff" }}>
          <span className="text-black font-bold text-xl">H</span>
        </div>
        <h1 className="text-3xl font-normal text-white mb-3" style={{ letterSpacing:"-0.03em" }}>
          Welcome to HRIS
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>
          This appears to be a fresh installation. Before anyone can log in, you need to create the first administrator account.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {[
          { icon:"🏢", title:"Set up your company",       desc:"Name, industry, and team size"                        },
          { icon:"🔐", title:"Create the admin account",  desc:"The first Super Admin — that's you"                  },
          { icon:"✅", title:"You're in",                 desc:"Log in and start inviting your team"                  },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 px-4 py-3.5 rounded-lg"
            style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p className="text-sm text-white" style={{ fontFamily:"system-ui,sans-serif" }}>{item.title}</p>
              <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>{item.desc}</p>
            </div>
            <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor:"#1e1e1e", color:"#444", fontSize:10, fontFamily:"monospace" }}>
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg px-4 py-3 flex items-start gap-2.5 mb-8"
        style={{ backgroundColor:"#0a1a2a", border:"1px solid #1e3a5a" }}>
        <span className="text-blue-400 flex-shrink-0 mt-0.5 text-sm">ℹ</span>
        <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>
          This setup screen is shown <strong className="text-white">only once</strong>. Once your admin account is created, this page becomes permanently inaccessible — even to admins.
        </p>
      </div>

      <button onClick={onNext}
        className="w-full py-3 rounded-lg text-sm font-medium bg-white text-black hover:opacity-90 transition-all"
        style={{ fontFamily:"system-ui,sans-serif" }}>
        Get Started →
      </button>
    </div>
  );
}

// ── STEP 2: COMPANY INFO ──────────────────────────────────────────────────────
function StepCompany({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!data.companyName.trim())  e.companyName = "Company name is required.";
    if (!data.industry)            e.industry    = "Please select an industry.";
    if (!data.size)                e.size        = "Please select a company size.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() { if (validate()) onNext(); }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Step 1 of {TOTAL_STEPS}</p>
        <h2 className="text-2xl font-normal text-white" style={{ letterSpacing:"-0.02em" }}>Your company</h2>
        <p className="text-sm text-gray-600 mt-1" style={{ fontFamily:"system-ui,sans-serif" }}>This information helps personalise your HRIS.</p>
      </div>

      <div className="space-y-5">
        <Field label="Company Name" error={errors.companyName}>
          <input className={inputCls} style={inputStyle(errors.companyName)}
            placeholder="e.g. Acme Corporation" autoFocus
            value={data.companyName} onChange={e => onChange("companyName", e.target.value)}/>
        </Field>

        <Field label="Industry" error={errors.industry}>
          <select className={inputCls} style={inputStyle(errors.industry)}
            value={data.industry} onChange={e => onChange("industry", e.target.value)}>
            <option value="">Select your industry…</option>
            {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </Field>

        <Field label="Company Size" error={errors.size}>
          <div className="grid grid-cols-2 gap-2">
            {COMPANY_SIZES.map(s => (
              <button key={s} type="button" onClick={() => onChange("size", s)}
                className="px-3 py-2.5 rounded-lg text-sm text-left transition-all hover:opacity-80"
                style={{
                  fontFamily:      "system-ui,sans-serif",
                  backgroundColor: data.size === s ? "#fff" : "#111",
                  color:           data.size === s ? "#000" : "#555",
                  border:          `1px solid ${data.size === s ? "transparent" : "#2a2a2a"}`,
                }}>
                {s}
              </button>
            ))}
          </div>
          {errors.size && <p className="text-xs mt-1" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>{errors.size}</p>}
        </Field>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext}/>
    </div>
  );
}

// ── STEP 3: ADMIN ACCOUNT ─────────────────────────────────────────────────────
function StepAdminAccount({ data, onChange, onNext, onBack }) {
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [errors,    setErrors]    = useState({});
  const { checks, score } = parsePasswordStrength(data.password);

  function validate() {
    const e = {};
    if (!data.firstName.trim())  e.firstName = "First name is required.";
    if (!data.lastName.trim())   e.lastName  = "Last name is required.";
    if (!data.email.trim())      e.email     = "Email is required.";
    else if (!data.email.includes("@") || !data.email.includes("."))
                                 e.email     = "Enter a valid email address.";
    if (score < 3)               e.password  = "Password is too weak — meet at least 3 requirements.";
    if (data.password !== data.confirm)
                                 e.confirm   = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() { if (validate()) onNext(); }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Step 2 of {TOTAL_STEPS}</p>
        <h2 className="text-2xl font-normal text-white" style={{ letterSpacing:"-0.02em" }}>Admin account</h2>
        <p className="text-sm text-gray-600 mt-1" style={{ fontFamily:"system-ui,sans-serif" }}>
          This becomes the <span className="text-white">Super Admin</span> — the highest level of access.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" error={errors.firstName}>
            <input className={inputCls} style={inputStyle(errors.firstName)}
              placeholder="Sara" autoFocus
              value={data.firstName} onChange={e => onChange("firstName", e.target.value)}/>
          </Field>
          <Field label="Last Name" error={errors.lastName}>
            <input className={inputCls} style={inputStyle(errors.lastName)}
              placeholder="Okafor"
              value={data.lastName} onChange={e => onChange("lastName", e.target.value)}/>
          </Field>
        </div>

        <Field label="Work Email" error={errors.email}
          hint="This will be your login email">
          <input className={inputCls} style={inputStyle(errors.email)}
            type="email" placeholder="you@company.com"
            value={data.email} onChange={e => onChange("email", e.target.value)}/>
        </Field>

        <Field label="Password" error={errors.password}>
          <div className="relative">
            <input className={inputCls} style={{ ...inputStyle(errors.password), paddingRight:44 }}
              type={showPass ? "text" : "password"} placeholder="Create a strong password"
              value={data.password} onChange={e => onChange("password", e.target.value)}/>
            <EyeToggle show={showPass} onToggle={() => setShowPass(p => !p)}/>
          </div>
          {/* Strength meter */}
          {data.password && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all"
                    style={{ backgroundColor: i <= score ? STRENGTH_COLOR[score] : "#1e1e1e" }}/>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {checks.map(c => (
                    <span key={c.label} className="text-xs"
                      style={{ fontFamily:"system-ui,sans-serif", color: c.pass ? "#5af07a" : "#444" }}>
                      {c.pass ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium whitespace-nowrap ml-2"
                  style={{ fontFamily:"system-ui,sans-serif", color: STRENGTH_COLOR[score] }}>
                  {STRENGTH_LABEL[score]}
                </span>
              </div>
            </div>
          )}
        </Field>

        <Field label="Confirm Password" error={errors.confirm}>
          <div className="relative">
            <input className={inputCls} style={{ ...inputStyle(errors.confirm), paddingRight:44 }}
              type={showConf ? "text" : "password"} placeholder="Repeat your password"
              value={data.confirm} onChange={e => onChange("confirm", e.target.value)}/>
            <EyeToggle show={showConf} onToggle={() => setShowConf(p => !p)}/>
          </div>
        </Field>

        {/* Super Admin notice */}
        <div className="rounded-lg px-4 py-3 flex items-start gap-2.5"
          style={{ backgroundColor:"#1a0a0a", border:"1px solid #3a1515" }}>
          <span className="text-red-400 flex-shrink-0 mt-0.5 text-sm">⚠</span>
          <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>
            This account gets <strong className="text-white">Super Admin</strong> access — full control over all data, users, and settings. Store these credentials securely. They cannot be recovered without database access.
          </p>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext}/>
    </div>
  );
}

// ── STEP 4: CONFIRMATION ──────────────────────────────────────────────────────
function StepConfirm({ company, admin, onBack, onSubmit, loading }) {
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

// ── STEP 5: DONE ──────────────────────────────────────────────────────────────
function StepDone({ admin, company, onGoToLogin }) {
  return (
    <div className="text-center py-4">
      {/* Animated checkmark */}
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor:"#0a1a0a", border:"2px solid #5af07a" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5af07a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor:"#fff" }}>
          <span className="text-xs font-bold text-black" style={{ fontFamily:"system-ui,sans-serif" }}>H</span>
        </div>
      </div>

      <h2 className="text-2xl font-normal text-white mb-2" style={{ letterSpacing:"-0.02em" }}>
        You're all set, {admin.firstName}
      </h2>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed" style={{ fontFamily:"system-ui,sans-serif" }}>
        <strong className="text-white">{company.companyName}</strong> is ready.<br/>
        Sign in with <strong className="text-white">{admin.email}</strong> to get started.
      </p>

      {/* What to do next */}
      <div className="text-left rounded-lg p-4 mb-8 space-y-3"
        style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
        <p className="text-xs uppercase tracking-widest text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>Next steps</p>
        {[
          { icon:"👥", text:"Go to People and add your employees"                  },
          { icon:"✉️", text:"Invite your HR team — they'll get an email link"       },
          { icon:"💰", text:"Set up compensation packages in Payroll"               },
          { icon:"📋", text:"Configure leave types in Time & Leave"                 },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base">{item.icon}</span>
            <p className="text-sm text-gray-400" style={{ fontFamily:"system-ui,sans-serif" }}>{item.text}</p>
          </div>
        ))}
      </div>

      <button onClick={onGoToLogin}
        className="w-full py-3 rounded-lg text-sm font-medium bg-white text-black hover:opacity-90 transition-all"
        style={{ fontFamily:"system-ui,sans-serif" }}>
        Go to Login →
      </button>
    </div>
  );
}

// ── SETUP WIZARD ROOT ─────────────────────────────────────────────────────────
export default function SetupWizard() {
  const [step,    setStep]    = useState(0); // 0=welcome, 1-4=steps, 5=done
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState({
    companyName: "",
    industry:    "",
    size:        "",
  });

  const [admin, setAdmin] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
    confirm:   "",
  });

  function setCompanyField(k, v) { setCompany(c => ({ ...c, [k]: v })); }
  function setAdminField(k, v)   { setAdmin(a   => ({ ...a, [k]: v })); }

  async function handleSubmit() {
    setLoading(true);
    // In production: POST /setup with { company, admin }
    // Backend validates no users exist, creates company record,
    // creates super_admin user, marks setup as complete,
    // then this route returns 404 on all future requests.
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep(5);
  }

  const showProgress = step >= 1 && step <= 4;

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor:"#000" }}>

      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage:  "linear-gradient(#ffffff04 1px, transparent 1px), linear-gradient(90deg, #ffffff04 1px, transparent 1px)",
        backgroundSize:   "40px 40px",
      }}/>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor:"#080808", border:"1px solid #1e1e1e", boxShadow:"0 0 80px rgba(0,0,0,0.8)" }}>

        {/* Top-right step indicator */}
        {showProgress && (
          <div className="absolute top-6 right-7 text-xs text-gray-700"
            style={{ fontFamily:"monospace" }}>
            {step} / {TOTAL_STEPS}
          </div>
        )}

        {/* Progress bar */}
        {showProgress && <ProgressBar step={step}/>}

        {/* Steps */}
        {step === 0 && (
          <StepWelcome onNext={() => setStep(1)}/>
        )}
        {step === 1 && (
          <StepCompany
            data={company}
            onChange={setCompanyField}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepAdminAccount
            data={admin}
            onChange={setAdminField}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepConfirm
            company={company}
            admin={admin}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
        {step === 5 && (
          <StepDone
            admin={admin}
            company={company}
            onGoToLogin={() => {
              // In production: window.location.href = "/login"
              setStep(0);
              setCompany({ companyName:"", industry:"", size:"" });
              setAdmin({ firstName:"", lastName:"", email:"", password:"", confirm:"" });
            }}
          />
        )}
      </div>

      {/* Bottom label */}
      {step < 5 && (
        <p className="fixed bottom-6 text-xs text-gray-800" style={{ fontFamily:"system-ui,sans-serif" }}>
          HRIS System · First-time setup
        </p>
      )}
    </div>
  );
}
