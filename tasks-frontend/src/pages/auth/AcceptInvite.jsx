import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import api from "../../services/api";

// Password strength helper
function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8)                score++;
  if (/[A-Z]/.test(password))              score++;
  if (/[0-9]/.test(password))              score++;
  if (/[^A-Za-z0-9]/.test(password))       score++;
  const levels = [
    { label: "",          color: "#1e1e1e" },
    { label: "Weak",      color: "#ef4444" },
    { label: "Fair",      color: "#f97316" },
    { label: "Good",      color: "#facc15" },
    { label: "Strong",    color: "#22c55e" },
  ];
  return { score, ...levels[score] };
}

export default function AcceptInvite() {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();
  const token           = searchParams.get("token");

  const [form, setForm]       = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tokenValid, setTokenValid] = useState(null); // null=checking, true, false
  const [employeeName, setEmployeeName] = useState("");

  // Validate token on mount
  useEffect(() => {
    if (!token) { setTokenValid(false); return; }

    // Optimistically set valid — backend will confirm on submit
    // For a real app you'd call GET /auth/validate-invite?token=...
    setTokenValid(true);
  }, [token]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/accept-invite", {
        token,
        password: form.password,
      });

      // Auto-login after accepting invite
      dispatch(setCredentials(data));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "Invalid or expired invite link.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Token invalid ─────────────────────────────────────────────────────────
  if (tokenValid === false) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logoWrapper}>
            <div style={s.logoText}>BCS</div>
            <div style={s.logoSub}>Workspace</div>
          </div>
          <div style={s.heading}>Invalid invite link</div>
          <div style={s.subheading}>
            This invite link is missing, expired, or has already been used.
          </div>
          <div style={s.invalidIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <Link to="/login" style={s.backLink}>← Back to login</Link>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrapper}>
          <div style={s.logoText}>BCS</div>
          <div style={s.logoSub}>Workspace</div>
        </div>

        {/* Welcome header */}
        <div style={s.welcomeBox}>
          <div style={s.welcomeIcon}>👋</div>
          <div>
            <div style={s.heading}>Welcome to BCS Workspace</div>
            <div style={s.subheading}>Set a password to activate your account and get started.</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={s.banner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          {/* New password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>New password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              autoFocus
              style={s.input}
              disabled={loading}
            />

            {/* Strength meter */}
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={s.strengthBar}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        ...s.strengthSegment,
                        background: i <= strength.score ? strength.color : "#222",
                      }}
                    />
                  ))}
                </div>
                <div style={{ ...s.strengthLabel, color: strength.color }}>
                  {strength.label}
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Confirm password</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              style={{
                ...s.input,
                ...(form.confirm && form.password !== form.confirm ? s.inputError : {}),
              }}
              disabled={loading}
            />
            {form.confirm && form.password !== form.confirm && (
              <div style={s.fieldError}>Passwords do not match</div>
            )}
          </div>

          {/* Requirements */}
          <div style={s.requirements}>
            <Req met={form.password.length >= 8}  text="At least 8 characters" />
            <Req met={/[A-Z]/.test(form.password)} text="One uppercase letter" />
            <Req met={/[0-9]/.test(form.password)} text="One number" />
          </div>

          <button
            type="submit"
            style={{ ...s.submitBtn, ...(loading ? s.submitBtnLoading : {}) }}
            disabled={loading}
          >
            {loading ? "Activating account..." : "Activate account & sign in"}
          </button>
        </form>

        <div style={s.footer}>
          Already have an account? <Link to="/login" style={s.loginLink}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

// ── Requirement indicator ─────────────────────────────────────────────────────
function Req({ met, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
      <div style={{ ...reqStyles.dot, background: met ? "#22c55e" : "#2a2a2a" }}>
        {met && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 11, color: met ? "#555" : "#333" }}>{text}</span>
    </div>
  );
}

const reqStyles = {
  dot: { width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" },
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:            { minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" },
  card:            { width: "100%", maxWidth: 420, background: "#141414", border: "0.5px solid #1e1e1e", borderRadius: 12, padding: "36px 32px" },
  logoWrapper:     { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 },
  logoText:        { fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "1px" },
  logoSub:         { fontSize: 12, color: "#333" },
  welcomeBox:      { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 },
  welcomeIcon:     { fontSize: 24, lineHeight: 1, marginTop: 2 },
  heading:         { fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 4 },
  subheading:      { fontSize: 12, color: "#444", lineHeight: 1.5 },
  banner:          { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 6, fontSize: 12, marginBottom: 16, lineHeight: 1.5, background: "rgba(239,68,68,0.08)", color: "#f87171", border: "0.5px solid rgba(239,68,68,0.2)" },
  form:            { display: "flex", flexDirection: "column", gap: 16 },
  fieldGroup:      { display: "flex", flexDirection: "column" },
  label:           { fontSize: 12, color: "#666", marginBottom: 6, fontWeight: 500 },
  input:           { background: "#1a1a1a", border: "0.5px solid #2a2a2a", borderRadius: 6, padding: "10px 12px", fontSize: 13, color: "#ccc", outline: "none", transition: "border-color 0.15s" },
  inputError:      { borderColor: "rgba(239,68,68,0.5)" },
  fieldError:      { fontSize: 11, color: "#f87171", marginTop: 4 },
  strengthBar:     { display: "flex", gap: 4 },
  strengthSegment: { flex: 1, height: 3, borderRadius: 2, transition: "background 0.2s" },
  strengthLabel:   { fontSize: 11, marginTop: 4, transition: "color 0.2s" },
  requirements:    { background: "#1a1a1a", borderRadius: 6, padding: "10px 12px" },
  submitBtn:       { marginTop: 4, padding: "11px", borderRadius: 6, background: "#fff", color: "#000", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "opacity 0.15s" },
  submitBtnLoading:{ opacity: 0.5, cursor: "not-allowed" },
  footer:          { marginTop: 24, fontSize: 11, color: "#333", textAlign: "center" },
  loginLink:       { color: "#555", textDecoration: "none" },
  invalidIcon:     { display: "flex", justifyContent: "center", margin: "28px 0 20px" },
  backLink:        { display: "block", textAlign: "center", fontSize: 12, color: "#555", textDecoration: "none", marginTop: 8 },
};
