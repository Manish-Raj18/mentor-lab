import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css_files/login.css";

const API_BASE = "/api";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const passwordChecks = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "One letter", test: (p) => /[a-zA-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3.5 8 10 8a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || fallback;

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const otpRef = useRef(null);

  useEffect(() => {
    if (step === 2) {
      otpRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const emailValid = EMAIL_RE.test(email.trim());
  const passedChecks = passwordChecks.filter((check) => check.test(password)).length;
  const strengthLevel = passedChecks === 0 ? 0 : Math.min(4, passedChecks + (password.length >= 12 ? 1 : 0));

  const requestOtp = async (event) => {
    event?.preventDefault();
    setError("");
    setNotice("");

    if (!emailValid) {
      setError("Enter a valid email address to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/forgot-password`, {
        email: email.trim(),
      });
      setDevOtp(response.data.devOtp || "");
      setNotice(
        response.data.message ||
          "If an account exists for that email, a verification code has been sent."
      );
      setOtp("");
      setCooldown(60);
      setStep(2);
    } catch (err) {
      const retryAfter = err.response?.data?.retryAfter;
      if (retryAfter) {
        setCooldown(retryAfter);
      }
      setError(getErrorMessage(err, "Could not send the verification code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/verify-reset-otp`, {
        email: email.trim(),
        otp: otp.trim(),
      });
      setResetToken(response.data.resetToken);
      setNotice("");
      setStep(3);
    } catch (err) {
      setError(getErrorMessage(err, "The verification code is invalid or has expired."));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");

    if (passedChecks < passwordChecks.length) {
      setError("Your new password does not meet all the requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, {
        resetToken,
        password,
      });
      setStep(4);
    } catch (err) {
      setError(getErrorMessage(err, "Could not reset your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container1">
      <div className="form-box login-card forgot-card">
        <div className="login-brand">
          <div className="login-logo">
            <ShieldIcon />
          </div>
          <h2>{step === 4 ? "Password reset" : "Forgot password?"}</h2>
          <p className="login-subtitle">
            {step === 1 && "Enter the email linked to your account and we'll send a verification code."}
            {step === 2 && `We sent a 6-digit code to ${email.trim()}.`}
            {step === 3 && "Choose a strong new password for your account."}
            {step === 4 && "Your account is secure again. You can sign in with your new password."}
          </p>
        </div>

        {step <= 3 && (
          <ol className="forgot-steps" aria-label="Password reset progress">
            {["Email", "Verify", "Reset"].map((label, index) => {
              const number = index + 1;
              const state = step === number ? "active" : step > number ? "complete" : "";
              return (
                <li key={label} className={`forgot-step ${state}`}>
                  <span className="forgot-step-dot">{step > number ? "✓" : number}</span>
                  <span className="forgot-step-label">{label}</span>
                </li>
              );
            })}
          </ol>
        )}

        <div aria-live="polite">
          {error && <div className="forgot-alert forgot-alert-error" role="alert">{error}</div>}
          {notice && step === 2 && <div className="forgot-alert forgot-alert-info">{notice}</div>}
        </div>

        {step === 1 && (
          <form onSubmit={requestOtp}>
            <div className="input-group">
              <label htmlFor="reset-email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon"><EnvelopeIcon /></span>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading || !emailValid}>
              {loading ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp}>
            {devOtp && (
              <div className="forgot-dev">
                <div>
                  <strong>Development mode</strong>
                  <span>Email delivery is not configured, so use this code:</span>
                </div>
                <button
                  type="button"
                  className="forgot-dev-code"
                  onClick={() => setOtp(devOtp)}
                  title="Fill in this code"
                >
                  {devOtp}
                </button>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="reset-otp">Verification code</label>
              <input
                id="reset-otp"
                ref={otpRef}
                className="otp-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                autoComplete="one-time-code"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify code"}
            </button>

            <div className="forgot-actions">
              <button type="button" className="forgot-text-btn" onClick={() => { setStep(1); setError(""); setNotice(""); setDevOtp(""); }}>
                <ArrowLeftIcon /> Change email
              </button>
              <button
                type="button"
                className="forgot-text-btn"
                onClick={requestOtp}
                disabled={loading || cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword}>
            <div className="input-group">
              <label htmlFor="new-password">New password</label>
              <div className="input-wrap">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="password-strength">
              <div className="strength-meta">
                <span className={`strength-label ${strengthLevel <= 2 ? "weak" : strengthLevel === 3 ? "good" : "strong"}`}>
                  {password ? ["Weak", "Weak", "Fair", "Good", "Strong"][strengthLevel] : "Password strength"}
                </span>
              </div>
              <div className="password-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((segment) => (
                  <span key={segment} className={`meter-segment ${strengthLevel >= segment ? `level-${strengthLevel}` : ""}`} />
                ))}
              </div>
              <div className="strength-checks">
                {passwordChecks.map((check) => {
                  const passed = check.test(password);
                  return (
                    <span key={check.label} className={`strength-check ${passed ? "pass" : ""}`}>
                      {passed ? "✓" : "•"} {check.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirm new password</label>
              <div className="input-wrap">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className={confirmPassword && confirmPassword !== password ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="error-text">Passwords do not match.</p>
              )}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Updating password..." : "Reset password"}
            </button>

            <div className="forgot-actions forgot-actions-center">
              <button type="button" className="forgot-text-btn" onClick={() => { setStep(2); setError(""); }}>
                <ArrowLeftIcon /> Back
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="forgot-success">
            <div className="forgot-success-icon"><CheckCircleIcon /></div>
            <p>Your password has been updated successfully.</p>
            <Link to="/login" className="login-btn forgot-success-btn">Back to sign in</Link>
          </div>
        )}

        {step !== 4 && (
          <div className="login-footer">
            Remember your password?
            <Link to="/login">Sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
