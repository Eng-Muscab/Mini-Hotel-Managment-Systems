import { Router } from "express";
import { bookingController } from "./booking.controller.js";

const router = Router();

router.get("/", bookingController);
router.get("/:id", bookingController);
router.post("/", bookingController);
router.put("/:id", bookingController);
router.delete("/:id", bookingController);

export default router;
