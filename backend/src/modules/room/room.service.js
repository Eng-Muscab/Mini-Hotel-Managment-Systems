import sydClass from "../../core/sydClass.js";
const syd = new sydClass();

// Get all rooms
export const getAllRooms = async () => {
  return await syd.search("SELECT * FROM room ORDER BY r_id ASC");
};

// Get room by ID
export const getRoomById = async (id) => {
  const result = await syd.search("SELECT * FROM room WHERE r_id = $1", [id]);
  return result[0] || null;
};

// manage rooms
export const manageRooms = async (
  action,
  id = null,
  name = null,
  type = null
) => {
  return await syd.operation("SELECT room_manage($1, $2, $3, $4)", [
    action,
    id,
    name,
    type,
  ]);
};
