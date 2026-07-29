import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css_files/login.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.isAdmin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/admin");
      } else {
        setError("Access denied. You do not have administrative privileges.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-screen">
      <div className="login-box">
        <h2 style={{ color: "#dc3545" }}>Admin Portal Login</h2>
        <p style={{ fontSize: "0.8rem", marginBottom: "20px", opacity: 0.7 }}>
          Enter administrative credentials to access the command center.
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>ADMIN EMAIL</label>
            <input
              type="email"
              placeholder="Enter Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: "#dc3545", fontSize: "0.85rem", marginBottom: "15px", fontWeight: "bold" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-login" style={{ backgroundColor: "#dc3545" }} disabled={loading}>
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <a href="/login" style={{ fontSize: "0.8rem", color: "var(--text-color)", textDecoration: "none", opacity: 0.6 }}>
            ← Back to Student Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
