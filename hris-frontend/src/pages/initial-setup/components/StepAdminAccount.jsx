import { useState } from "react";

import Field from "./Field";
import EyeToggle from "./EyeToggle";
import NavButtons from "./NavButtons";

import { TOTAL_STEPS, inputCls, inputStyle, parsePasswordStrength, STRENGTH_COLOR, STRENGTH_LABEL } from "../../../data/compData";


export default function StepAdminAccount({ data, onChange, onNext, onBack }) {
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