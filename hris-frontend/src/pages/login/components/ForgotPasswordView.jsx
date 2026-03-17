import { useState } from "react";
import axios from "axios";
import InputField from "./InputField";
import Btn from "./Btn";

export default function ForgotPasswordView({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // Vite
  // const API_URL = process.env.REACT_APP_API_URL; // CRA

  async function handleSubmit() {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent)
    return (
      <div className="space-y-6">
        <div className="text-center py-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#0a1a0a", border: "1px solid #1e3a1e" }}
          >
            <span className="text-2xl">📧</span>
          </div>
          <h2 className="text-xl font-normal text-white mb-2">
            Check your email
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            If <span className="text-white">{email}</span> is registered, you’ll
            receive a password reset link shortly. The link expires in{" "}
            <strong className="text-white">1 hour</strong>.
          </p>
        </div>
        <Btn onClick={onBack} variant="secondary">
          ← Back to Sign In
        </Btn>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-normal text-white mb-1">Reset password</h1>
        <p className="text-sm text-gray-600">
          Enter your work email and we’ll send you a reset link.
        </p>
      </div>
      <InputField
        label="Work email"
        type="email"
        value={email}
        onChange={(v) => setEmail(v)}
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