import User from "../model/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// 1. REGISTER NEW USER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password safely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user using the hashed password
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, // 👈 Ensures the password saves securely
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token: generateToken(newUser._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// 2. LOGIN EXISTING USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Force Mongoose to fetch the password field despite 'select: false'
        const user = await User.findOne({ email }).select("+password"); 
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate password input against database string
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // If credentials match, return profile data and security token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// 3. GET USER PROFILE
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 4. UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.studentId = req.body.studentId || user.studentId;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 5. ADD ACTIVITY
export const addActivity = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { title, score } = req.body;
        
        user.recentActivity.push({
            title,
            date: new Date(),
            score
        });

        // Simple stats update logic
        user.performanceStats.testsTaken += 1;
        user.markModified('performanceStats'); // Explicitly mark as modified
        
        await user.save();
        res.status(200).json({ message: "Activity added" });
    } catch (error) {
        console.error("Add activity error:", error);
        res.status(500).json({ message: "Server error" });
    }
};