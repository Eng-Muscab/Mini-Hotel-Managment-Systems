import { Router } from "express";
import { customerController } from "./cus.controller.js";


const router = Router();


router.get("/", customerController);
router.get("/:id", customerController);
router.post("/", customerController);
router.put("/:id", customerController);
router.delete("/:id", customerController);

export default router;