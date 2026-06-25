import React, { useState } from "react";
import "../css_files/login.css"
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
    // 1. Form state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2. Form submission handler marked as async
    const handleLogin = async (e) => {
        e.preventDefault();
        // Basic frontend validation
        if (email === "" || password === "") {
            alert("Please fill all fields");
            return;
        }
            // Basic frontend validation
if (email.trim() === "" || password.trim() === "") {
    alert("Please fill all fields");
    return;
}

// 1. Email Format Validation (Regex)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
}

// 2. Password Strength Validation (e.g., minimum 6 characters)
if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
}

        try {
            // Send the POST request to your Node.js backend port 5000
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email: email,
                password: password,
            });

            // If successful, alert the user and store the token
            alert("Login Successful");
            console.log("User Data from Server:", response.data);
            
            // Clear old data to prevent stale state issues
            localStorage.clear();
            
            localStorage.setItem("token", response.data.token);
            // We no longer need to store the user object in localStorage
            // as the Profile page now fetches it directly from the backend.

        } catch (error) {
            // Catch and display any errors from the backend
            console.error("login error:", error);
            alert(error.response?.data?.message || "something went wrong");
        }
    };

    // 3. The JSX UI Layout
    return (
        <div className="container1">
            <div className="form-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter Email" 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter Password" 
                        />
                    </div>
                    
                    <button type="submit">Login</button>
                </form>

                {/* Match your exact layout from the image for the signup section */}
                <div className="link">
                    Don't have account?
                    <Link to="/signup" className="link">
                        Signup
                 <div className="Forgot-password-box">
                        <a herf="/Forgot-password" className="Forgot-link"> Forgot Password </a>
                 </div> 
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

