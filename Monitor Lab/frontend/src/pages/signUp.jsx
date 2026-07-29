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

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!re.test(email)) return false;
    const parts = email.split("@");
    if (parts.length !== 2) return false;
    const domain = parts[1];
    if (!domain.includes(".")) return false;
    const tld = domain.split(".").pop();
    if (tld.length < 2) return false;
    return true;
  };

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("at least 8 characters");
    if (!/[a-zA-Z]/.test(pwd)) errors.push("at least one letter");
    if (!/[0-9]/.test(pwd)) errors.push("at least one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)) errors.push("at least one special character");
    return errors;
  };

  const validatePhone = (num) => {
    const cleaned = num.replace(/[\s\-()]/g, "");
    return /^[0-9]{6,15}$/.test(cleaned);
  };

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number (6-15 digits)";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fullPhone = `${countryCode}${phone}`;
      const response = await fetch("http://localhost:5000/api/auth/signup", {
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

  return (
    <div className="container1">
      <div className="form-box">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>First Name *</label>
            <input
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={errors.firstName ? { borderColor: "#dc3545" } : {}}
            />
            {errors.firstName && <span style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.firstName}</span>}
          </div>

          <div className="input-group">
            <label>Middle Name</label>
            <input
              type="text"
              placeholder="Enter Middle Name (optional)"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Last Name *</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={errors.lastName ? { borderColor: "#dc3545" } : {}}
            />
            {errors.lastName && <span style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.lastName}</span>}
          </div>

          <div className="input-group">
            <label>Email *</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={errors.email ? { borderColor: "#dc3545" } : {}}
            />
            {errors.email && <span style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Phone Number *</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  width: "140px", flexShrink: 0, padding: "12px",
                  border: "1px solid var(--border-color)", borderRadius: "6px",
                  backgroundColor: "var(--input-bg)", color: "var(--input-text)",
                  fontSize: "14px", outline: "none"
                }}
              >
                {countryCodes.map((c, i) => (
                  <option key={i} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s\-()]/g, ""))}
                style={{ flex: 1, ...(errors.phone ? { borderColor: "#dc3545" } : {}) }}
              />
            </div>
            {errors.phone && <span style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.phone}</span>}
          </div>

          <div className="input-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={errors.password ? { borderColor: "#dc3545" } : {}}
            />
            {errors.password && <span style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.password}</span>}
            {password && (
              <div style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-color)", opacity: 0.7 }}>
                <span style={{ color: password.length >= 8 ? "#28a745" : "#dc3545" }}>8+ chars </span>
                <span style={{ color: /[a-zA-Z]/.test(password) ? "#28a745" : "#dc3545" }}>letters </span>
                <span style={{ color: /[0-9]/.test(password) ? "#28a745" : "#dc3545" }}>numbers </span>
                <span style={{ color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) ? "#28a745" : "#dc3545" }}>special </span>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={errors.confirmPassword ? { borderColor: "#dc3545" } : {}}
            />
            {errors.confirmPassword && <span style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.confirmPassword}</span>}
          </div>

          <button className="btn" type="submit">
            Signup
          </button>
        </form>

        <div className="link">
          Already have account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
