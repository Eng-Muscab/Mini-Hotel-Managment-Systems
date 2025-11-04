import pool from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async ({ full_name, email, password }) => {
  // Check if email exists
  const existing = await pool.query(
    `SELECT id FROM public.users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hash = await bcrypt.hash(password, 10);

  // Call stored procedure
  await pool.query(
    `SELECT public.users_manage($1,$2,$3,$4,$5,$6)`,
    ["ADD", null, full_name, email, hash, true]
  );

  return { full_name, email };
};

export const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT id, full_name, email, password_hash, is_active 
     FROM public.users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error("User is inactive");
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user.id, full_name: user.full_name, email: user.email } };
};
