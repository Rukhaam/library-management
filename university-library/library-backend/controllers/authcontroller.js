import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import { ErrorHandler } from '../middleware/errorMiddlewares.js';
import { sendVerificationCode } from '../utils/sendVerificationCode.js';

// 1. REGISTER USER
// Handles initial account creation and triggers OTP email
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    // Check if user already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user as 'unverified' in MySQL
    const [result] = await db.query(
        'INSERT INTO users (name, email, password, account_verified) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, false]
    );

    // Generate OTP, store in Redis for 15 mins, and send email
    await sendVerificationCode(email, next);

    res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email for the verification code.',
    });
});

// 2. VERIFY OTP [cite: 2]
// Validates the code from Redis and marks the MySQL account as verified [cite: 2]
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Please provide email and OTP", 400));
    }

    // Retrieve the temporary code from Redis
    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp) {
        return next(new ErrorHandler("OTP expired or invalid", 400));
    }

    if (storedOtp !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400));
    }

    // Update MySQL record to active status [cite: 2]
    await db.query("UPDATE users SET account_verified = true WHERE email = ?", [email]);

    // Delete OTP from Redis after successful use
    await redisClient.del(`otp:${email}`);

    res.status(200).json({
        success: true,
        message: "Account verified successfully! You can now log in.",
    });
});

// 3. LOGIN USER [cite: 2]
// Checks credentials and ensures the account is verified before issuing a JWT [cite: 2]
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    // Find user in MySQL
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const user = users[0];

    // Check if account is verified [cite: 2]
    if (!user.account_verified) {
        return next(new ErrorHandler("Please verify your email before logging in", 401));
    }

    // Verify hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Create secure JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // Security: Prevents XSS attacks
    };

    res.status(200).cookie("token", token, options).json({
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});