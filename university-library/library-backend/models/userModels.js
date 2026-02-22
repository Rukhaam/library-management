import db from "../config/db.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
export const createUser = async (name, email, hashedPassword, verificationCode, expireTime) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, account_verified, verification_code, verification_code_expire) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, hashedPassword, false, verificationCode, expireTime]
  );
  return result.insertId;
};

export const verifyUserAccount = async (email) => {
  return await db.query(
    "UPDATE users SET account_verified = true WHERE email = ?",
    [email]
  );
};

export const deleteUnverifiedUser = async (email) => {
  return await db.query(
    "DELETE FROM users WHERE email = ? AND account_verified = false",
    [email]
  );
};

export const generateVerificationCode = () => {
  // crypto.randomInt(min, max) generates a cryptographically secure 
  // random integer between min (inclusive) and max (exclusive).
  return crypto.randomInt(100000, 1000000).toString();
};
export const generateToken = (user) => {
  return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES  } 
  );
};
export const getResetPasswordToken = () => {
  // Generate a random 20-character hex string
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token using SHA-256 to store it securely in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
};
export const updateResetPasswordToken = async (email, hashedToken, expireTime) => {
  return await db.query(
      "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE email = ?",
      [hashedToken, expireTime, email]
  );
};
export const findUserByResetToken = async (hashedToken) => {
  // Removed the NOW() check from SQL
  const [rows] = await db.query(
      "SELECT * FROM users WHERE reset_password_token = ?",
      [hashedToken]
  );
  return rows[0];
};
export const updatePassword = async (userId, hashedPassword) => {
  return await db.query(
      "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
      [hashedPassword, userId]
  );
};
export const getAllUsersModel = async () => {
  const [rows] = await db.query(
      // Look at the AS createdAt part below 👇
      'SELECT id, name, email, phone, role, avatar_url, created_at AS createdAt FROM users ORDER BY created_at DESC'
  );
  return rows;
};

// Check if email exists (reusable)
export const checkEmailExists = async (email) => {
  const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  return rows.length > 0;
};

// Register a new admin
export const registerAdminModel = async (adminData) => {
  const { name, email, phone, hashedPassword, avatar_url } = adminData;
  
  const [result] = await db.query(
      'INSERT INTO users (name, email, phone, password, role, avatar_url) VALUES (?, ?, ?, ?, "admin", ?)',
      [name, email, phone, hashedPassword, avatar_url]
  );
  return result.insertId;
};
export const promoteUserToAdminModel = async (userId) => {
  const [result] = await db.query(
    "UPDATE users SET role = 'admin' WHERE id = ?",
    [userId]
  );
  return result;
}