import sydClass from "../../core/sydClass.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const syd = new sydClass();

export async function registerUser({ full_name, email, password, roles = [] }) {
  // Hash
  const password_hash = await bcrypt.hash(password, 10);

  // Create user via DB procedure
  await syd.operation("SELECT users_manage($1,$2,$3,$4,$5,$6)", [
    "ADD",
    null,
    full_name,
    email,
    password_hash,
    true
  ]);

  // Get user id
  const user = (await syd.search("SELECT id, email FROM users WHERE email=$1", [email]))[0];
  if (!user) throw new Error("User creation failed");

  // Assign roles (if any)
  if (roles.length) {
    const roleRows = await syd.search(
      `SELECT id, name FROM roles WHERE name = ANY($1::text[])`,
      [roles]
    );
    for (const r of roleRows) {
      await syd.operation("SELECT user_roles_manage($1,$2,$3)", ["ASSIGN", user.id, r.id]);
    }
  }
  return { id: user.id, email: user.email };
}

export async function loginUser({ email, password }) {
  const user = (await syd.search(
    "SELECT u.id, u.email, u.password_hash, u.is_active FROM users u WHERE email=$1",
    [email]
  ))[0];
  if (!user) throw new Error("Invalid credentials");
  if (!user.is_active) throw new Error("User inactive");

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");

  // load roles
  const roles = await syd.search(
    `SELECT r.name FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id=$1`,
    [user.id]
  );
  const roleNames = roles.map(r => r.name);

  const token = jwt.sign(
    { id: user.id, email: user.email, roles: roleNames },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

  return { token, user: { id: user.id, email: user.email, roles: roleNames } };
}
