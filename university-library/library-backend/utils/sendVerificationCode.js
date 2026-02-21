import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";

export const sendVerificationCode = async (email, verificationCode) => {
    try {
        // 1. Generate the HTML template with the OTP
        const message = generateVerificationOtpEmailTemplate(verificationCode);
        
        // 2. Send the email using your existing sendEmail utility
        await sendEmail({
            email: email, // Receiver's email
            subject: "Verify Your Account - Library Management System",
            html: message // The generated HTML body
        });

        console.log(`Verification email successfully sent to ${email}`);
    } catch (error) {
        console.error("Error in sendVerificationCode:", error);
        throw new Error("Failed to send verification email");
    }
};