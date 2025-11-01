import { Router } from "express";
import { getAllRoomsController, getRoomByIdController, createRoomController, updateRoomsController, deleteRoomController } from "./room.controller.js";

const router = Router();


router.get("/", getAllRoomsController);

router.get("/:id", getRoomByIdController);

router.post("/", createRoomController);

router.put("/:id", updateRoomsController);

router.delete("/:id", deleteRoomController);

export default router;