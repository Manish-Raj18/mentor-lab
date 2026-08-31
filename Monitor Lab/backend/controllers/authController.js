import User from "../model/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

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

const famousDomains = [
    "gmail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk", "outlook.com",
    "hotmail.com", "live.com", "rediffmail.com", "protonmail.com", "proton.me",
    "icloud.com", "me.com", "aol.com", "mail.com", "zoho.com", "yandex.com",
    "fastmail.com", "gmx.com", "tutanota.com", "gmx.net", "ymail.com",
    "rocketmail.com", "inbox.com", "mail.ru"
];

// 1. REGISTER NEW USER
export const register = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password, phone } = req.body;

        const nameOnlyRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
        if (firstName !== undefined && (!firstName.trim() || !nameOnlyRegex.test(firstName.trim()))) {
            return res.status(400).json({ message: "First name must contain only letters" });
        }
        if (lastName !== undefined && (!lastName.trim() || !nameOnlyRegex.test(lastName.trim()))) {
            return res.status(400).json({ message: "Last name must contain only letters" });
        }
        if (middleName && middleName.trim() && !nameOnlyRegex.test(middleName.trim())) {
            return res.status(400).json({ message: "Middle name must contain only letters" });
        }

        if (phone) {
            const match = phone.match(/^(\+\d+)(\d+)$/);
            const code = match ? match[1] : "";
            const number = match ? match[2] : phone;
            const expectedLen = countryPhoneLength(code);
            if (!/^[0-9]+$/.test(number) || (expectedLen && number.length !== expectedLen)) {
                return res.status(400).json({ message: `Please enter a valid phone number (${expectedLen ? expectedLen + " digits for this country" : "for this country"})` });
            }
        }

        const domain = email?.split("@")[1]?.toLowerCase();
        if (!domain || !famousDomains.includes(domain)) {
            return res.status(400).json({ message: "Please use a well-known email provider (Gmail, Yahoo, Outlook, etc.)" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

        const newUser = await User.create({
            firstName,
            middleName: middleName || "",
            lastName,
            name: fullName,
            email,
            phone: phone || "",
            password: hashedPassword,
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
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

        const { title, score, resultId } = req.body;
        
        user.recentActivity.push({
            title,
            date: new Date(),
            score,
            resultId: resultId || null,
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
