import { useState } from "react";

import InputField from "./InputField";
import Btn from "./Btn";

export default function ForgotPasswordView({ onBack }) {
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