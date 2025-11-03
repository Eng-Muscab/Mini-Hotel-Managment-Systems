import jwt from "jsonwebtoken";

export  function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, roles? }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function roleRequired(...allowed) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const ok = roles.some(r => allowed.includes(r));
    if (!ok) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
