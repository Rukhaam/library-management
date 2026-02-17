import redisClient from "../config/redis.js";
import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { generateVerificationCode } from "../models/userModels.js";
import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../middleware/errorMiddlewares.js";

export const sendVerificationCode = catchAsyncErrors(async (email, next) => {
    // 1. Generate a 6-digit OTP
    const otp = generateVerificationCode();
    try {
        await redisClient.setEx(`otp:${email}`, 900, otp);
    } catch (error) {
        return next(new ErrorHandler("Redis Storage Error", 500));
    }

    // 3. Generate the Email Template
    const htmlContent = generateVerificationOtpEmailTemplate(otp);

    // 4. Send the Email
    try {
        await sendEmail({
            email,
            subject: "Verify Your Library Account",
            html: htmlContent,
        });
    } catch (error) {
        // If email fails, remove the OTP from Redis
        await redisClient.del(`otp:${email}`);
        return next(new ErrorHandler("Email could not be sent", 500));
    }
});