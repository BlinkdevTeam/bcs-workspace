import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      setSent(true);
    } catch (err) {
      // Always show success to avoid email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrapper}>
          <div style={s.logoText}>BCS</div>
          <div style={s.logoSub}>Workspace</div>
        </div>

        {!sent ? (
          <>
            <div style={s.heading}>Reset your password</div>
            <div style={s.subheading}>
              Enter your email and we'll send you a link to reset your password.
            </div>

            {error && (
              <div style={s.banner}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@bcsworkspace.com"
                  autoFocus
                  style={s.input}
                  disabled={loading}
                />
              </div>
              <button type="submit" style={{ ...s.submitBtn, ...(loading ? s.submitBtnLoading : {}) }} disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        ) : (
          <div style={s.successBox}>
            <div style={s.successIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.64 19.79 19.79 0 01.5 1.06 2 2 0 012.49-.12h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.87-.87a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.89v2.03z"/>
              </svg>
            </div>
            <div style={s.successHeading}>Check your email</div>
            <div style={s.successText}>
              If an account exists for <strong style={{ color: "#888" }}>{email}</strong>, you'll receive a password reset link shortly.
            </div>
          </div>
        )}

        <Link to="/login" style={s.backLink}>← Back to login</Link>
      </div>
    </div>
  );
}

const s = {
  page:            { minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" },
  card:            { width: "100%", maxWidth: 400, background: "#141414", border: "0.5px solid #1e1e1e", borderRadius: 12, padding: "36px 32px" },
  logoWrapper:     { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 28 },
  logoText:        { fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "1px" },
  logoSub:         { fontSize: 12, color: "#333" },
  heading:         { fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 6 },
  subheading:      { fontSize: 12, color: "#444", marginBottom: 24, lineHeight: 1.6 },
  banner:          { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 6, fontSize: 12, marginBottom: 16, lineHeight: 1.5, background: "rgba(239,68,68,0.08)", color: "#f87171", border: "0.5px solid rgba(239,68,68,0.2)" },
  form:            { display: "flex", flexDirection: "column", gap: 16 },
  fieldGroup:      { display: "flex", flexDirection: "column" },
  label:           { fontSize: 12, color: "#666", marginBottom: 6, fontWeight: 500 },
  input:           { background: "#1a1a1a", border: "0.5px solid #2a2a2a", borderRadius: 6, padding: "10px 12px", fontSize: 13, color: "#ccc", outline: "none" },
  submitBtn:       { padding: "11px", borderRadius: 6, background: "#fff", color: "#000", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" },
  submitBtnLoading:{ opacity: 0.5, cursor: "not-allowed" },
  successBox:      { textAlign: "center", padding: "8px 0 20px" },
  successIcon:     { display: "flex", justifyContent: "center", marginBottom: 16 },
  successHeading:  { fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 8 },
  successText:     { fontSize: 12, color: "#555", lineHeight: 1.7 },
  backLink:        { display: "block", textAlign: "center", fontSize: 12, color: "#444", textDecoration: "none", marginTop: 24 },
};
