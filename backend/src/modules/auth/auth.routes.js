import { Router } from "express";
import { registerController, loginController, meController } from "./auth.controller.js";
import { authRequired } from "../../middleware/auth.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authRequired, meController);

export default router;
