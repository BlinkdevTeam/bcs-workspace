import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../../store/authSlice";
import { SignInBtn } from "../../../components/ui";
import InputField from "./InputField";
import EyeIcon from "./EyeIcon";

export default function SignInView({ onForgotPassword }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error: authError } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");

  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((s) => Math.max(s - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  async function handleSubmit() {
    setLocalError("");

    if (!email.trim() || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    try {
      const resultAction = await dispatch(
        loginUserAction({ email, password })
      );

      if (loginUserAction.fulfilled.match(resultAction)) {
        navigate("/dashboard", { replace: true });
      } else if (
        loginUserAction.rejected.match(resultAction) &&
        resultAction.payload?.lockout_seconds
      ) {
        // Backend tells us user is locked
        setLockoutSeconds(resultAction.payload.lockout_seconds);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  const displayError = localError || authError;
  const isLocked = lockoutSeconds > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
          Sign in
        </h1>
        <p className="text-sm text-gray-600">
          Use your company email to access the HRIS.
        </p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Email address"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setLocalError(""); }}
          placeholder="you@company.com"
          autoFocus
        />
        <InputField
          label="Password"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(v) => { setPassword(v); setLocalError(""); }}
          placeholder="Enter your password"
          rightSlot={<EyeIcon show={showPass} onToggle={() => setShowPass((p) => !p)} />}
        />

        {displayError && (
          <p className="text-xs" style={{ color: "#f05a5a" }}>
            {displayError}
          </p>
        )}

        {isLocked && (
          <p className="text-xs text-yellow-400">
            Too many failed attempts. Try again in {lockoutSeconds}s.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <SignInBtn onClick={handleSubmit} disabled={loading || isLocked}>
        {loading ? "Signing in…" : isLocked ? `Locked (${lockoutSeconds}s)` : "Sign In →"}
      </SignInBtn>
    </div>
  );
}