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
export const generateBookReminderTemplate = (userName, bookTitle, dueDate, isOverdue) => {
  const statusColor = isOverdue ? "#dc2626" : "#2563eb"; // Red for overdue, Blue for reminder
  const statusText = isOverdue ? "OVERDUE" : "DUE SOON";

  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #374151;">
      <div style="background-color: ${statusColor}; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">LibSys Library</h1>
      </div>
      
      <div style="padding: 30px; line-height: 1.6;">
          <h2 style="color: ${statusColor}; margin-top: 0;">Hello, ${userName}!</h2>
          <p style="font-size: 16px;">This is a notification regarding a book currently borrowed from your account.</p>
          
          <div style="background-color: #f9fafb; border-left: 4px solid ${statusColor}; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Book Title</p>
              <p style="margin: 5px 0 15px 0; font-size: 18px; font-weight: bold; color: #111827;">${bookTitle}</p>
              
              <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Status</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: ${statusColor};">${statusText}</p>
          </div>

          <p>The book was scheduled to be returned by: <strong style="color: #111827;">${new Date(dueDate).toDateString()}</strong></p>
          
          <p>Please visit the library at your earliest convenience to return the book. Timely returns help ensure that all students have access to the resources they need.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  If you have already returned this book, please ignore this automated message.
              </p>
          </div>
      </div>
  </div>
  `;
};