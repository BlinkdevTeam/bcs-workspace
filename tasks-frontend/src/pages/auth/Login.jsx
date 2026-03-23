import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials, setError } from "../../store/slices/authSlice";
import api from "../../services/api";

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setLocalError]= useState("");
  const [lockInfo, setLockInfo] = useState(null); // { locked_until }

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLockInfo(null);

    if (!form.email.trim() || !form.password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });

      dispatch(setCredentials(data));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.message || "Something went wrong. Try again.";

      if (status === 423) {
        // Account locked
        setLockInfo({ locked_until: err.response.data.locked_until });
        setLocalError(message);
      } else {
        setLocalError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrapper}>
          <div style={s.logoText}>BCS</div>
          <div style={s.logoSub}>Workspace</div>
        </div>

        <div style={s.heading}>Sign in to Tasks</div>
        <div style={s.subheading}>Use your BCS Workspace credentials</div>

        {/* Error banner */}
        {error && (
          <div style={{ ...s.banner, ...(lockInfo ? s.bannerWarn : s.bannerError) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          {/* Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Email address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@bcsworkspace.com"
              autoComplete="email"
              autoFocus
              style={s.input}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div style={s.fieldGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={s.label}>Password</label>
              <Link to="/forgot-password" style={s.forgotLink}>Forgot password?</Link>
            </div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              style={s.input}
              disabled={loading}
            />
          </div>

          <button type="submit" style={{ ...s.submitBtn, ...(loading ? s.submitBtnLoading : {}) }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={s.footer}>
          Need access? Contact your HR administrator.
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:            { minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" },
  card:            { width: "100%", maxWidth: 400, background: "#141414", border: "0.5px solid #1e1e1e", borderRadius: 12, padding: "36px 32px" },
  logoWrapper:     { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 28 },
  logoText:        { fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "1px" },
  logoSub:         { fontSize: 12, color: "#333" },
  heading:         { fontSize: 20, fontWeight: 500, color: "#fff", marginBottom: 6 },
  subheading:      { fontSize: 13, color: "#444", marginBottom: 24 },
  banner:          { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 6, fontSize: 12, marginBottom: 16, lineHeight: 1.5 },
  bannerError:     { background: "rgba(239,68,68,0.08)", color: "#f87171", border: "0.5px solid rgba(239,68,68,0.2)" },
  bannerWarn:      { background: "rgba(251,191,36,0.08)", color: "#fbbf24", border: "0.5px solid rgba(251,191,36,0.2)" },
  form:            { display: "flex", flexDirection: "column", gap: 16 },
  fieldGroup:      { display: "flex", flexDirection: "column" },
  label:           { fontSize: 12, color: "#666", marginBottom: 6, fontWeight: 500 },
  input:           { background: "#1a1a1a", border: "0.5px solid #2a2a2a", borderRadius: 6, padding: "10px 12px", fontSize: 13, color: "#ccc", outline: "none", transition: "border-color 0.15s" },
  forgotLink:      { fontSize: 11, color: "#444", textDecoration: "none" },
  submitBtn:       { marginTop: 4, padding: "11px", borderRadius: 6, background: "#fff", color: "#000", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "opacity 0.15s" },
  submitBtnLoading:{ opacity: 0.5, cursor: "not-allowed" },
  footer:          { marginTop: 24, fontSize: 11, color: "#333", textAlign: "center", lineHeight: 1.6 },
};
