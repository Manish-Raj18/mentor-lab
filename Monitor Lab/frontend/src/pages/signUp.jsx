import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Validation for empty fields
    if (name === "" || phone === "" || email === "" || password === "" || confirmPassword === "") {
      alert("Please fill all fields");
      return;
    }

    // 2. Validation for matching passwords
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // API call to backend server
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
        }),
        });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          name: data.name,
          email: data.email,
          _id: data._id,
          isAdmin: data.isAdmin || false
        }));
      } else {
        alert(`Signup Failed: ${data.message || "Unknown backend error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Ensure your backend server is running.");
    }
  }; // Closes handleSignup safely

  return (
    <div className="container">
      <div className="form-box">
        <h2>Signup</h2>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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