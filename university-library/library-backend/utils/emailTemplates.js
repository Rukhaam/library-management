export const generateVerificationOtpEmailTemplate = (verificationCode) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
        <p style="font-size: 16px; color: #555;">Thank you for registering with the University Library. Please use the following One-Time Password (OTP) to verify your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; background-color: #f3f4f6; padding: 10px 20px; border-radius: 5px;">
            ${verificationCode}
          </span>
        </div>
        <p style="font-size: 14px; color: #777;">This code is valid for 15 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">Library Management System | Srinagar</p>
      </div>
    `;
  };
  export const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">You are receiving this email because you requested a password reset for your Library Management System account.</p>
        <p style="font-size: 16px; color: #555;">Please click on the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetPasswordUrl}" style="font-size: 18px; color: #ffffff; background-color: #2563eb; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p style="font-size: 12px; color: #aaa; text-align: center;">This link is valid for exactly 15 minutes.</p>
      </div>
    `;
};