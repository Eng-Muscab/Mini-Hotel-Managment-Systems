import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, roles }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
