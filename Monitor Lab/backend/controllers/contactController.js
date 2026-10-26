import { sendContactMessage, isSmtpConfigured } from "../utils/mailer.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const COOLDOWN_MS = 20 * 1000;
const recentSubmissions = new Map();

const isRateLimited = (ip) => {
    const now = Date.now();
    const last = recentSubmissions.get(ip);
    if (last && now - last < COOLDOWN_MS) {
        return Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
    }
    recentSubmissions.set(ip, now);

    // Keep the map from growing forever.
    if (recentSubmissions.size > 500) {
        for (const [key, time] of recentSubmissions) {
            if (now - time > COOLDOWN_MS) recentSubmissions.delete(key);
        }
    }
    return 0;
};

// POST /api/contact
export const submitContactMessage = async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const subject = String(req.body.subject || "").trim();
        const message = String(req.body.message || "").trim();

        if (name.length < 2 || name.length > 80) {
            return res.status(400).json({ message: "Please enter your name (2-80 characters)." });
        }
        if (!EMAIL_REGEX.test(email) || email.length > 120) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }
        if (subject.length < 3 || subject.length > 150) {
            return res.status(400).json({ message: "Please enter a subject (3-150 characters)." });
        }
        if (message.length < 10 || message.length > 5000) {
            return res.status(400).json({ message: "Please write a message (10-5000 characters)." });
        }

        const waitSeconds = isRateLimited(req.ip);
        if (waitSeconds) {
            return res.status(429).json({
                message: `Please wait ${waitSeconds}s before sending another message.`,
                retryAfter: waitSeconds,
            });
        }

        if (!isSmtpConfigured()) {
            console.error("[contact] SMTP is not configured. Cannot deliver contact message.");
            return res.status(503).json({
                message: "Our email service is temporarily unavailable. Please email us directly at mentorlab06@gmail.com.",
            });
        }

        const result = await sendContactMessage({ name, email, subject, message });
        if (!result.delivered) {
            return res.status(503).json({
                message: "We could not send your message right now. Please email us directly at mentorlab06@gmail.com.",
            });
        }

        return res.status(200).json({
            message: "Thank you for reaching out! Your message has been sent. We will get back to you soon.",
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return res.status(500).json({
            message: "Something went wrong while sending your message. Please try again or email mentorlab06@gmail.com.",
        });
    }
};
