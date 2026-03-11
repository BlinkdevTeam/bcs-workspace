import { useState } from "react";

import Field from "./Field";
import NavButtons from "./NavButtons";

import { TOTAL_STEPS, inputCls, inputStyle, INDUSTRIES, COMPANY_SIZES } from "../../../data/compData";

export default function StepCompany({ data, onChange, onNext, onBack }) {
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