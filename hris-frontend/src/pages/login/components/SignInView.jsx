import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loginUserAction } from "../../../store/authSlice"; // Import the Thunk action
import { SignInBtn } from "../../../components/ui";
import InputField from "./InputField";
import EyeIcon from "./EyeIcon";

export default function SignInView({ onForgotPassword }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get loading and error states directly from Redux
  const { loading, error: authError } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleSubmit() {
    setLocalError("");

    // Basic client-side validation
    if (!email.trim() || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    // Dispatch the Redux action
    // .unwrap() allows us to handle the promise result directly if needed, 
    // but the slice already handles state updates.
    const resultAction = await dispatch(loginUserAction({ email, password }));

    if (loginUserAction.fulfilled.match(resultAction)) {
      // If the login was successful, Redux state is updated.
      // We can now safely navigate to the dashboard.
      navigate("/dashboard", { replace: true });
    }
  }

  // Combine local validation errors with backend errors from Redux
  const displayError = localError || authError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
          Sign in
        </h1>
        <p className="text-sm text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>
          Use your company email to access the HRIS.
        </p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Email address"
          type="email"
          value={email}
          onChange={(v) => { 
            setEmail(v); 
            setLocalError(""); 
          }}
          placeholder="you@company.com"
          autoFocus
        />
        <InputField
          label="Password"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(v) => { 
            setPassword(v); 
            setLocalError(""); 
          }}
          placeholder="Enter your password"
          rightSlot={
            <EyeIcon 
              show={showPass} 
              onToggle={() => setShowPass((p) => !p)} 
            />
          }
        />

        {displayError && (
          <p className="text-xs" style={{ fontFamily: "system-ui,sans-serif", color: "#f05a5a" }}>
            {displayError}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-gray-500 hover:text-white transition-colors"
          style={{ fontFamily: "system-ui,sans-serif" }}
        >
          Forgot password?
        </button>
      </div>

      <SignInBtn onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in…" : "Sign In →"}
      </SignInBtn>
    </div>
  );
}