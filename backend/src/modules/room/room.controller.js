import {
  getAllRooms,
  getRoomById,
  manageRooms,
} from "./room.service.js";

export const roomController = async (req, res) => {
  const { id } = req.params;

  try {
    switch (req.method) {
      case "GET":
        if (id) {
          const room = await getRoomById(id);
          return room
            ? res.status(200).json(room)
            : res.status(404).json({ message: "Room not found" });
        }
        const rooms = await getAllRooms();
        return res.status(200).json(rooms);

      case "POST":
        const { name, type } = req.body;
        if (!name || !type) {
          return res.status(400).json({ error: "Name and type are required" });
        }
        const createRes = await manageRooms("CREATE", null, name, type);
        return res.status(201).json(createRes);

      case "PUT":
        if (!id) return res.status(400).json({ error: "Room ID required" });

        const { name: uName, type: uType } = req.body;
        const updateRes = await manageRooms("UPDATE", id, uName, uType);
        return res.status(200).json(updateRes);

      case "DELETE":
        if (!id) return res.status(400).json({ error: "Room ID required" });

        const delRes = await manageRooms("DELETE", id);
        return res.status(200).json(delRes);

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("SQL Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
