import { registerUser, loginUser } from "./auth.service.js";

export const registerController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, message: "User registered successfully", user });
    console.log(user)
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    console.error(err);
  }
};

export const loginController = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({ success: true, message: "Logged in", ...data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
