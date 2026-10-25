import nodemailer from "nodemailer";

const isSmtpConfigured = () => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
    return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
};

export const sendPasswordResetOtp = async (email, otp) => {
    if (!isSmtpConfigured()) {
        return { delivered: false, reason: "SMTP is not configured" };
    }

    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const appName = "Mentor Lab";
    const minutes = 10;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || `"${appName}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${appName} password reset code`,
        text: `Your ${appName} password reset code is ${otp}. It expires in ${minutes} minutes. If you did not request this, you can safely ignore this email.`,
        html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1f2937;">
                <h2 style="margin: 0 0 12px; color: #0f766e;">Reset your ${appName} password</h2>
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
