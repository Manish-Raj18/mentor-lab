import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css_files/login.css";

const countryCodes = [
  { code: "+1", country: "US", label: "United States (+1)" },
  { code: "+1", country: "CA", label: "Canada (+1)" },
  { code: "+44", country: "GB", label: "United Kingdom (+44)" },
  { code: "+91", country: "IN", label: "India (+91)" },
  { code: "+61", country: "AU", label: "Australia (+61)" },
  { code: "+86", country: "CN", label: "China (+86)" },
  { code: "+81", country: "JP", label: "Japan (+81)" },
  { code: "+49", country: "DE", label: "Germany (+49)" },
  { code: "+33", country: "FR", label: "France (+33)" },
  { code: "+55", country: "BR", label: "Brazil (+55)" },
  { code: "+7", country: "RU", label: "Russia (+7)" },
  { code: "+82", country: "KR", label: "South Korea (+82)" },
  { code: "+39", country: "IT", label: "Italy (+39)" },
  { code: "+34", country: "ES", label: "Spain (+34)" },
  { code: "+31", country: "NL", label: "Netherlands (+31)" },
  { code: "+46", country: "SE", label: "Sweden (+46)" },
  { code: "+47", country: "NO", label: "Norway (+47)" },
  { code: "+48", country: "PL", label: "Poland (+48)" },
  { code: "+90", country: "TR", label: "Turkey (+90)" },
  { code: "+971", country: "AE", label: "UAE (+971)" },
  { code: "+966", country: "SA", label: "Saudi Arabia (+966)" },
  { code: "+65", country: "SG", label: "Singapore (+65)" },
  { code: "+60", country: "MY", label: "Malaysia (+60)" },
  { code: "+66", country: "TH", label: "Thailand (+66)" },
  { code: "+63", country: "PH", label: "Philippines (+63)" },
  { code: "+62", country: "ID", label: "Indonesia (+62)" },
  { code: "+27", country: "ZA", label: "South Africa (+27)" },
  { code: "+234", country: "NG", label: "Nigeria (+234)" },
  { code: "+254", country: "KE", label: "Kenya (+254)" },
  { code: "+92", country: "PK", label: "Pakistan (+92)" },
  { code: "+880", country: "BD", label: "Bangladesh (+880)" },
  { code: "+94", country: "LK", label: "Sri Lanka (+94)" },
  { code: "+977", country: "NP", label: "Nepal (+977)" },
  { code: "+95", country: "MM", label: "Myanmar (+95)" },
  { code: "+855", country: "KH", label: "Cambodia (+855)" },
  { code: "+84", country: "VN", label: "Vietnam (+84)" },
  { code: "+852", country: "HK", label: "Hong Kong (+852)" },
  { code: "+886", country: "TW", label: "Taiwan (+886)" },
  { code: "+52", country: "MX", label: "Mexico (+52)" },
  { code: "+54", country: "AR", label: "Argentina (+54)" },
  { code: "+56", country: "CL", label: "Chile (+56)" },
  { code: "+57", country: "CO", label: "Colombia (+57)" },
  { code: "+51", country: "PE", label: "Peru (+51)" },
  { code: "+20", country: "EG", label: "Egypt (+20)" },
  { code: "+212", country: "MA", label: "Morocco (+212)" },
  { code: "+216", country: "TN", label: "Tunisia (+216)" },
  { code: "+353", country: "IE", label: "Ireland (+353)" },
  { code: "+41", country: "CH", label: "Switzerland (+41)" },
  { code: "+43", country: "AT", label: "Austria (+43)" },
  { code: "+358", country: "FI", label: "Finland (+358)" },
  { code: "+45", country: "DK", label: "Denmark (+45)" },
  { code: "+354", country: "IS", label: "Iceland (+354)" },
  { code: "+351", country: "PT", label: "Portugal (+351)" },
  { code: "+352", country: "LU", label: "Luxembourg (+352)" },
  { code: "+370", country: "LT", label: "Lithuania (+370)" },
  { code: "+371", country: "LV", label: "Latvia (+371)" },
  { code: "+372", country: "EE", label: "Estonia (+372)" },
];

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const passwordChecks = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "Letter", test: (p) => /[a-zA-Z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character", test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p) },
];

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const famousDomains = [
    "gmail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk", "outlook.com",
    "hotmail.com", "live.com", "rediffmail.com", "protonmail.com", "proton.me",
    "icloud.com", "me.com", "aol.com", "mail.com", "zoho.com", "yandex.com",
    "fastmail.com", "gmx.com", "tutanota.com", "gmx.net", "ymail.com",
    "rocketmail.com", "inbox.com", "mail.ru"
  ];

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!re.test(email)) return { valid: false, msg: "Please enter a valid email address" };
    const domain = email.split("@")[1].toLowerCase();
    if (!famousDomains.includes(domain)) return { valid: false, msg: "Please use a well-known email provider (Gmail, Yahoo, Outlook, etc.)" };
    return { valid: true };
  };

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("at least 8 characters");
    if (!/[a-zA-Z]/.test(pwd)) errors.push("at least one letter");
    if (!/[0-9]/.test(pwd)) errors.push("at least one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)) errors.push("at least one special character");
    return errors;
  };

  const countryPhoneLength = (code) => {
    const lengths = {
      "+1": 10, "+44": 10, "+91": 10, "+61": 9, "+86": 11, "+81": 10,
      "+49": 11, "+33": 9, "+55": 11, "+7": 10, "+82": 10, "+39": 10,
      "+34": 9, "+31": 9, "+46": 9, "+47": 8, "+48": 9, "+90": 10,
      "+971": 9, "+966": 9, "+65": 8, "+60": 10, "+66": 9, "+63": 10,
      "+62": 10, "+27": 9, "+234": 10, "+254": 9, "+92": 10, "+880": 10,
      "+94": 9, "+977": 10, "+95": 8, "+855": 9, "+84": 10, "+852": 8,
      "+886": 9, "+52": 10, "+54": 10, "+56": 9, "+57": 10, "+51": 9,
      "+20": 10, "+212": 9, "+216": 8, "+353": 9, "+41": 9, "+43": 10,
      "+358": 9, "+45": 8, "+354": 7, "+351": 9, "+352": 8, "+370": 8,
      "+371": 8, "+372": 7, "+64": 9,
    };
    return lengths[code];
  };

  const validatePhone = (num) => {
    const cleaned = num.replace(/[\s\-()]/g, "");
    if (!/^[0-9]+$/.test(cleaned)) return false;
    const expectedLen = countryPhoneLength(countryCode);
    if (expectedLen) return cleaned.length === expectedLen;
    return cleaned.length >= 6 && cleaned.length <= 15;
  };

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    else if (/[^a-zA-Z\s]/.test(firstName)) newErrors.firstName = "First name must contain only letters";

    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    else if (/[^a-zA-Z\s]/.test(lastName)) newErrors.lastName = "Last name must contain only letters";

    if (middleName.trim() && /[^a-zA-Z\s]/.test(middleName)) newErrors.middleName = "Middle name must contain only letters";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailCheck = validateEmail(email);
      if (!emailCheck.valid) newErrors.email = emailCheck.msg;
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      const expectedLen = countryPhoneLength(countryCode);
      newErrors.phone = expectedLen
        ? `Please enter a valid phone number (${expectedLen} digits for this country)`
        : "Please enter a valid phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const pwdErrors = validatePassword(password);
      if (pwdErrors.length > 0) {
        newErrors.password = `Password must contain ${pwdErrors.join(", ")}`;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreed) {
      newErrors.agree = "Please confirm that the information provided is correct and accept the terms to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fullPhone = `${countryCode}${phone}`;
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: fullPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          _id: data._id,
          isAdmin: data.isAdmin || false
        }));
        window.location.href = "/";
      } else {
        alert(`Signup Failed: ${data.message || "Unknown backend error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Ensure your backend server is running.");
    }
  };

  const strength = passwordChecks.filter((c) => c.test(password)).length;
  const strengthLabel = strength === 0 ? "" : strength <= 2 ? "Weak" : strength === 3 ? "Good" : "Strong";

  const isQrReferral = new URLSearchParams(window.location.search).get("ref") === "qr";

  return (
    <div className="container1">
      <div className="form-box signup-card">
        <div className="login-brand">
          <div className="login-logo">
            <LogoIcon />
          </div>
          <h2>Create Account</h2>
          <p className="login-subtitle">Join Mentor Lab and start your learning journey today</p>
        </div>

        {isQrReferral && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            fontWeight: 700,
            fontSize: "0.85rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}>
            ✓ Joined via QR Code
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="field-row">
            <div className="input-group">
              <label>First Name *</label>
              <div className="input-wrap">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                  className={errors.firstName ? "input-error" : ""}
                />
              </div>
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="input-group">
              <label>Last Name *</label>
              <div className="input-wrap">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                  className={errors.lastName ? "input-error" : ""}
                />
              </div>
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Middle Name</label>
            <div className="input-wrap">
              <span className="input-icon"><UserIcon /></span>
              <input
                type="text"
                placeholder="Enter Middle Name (optional)"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email *</label>
            <div className="input-wrap">
              <span className="input-icon"><EnvelopeIcon /></span>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "input-error" : ""}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Phone Number *</label>
            <div className="phone-row">
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setPhone((prev) => prev.replace(/[\s\-()]/g, "").slice(0, countryPhoneLength(e.target.value) || 15));
                }}
                className="phone-code"
              >
                {countryCodes.map((c, i) => (
                  <option key={i} value={c.code}>{c.label}</option>
                ))}
              </select>
              <div className="input-wrap input-wrap-flex">
                <span className="input-icon"><PhoneIcon /></span>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  maxLength={countryPhoneLength(countryCode) || 15}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s\-()]/g, ""))}
                  className={errors.phone ? "input-error" : ""}
                />
              </div>
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <label>Password *</label>
            <div className="input-wrap">
              <span className="input-icon"><LockIcon /></span>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
            {password && (
              <div className="password-strength">
                <div className="strength-meta">
                  <span className={`strength-label ${strength >= 4 ? "strong" : strength >= 3 ? "good" : strength >= 1 ? "weak" : ""}`}>
                    {strengthLabel && `Password strength: ${strengthLabel}`}
                  </span>
                </div>
                <div className="password-meter">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`meter-segment ${i < strength ? `level-${strength}` : ""}`}
                    />
                  ))}
                </div>
                <div className="strength-checks">
                  {passwordChecks.map((c) => (
                    <span key={c.label} className={`strength-check ${c.test(password) ? "pass" : ""}`}>
                      {c.test(password) ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <div className="input-wrap">
              <span className="input-icon"><LockIcon /></span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "input-error" : ""}
              />
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className={`consent-box ${errors.agree ? "consent-error" : ""}`}>
            <label className="checkbox-label consent-checkbox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I confirm that all the information provided above is correct, and I agree to the
                Mentor Lab <a href="/#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and
                <a href="/#privacy" onClick={(e) => e.preventDefault()}> Privacy Policy</a>.
              </span>
            </label>
            {errors.agree && <span className="error-text">{errors.agree}</span>}
          </div>

          <button className="login-btn" type="submit">
            Create Account
          </button>
        </form>

        <div className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
