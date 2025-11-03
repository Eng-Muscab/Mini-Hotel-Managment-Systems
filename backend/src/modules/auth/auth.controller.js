
import { registerUser, loginUser } from "./auth.service.js";

export async function registerController(req, res) {
  try {
    const { full_name, email, password, roles } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "full_name, email, password required" });
    }
    const out = await registerUser({ full_name, email, password, roles });
    res.status(201).json({ message: "Registered", user: out });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const out = await loginUser({ email, password });
    res.json(out);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}

export function meController(req, res) {
  // req.user was set by auth middleware
  res.json({ user: req.user });
}
