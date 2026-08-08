import React, { useState } from "react";
import "../css_files/login.css"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

function Login() {
    // 1. Form state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 2. Form submission handler marked as async
    const handleLogin = async (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            alert("Please fill all fields");
            return;
        }

        // 1. Email Format & Domain Validation
        const famousDomains = [
            "gmail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk", "outlook.com",
            "hotmail.com", "live.com", "rediffmail.com", "protonmail.com", "proton.me",
            "icloud.com", "me.com", "aol.com", "mail.com", "zoho.com", "yandex.com",
            "fastmail.com", "gmx.com", "tutanota.com", "gmx.net", "ymail.com",
            "rocketmail.com", "inbox.com", "mail.ru"
        ];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        const domain = email.split("@")[1].toLowerCase();
        if (!famousDomains.includes(domain)) {
            alert("Please use a well-known email provider (Gmail, Yahoo, Outlook, etc.)");
            return;
        }

        // 2. Password Strength Validation (minimum 6 characters)
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            // Send the POST request to your Node.js backend port 5000
            const response = await axios.post("/api/auth/login", {
                email: email,
                password: password,
            });

            // If successful, alert the user and store the token
            alert("Login Successful");
            console.log("User Data from Server:", response.data);

            // Clear old data to prevent stale state issues
            localStorage.clear();

            localStorage.setItem("token", response.data.token);

            window.location.href = "/";

        } catch (error) {
            // Catch and display any errors from the backend
            console.error("login error:", error);
            alert(error.response?.data?.message || "something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // 3. The JSX UI Layout
    return (
        <div className="container1">
            <div className="auth-shell">
                <div className="auth-visual">
                    <img src="/midnight-study-session-stockcake.jpg" alt="Student studying late at night" className="auth-visual-img" />
                    <div className="auth-visual-overlay" />
                    <div className="auth-visual-content">
                        <div className="auth-visual-brand">
                            <div className="login-logo">
                                <LogoIcon />
                            </div>
                            <span>MENTOR LAB</span>
                        </div>
                        <div className="auth-visual-copy">
                            <h3>Learn smarter. Score higher.</h3>
                            <p>Everything you need for BCA, BBA &amp; Biotechnology — mock tests, lectures, notes and analytics in one place.</p>
                        </div>
                        <ul className="auth-visual-points">
                            <li><span className="pt-check">✓</span> Practice with full-length mock tests</li>
                            <li><span className="pt-check">✓</span> Learn from top educators</li>
                            <li><span className="pt-check">✓</span> Access curated study notes</li>
                            <li><span className="pt-check">✓</span> Track performance analytics</li>
                        </ul>
                    </div>
                </div>

                <div className="auth-panel">
                    <div className="form-box login-card">
                        <div className="login-brand">
                    <div className="login-logo">
                        <LogoIcon />
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="login-subtitle">Sign in to your Mentor Lab account to continue learning</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrap">
                            <span className="input-icon"><EnvelopeIcon /></span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrap">
                            <span className="input-icon"><LockIcon /></span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Hide password" : "Show password"}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="login-footer">
                    Don't have an account?
                    <Link to="/signup">Sign up</Link>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
