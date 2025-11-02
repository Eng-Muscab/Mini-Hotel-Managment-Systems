import { Router } from "express";
import { roomController } from "./room.controller.js";

const router = Router();

router.get("/", roomController);
router.get("/:id", roomController);
router.post("/", roomController);
router.put("/:id", roomController);
router.delete("/:id", roomController);

export default router;
