import { Router } from "express";
import { bedController } from "./bed.controller.js";

const router = Router();

router.get("/", bedController);
router.get("/:id", bedController);
router.post("/", bedController);
router.put("/:id", bedController);
router.delete("/:id", bedController);


export default router;