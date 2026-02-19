import db from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
export const createUser = async (name, email, hashedPassword) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, account_verified) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, false]
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
  return Math.floor(100000 + Math.random() * 900000).toString();
};