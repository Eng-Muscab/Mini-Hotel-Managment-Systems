import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRooms,
  deleteRoom,
} from "./room.service.js";

export const getAllRoomsController = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json(rooms);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getRoomByIdController = async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const createRoomController = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!body.name || !body.type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const room = await createRoom(name, type);
    res.status(201).json(room);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateRoomsController = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const room = await updateRooms(req.params.id, name, type);
    res.status(200).json(room);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const deleteRoomController = async (req, res) => {
  try {
    const room = await deleteRoom(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
