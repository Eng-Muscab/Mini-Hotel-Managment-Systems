import { Router } from "express";
import { roomBedsController } from "./rm.controller.js";


const router = Router();

router.get("/", roomBedsController);
router.get("/:id", roomBedsController);
router.post("/", roomBedsController);
router.put("/:id", roomBedsController);
router.delete("/:id", roomBedsController);


export default router;