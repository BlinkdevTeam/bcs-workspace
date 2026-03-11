import { useState } from "react";

import InputField from "./InputField";
import EyeIcon from "./EyeIcon";
import Btn from "./Btn";

export default function SetPasswordView({ mode = "invite", onComplete }) {
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