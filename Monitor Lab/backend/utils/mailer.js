import nodemailer from "nodemailer";

const APP_NAME = "Mentor Lab";

export const isSmtpConfigured = () => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
    return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
};

const createTransporter = () => {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

// Prevents header injection through user supplied subjects.
const sanitizeHeader = (value) => String(value).replace(/[\r\n]+/g, " ").trim();

// Display names are embedded in mail headers, so strip quote/bracket characters.
const sanitizeDisplayName = (value) =>
    sanitizeHeader(value).replace(/["<>\\]/g, "").trim();

export const sendPasswordResetOtp = async (email, otp) => {
    if (!isSmtpConfigured()) {
        return { delivered: false, reason: "SMTP is not configured" };
    }

    const transporter = createTransporter();
    const minutes = 10;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || `"${APP_NAME}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${APP_NAME} password reset code`,
        text: `Your ${APP_NAME} password reset code is ${otp}. It expires in ${minutes} minutes. If you did not request this, you can safely ignore this email.`,
        html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1f2937;">
                <h2 style="margin: 0 0 12px; color: #0f766e;">Reset your ${APP_NAME} password</h2>
                <p style="margin: 0 0 20px; line-height: 1.6;">
                    Use the verification code below to set a new password. This code expires in ${minutes} minutes.
                </p>
                <div style="font-size: 32px; font-weight: 700; letter-spacing: 10px; text-align: center; padding: 18px; border-radius: 12px; background: #f0fdfa; border: 1px solid #99f6e4; color: #0f766e;">
                    ${otp}
                </div>
                <p style="margin: 20px 0 0; line-height: 1.6; color: #6b7280; font-size: 14px;">
                    If you did not request a password reset, you can safely ignore this email. Your password will not change.
                </p>
            </div>
        `,
    });

    return { delivered: true };
};

/**
 * Delivers a "Contact Us" form submission to the Mentor Lab inbox.
 * The visitor's address is used as Reply-To so support can answer directly.
 */
export const sendContactMessage = async ({ name, email, subject, message }) => {
    if (!isSmtpConfigured()) {
        return { delivered: false, reason: "SMTP is not configured" };
    }

    const transporter = createTransporter();
    const inbox = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
    const safeSubject = sanitizeHeader(subject);

    await transporter.sendMail({
        from: process.env.SMTP_FROM || `"${APP_NAME}" <${process.env.SMTP_USER}>`,
        to: inbox,
        replyTo: `"${sanitizeDisplayName(name)}" <${sanitizeHeader(email)}>`,
        subject: `[Contact Us] ${safeSubject || "New message"}`,
        text: [
            `New message from the ${APP_NAME} contact form`,
            "",
            `Name:    ${name}`,
            `Email:   ${email}`,
            `Subject: ${subject}`,
            "",
            message,
        ].join("\n"),
        html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px 24px; color: #1f2937;">
                <h2 style="margin: 0 0 4px; color: #0f766e;">New contact form message</h2>
                <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px;">
                    Sent from the ${APP_NAME} website contact page.
                </p>
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                    <tr>
                        <td style="padding: 10px 0; width: 90px; color: #6b7280;">Name</td>
                        <td style="padding: 10px 0; font-weight: 600;">${escapeHtml(name)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280;">Email</td>
                        <td style="padding: 10px 0;">
                            <a href="mailto:${escapeHtml(email)}" style="color: #0f766e;">${escapeHtml(email)}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280;">Subject</td>
                        <td style="padding: 10px 0; font-weight: 600;">${escapeHtml(subject)}</td>
                    </tr>
                </table>
                <div style="margin-top: 20px; padding: 18px; border-radius: 12px; background: #f0fdfa; border: 1px solid #99f6e4; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(message)}</div>
                <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px;">
                    Reply to this email to respond directly to ${escapeHtml(name)}.
                </p>
            </div>
        `,
    });

    return { delivered: true };
};
