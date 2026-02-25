import db from "../config/db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
export const createUser = async (
  name,
  email,
  hashedPassword,
  verificationCode,
  expireTime
) => {
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
  return crypto.randomInt(100000, 1000000).toString();
};
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
export const getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
};
export const updateResetPasswordToken = async (
  email,
  hashedToken,
  expireTime
) => {
  return await db.query(
    "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE email = ?",
    [hashedToken, expireTime, email]
  );
};
export const findUserByResetToken = async (hashedToken) => {
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
      `SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.phone, 
          u.role, 
          u.avatar_url, 
          u.created_at AS createdAt,
          -- Count only the records where the book hasn't been returned
          COUNT(CASE WHEN br.return_date IS NULL THEN br.id END) AS borrowedBooksCount,
          -- Sum up the fines only if the status is 'Unpaid'
          COALESCE(SUM(CASE WHEN br.fine_status = 'Unpaid' THEN br.fine ELSE 0 END), 0) AS total_unpaid_fines
       FROM users u 
       -- Join the whole table so we can check both active books and past fines
       LEFT JOIN borrow_records br ON u.id = br.user_id 
       GROUP BY u.id 
       ORDER BY u.created_at DESC`
  );
  return rows;
};
export const checkEmailExists = async (email) => {
  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length > 0;
};
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
};
