import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../middleware/errorMiddlewares.js";
import { generateForgotPasswordEmailTemplate } from '../utils/emailTemplates.js';
import { 
    findUserByEmail, 
    generateVerificationCode, 
    getResetPasswordToken, 
    updateResetPasswordToken, 
    findUserByResetToken, 
    updatePassword 
} from '../models/userModels.js';
import { sendVerificationCode } from "../utils/sendVerificationCode.js"; // Ensure this matches your file structure
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

// 1. REGISTER USER
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // Check if user already exists
  const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (existingUser.length > 0) {
    if (existingUser[0].account_verified) {
      return next(new ErrorHandler("User with this email already exists", 400));
    }
    // If user exists but is unverified, delete the old record so they can try again
    await db.query("DELETE FROM users WHERE email = ?", [email]);
  }

  // Generate Verification Code and Expiration (15 mins from now)
  const verificationCode = generateVerificationCode();

  // Format JavaScript Date to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
  const expireTime = new Date(Date.now() + 15 * 60 * 1000);

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user into MySQL with the OTP
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, verification_code, verification_code_expire) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, verificationCode, expireTime]
  );

  // Send the Verification Email
  try {
    await sendVerificationCode(email, verificationCode);

    res.status(201).json({
      success: true,
      message: `Verification code sent to ${email} successfully!`,
      userId: result.insertId,
    });
  } catch (error) {
    // If the email fails to send, remove the user so they can try registering again later
    await db.query("DELETE FROM users WHERE id = ?", [result.insertId]);
    console.error("Email Error: ", error);
    return next(
      new ErrorHandler(
        "Failed to send verification email. Please try again.",
        500
      )
    );
  }
});

// 2. LOGIN USER
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
  }

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // Find user by email
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (users.length === 0) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const user = users[0];

  // Block login if the account hasn't been verified with the OTP yet
  if (!user.account_verified) {
    return next(
      new ErrorHandler("Please verify your account before logging in", 401)
    );
  }

  // Compare entered password with hashed password in DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Send token in a secure HTTP-only cookie
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("token", token, options)
    .json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
});

//  VERIFY OTP
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP are required", 400));
  }

  const [users] = await db.query(
    "SELECT * FROM users WHERE email = ? AND account_verified = FALSE",
    [email]
  );

  if (users.length === 0) {
    return next(
      new ErrorHandler("User not found or account is already verified", 404)
    );
  }

  const user = users[0];
  const expiryTime = new Date(user.verification_code_expire).getTime();
  const currentTime = new Date().getTime();

  if (user.verification_code !== String(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (expiryTime < currentTime) {
    return next(
      new ErrorHandler(
        "OTP has expired. Please register again to get a new code.",
        400
      )
    );
  }

  // Mark user as verified and clear the OTP columns
  await db.query(
    "UPDATE users SET account_verified = TRUE, verification_code = NULL, verification_code_expire = NULL WHERE email = ?",
    [email]
  );
  sendToken(
    user,
    200,
    "Account verified successfully! You are now logged in.",
    res
  );
});
//logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
//  FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    console.log(user);
    
    
    // 1. Check if user exists
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // 2. NEW CHECK: Block password reset if the account is not verified yet!
    if (!user.account_verified) {
        return next(new ErrorHandler("Please verify your account first before resetting your password.", 400));
    }

    // Generate Token
    const { resetToken, hashedToken } = getResetPasswordToken();

    // MySQL DATETIME format for 15 minutes from now
    const expireTime = new Date(Date.now() + 15 * 60 * 1000);

    // Save hashed token to DB
    await updateResetPasswordToken(user.email, hashedToken, expireTime);

    // Create the reset URL (Assuming Frontend runs on port 5173)
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetPasswordUrl = `${frontendURL}/password/reset/${resetToken}`;
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Library Password Recovery",
            html: message,
        });

        res.status(200).json({
            success: true,
            message: `Password reset link sent to ${user.email} successfully!`,
        });
    } catch (error) {
        // Clear token if email fails
        await updateResetPasswordToken(user.email, null, null);
        console.error("Email Error: ", error);
        return next(new ErrorHandler("Email could not be sent. Please try again.", 500));
    }
});
// RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
  
    // 1. Check if both fields are provided
    if (!password || !confirmPassword) {
      return next(new ErrorHandler("Please enter and confirm your new password", 400));
    }
  
    // 2. Check password length (between 8 and 16 characters)
    if (password.length < 8 || password.length > 16) {
      return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }
    if (confirmPassword.length < 8 || confirmPassword.length > 16) {
      return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }
  
    // 3. Check if passwords match
    if (password !== confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }
  
    // Hash the token from the URL to compare it with the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
    const user = await findUserByResetToken(hashedToken);
  
    if (!user) {
      return next(
        new ErrorHandler("Reset Password Token is invalid or has expired", 400)
      );
    }
  
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Update the database
    await updatePassword(user.id, hashedPassword);
  
    // Log the user in automatically with the new password
    sendToken(
      user,
      200,
      "Password reset successfully! You are now logged in.",
      res
    );
  });
// UPDATE PASSWORD (When already logged in)
export const updatePasswordLoggedIn = catchAsyncErrors(
  async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }
    if(password.length < 8 || password.length > 16){
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }
    if(confirmPassword.length < 8 || confirmPassword.length > 16){
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }

    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler("New password and confirm password do not match", 400)
      );
    }

    // req.user comes from isAuthenticated middleware
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    const user = users[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updatePassword(user.id, hashedPassword);

    sendToken(user, 200, "Password updated successfully!", res);
  }
);
