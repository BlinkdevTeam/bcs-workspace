import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

export default function Profile() {
  const { hash } = useLocation();
  const [me, setMe]           = useState(null);
  const [loadError, setLoadError] = useState("");

  // contact form
  const [phone, setPhone]     = useState("");
  const [pEmail, setPEmail]   = useState("");
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState(null); // {ok, text}

  // password form
  const [cur, setCur]   = useState("");
  const [nw, setNw]     = useState("");
  const [conf, setConf] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg]   = useState(null);

  useEffect(() => {
    api.get("/employees/me")
      .then((r) => { setMe(r.data.employee); setPhone(r.data.employee.phone || ""); setPEmail(r.data.employee.personal_email || ""); })
      .catch((e) => setLoadError(e.response?.data?.message || "Could not load your profile."));
  }, []);

  useEffect(() => {
    if (hash === "#password" && me) document.getElementById("password-card")?.scrollIntoView({ behavior: "smooth" });
  }, [hash, me]);

  const saveContact = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      const { data } = await api.patch("/employees/me", { phone, personal_email: pEmail });
      setMe(data.employee);
      setSaveMsg({ ok: true, text: "Saved." });
    } catch (e) {
      setSaveMsg({ ok: false, text: e.response?.data?.message || "Could not save." });
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    setPwMsg(null);
    if (nw.length < 8)  return setPwMsg({ ok: false, text: "New password must be at least 8 characters." });
    if (nw !== conf)    return setPwMsg({ ok: false, text: "New password and confirmation do not match." });
    setPwBusy(true);
    try {
      await api.post("/employees/me/password", { current_password: cur, new_password: nw });
      setCur(""); setNw(""); setConf("");
      setPwMsg({ ok: true, text: "Password changed. Your other sessions were signed out." });
    } catch (e) {
      setPwMsg({ ok: false, text: e.response?.data?.message || "Could not change password." });
    } finally { setPwBusy(false); }
  };

  if (loadError) return <div style={s.page}><div style={s.err}>{loadError}</div></div>;
  if (!me)       return <div style={s.page}><div style={s.sub}>Loading...</div></div>;

  const fullName = [me.first_name, me.middle_name, me.last_name].filter(Boolean).join(" ").replace(/\s+/g, " ");
  const contactChanged = phone !== (me.phone || "") || pEmail !== (me.personal_email || "");

  return (
    <div style={s.page}>
      <div style={s.title}>My Profile</div>
      <div style={s.sub}>Your account details and security</div>

      <div style={s.grid}>
        {/* Details */}
        <div style={s.card}>
          <div style={s.profileRow}>
            <div style={s.avatar}>{me.avatar_initials}</div>
            <div>
              <div style={s.name}>{fullName}</div>
              <div style={s.role}>{me.role_title || "Employee"}</div>
            </div>
          </div>

          <div style={s.cardTitle}>Employment</div>
          <div style={s.fields}>
            <Field label="Employee code" value={me.employee_code} />
            <Field label="Work email"    value={me.email} />
            <Field label="Role"          value={me.role_title} />
            <Field label="Status"        value={me.status} />
          </div>
          <div style={s.hint}>These are managed by HR. Ask HR if something needs changing.</div>

          <div style={{ ...s.cardTitle, marginTop: 24 }}>Contact details</div>
          <label style={s.label}>Phone</label>
          <input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0917 123 4567" />
          <label style={s.label}>Personal email</label>
          <input style={s.input} value={pEmail} onChange={(e) => setPEmail(e.target.value)} placeholder="name@example.com" />
          <div style={s.actions}>
            <button style={{ ...s.btn, opacity: !contactChanged || saving ? 0.5 : 1 }} disabled={!contactChanged || saving} onClick={saveContact}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saveMsg && <span style={{ ...s.msg, color: saveMsg.ok ? "#4ade80" : "#f87171" }}>{saveMsg.text}</span>}
          </div>
        </div>

        {/* Password */}
        <div style={s.card} id="password-card">
          <div style={s.cardTitle}>Change password</div>
          <label style={s.label}>Current password</label>
          <input style={s.input} type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} />
          <label style={s.label}>New password</label>
          <input style={s.input} type="password" autoComplete="new-password" value={nw} onChange={(e) => setNw(e.target.value)} />
          <label style={s.label}>Confirm new password</label>
          <input style={s.input} type="password" autoComplete="new-password" value={conf} onChange={(e) => setConf(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") changePassword(); }} />
          <div style={s.hint}>At least 8 characters. Your other sessions will be signed out.</div>
          <div style={s.actions}>
            <button style={{ ...s.btn, opacity: !cur || !nw || !conf || pwBusy ? 0.5 : 1 }} disabled={!cur || !nw || !conf || pwBusy} onClick={changePassword}>
              {pwBusy ? "Changing..." : "Change password"}
            </button>
          </div>
          {pwMsg && <div style={{ ...s.msg, marginTop: 12, color: pwMsg.ok ? "#4ade80" : "#f87171" }}>{pwMsg.text}</div>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={s.label}>{label}</div>
      <div style={s.value}>{value || "—"}</div>
    </div>
  );
}

const s = {
  page:       { padding: "28px 32px", color: "#c9c9c9" },
  title:      { fontSize: 20, fontWeight: 600, color: "#fff" },
  sub:        { fontSize: 12, color: "#9a9a9a", marginTop: 4, marginBottom: 22 },
  err:        { fontSize: 13, color: "#f87171" },
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18, alignItems: "start" },
  card:       { background: "#262626", border: "0.5px solid #454545", borderRadius: 10, padding: 22 },
  profileRow: { display: "flex", alignItems: "center", gap: 16, marginBottom: 22 },
  avatar:     { width: 54, height: 54, borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600 },
  name:       { fontSize: 17, fontWeight: 600, color: "#fff" },
  role:       { fontSize: 12, color: "#9a9a9a", marginTop: 3 },
  cardTitle:  { fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 14 },
  fields:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  label:      { display: "block", fontSize: 11, color: "#8a8a8a", marginBottom: 5, marginTop: 12 },
  value:      { fontSize: 13, color: "#ddd", wordBreak: "break-word" },
  hint:       { fontSize: 11, color: "#8a8a8a", marginTop: 12 },
  input:      { width: "100%", boxSizing: "border-box", fontSize: 13, padding: "8px 11px", borderRadius: 6, background: "#202020", border: "0.5px solid #454545", color: "#eee", outline: "none" },
  actions:    { display: "flex", alignItems: "center", gap: 12, marginTop: 16 },
  btn:        { fontSize: 12, padding: "8px 18px", borderRadius: 6, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer" },
  msg:        { fontSize: 12 },
};
