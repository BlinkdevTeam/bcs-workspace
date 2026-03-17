import { useState, useEffect } from "react";
import axios from "axios";
import PasswordStrength from "./PasswordStrength";
import InputField from "./InputField";
import EyeIcon from "./EyeIcon";
import Btn from "./Btn";

export default function SetPasswordView({ token, onComplete }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(null); // null = loading, false = invalid, true = valid

  const API_URL = import.meta.env.VITE_API_URL;

  // ---------------- TOKEN VERIFICATION ----------------
  useEffect(() => {
    if (!token) {
      onComplete(); // redirect safely if no token
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.post(`${API_URL}/auth/verify-reset-token`, { token });
        setTokenValid(res.data.valid);
        if (!res.data.valid) {
          setErrors({ submit: "Reset link expired or invalid." });
        }
      } catch (err) {
        console.error("Verify token error:", err);
        setTokenValid(false);
        setErrors({ submit: "Reset link expired or invalid." });
      }
    };

    verifyToken();
  }, [token, onComplete, API_URL]);

  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  // ---------------- HANDLE SUBMIT ----------------
  async function handleSubmit() {
    const errs = {};

    if (passwordScore < 3) {
      errs.password = "Password is too weak.";
    }

    if (password !== confirm) {
      errs.confirm = "Passwords don't match.";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      });

      alert("Password updated successfully!");
      onComplete(); // redirect to login
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setLoading(false);
    }
  }

  // ---------------- RENDER ----------------
  if (tokenValid === null) {
    return <div className="text-white">Verifying reset link...</div>;
  }

  if (!tokenValid) {
    return (
      <div className="text-red-500">
        Reset link expired or invalid. Please request a new password reset.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-white">Set new password</h1>

      <InputField
        label="New password"
        type={showPass ? "text" : "password"}
        value={password}
        onChange={setPassword}
        error={errors.password}
        rightSlot={
          <EyeIcon show={showPass} onToggle={() => setShowPass(!showPass)} />
        }
      />

      <PasswordStrength password={password} />

      <InputField
        label="Confirm password"
        type={showConf ? "text" : "password"}
        value={confirm}
        onChange={setConfirm}
        error={errors.confirm}
        rightSlot={
          <EyeIcon show={showConf} onToggle={() => setShowConf(!showConf)} />
        }
      />

      {errors.submit && (
        <p className="text-red-500 text-sm">{errors.submit}</p>
      )}

      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Update Password"}
      </Btn>
    </div>
  );
}