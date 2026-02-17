import db from "../config/db.js";

// 1. Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// 2. Create a new user (Unverified)
export const createUser = async (name, email, hashedPassword) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, account_verified) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, false]
  );
  return result.insertId;
};

// 3. Update user verification status
export const verifyUserAccount = async (email) => {
  return await db.query(
    "UPDATE users SET account_verified = true WHERE email = ?",
    [email]
  );
};

// 4. Delete unverified user (for your automation service)
export const deleteUnverifiedUser = async (email) => {
  return await db.query(
    "DELETE FROM users WHERE email = ? AND account_verified = false",
    [email]
  );
};

// Helper to generate a 6-digit OTP code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};