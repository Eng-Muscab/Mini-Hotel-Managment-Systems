import sydClass from "../../core/sydClass.js";
const syd = new sydClass();

export const getAllRooms = async () => {
  const result = await syd.search("SELECT * FROM room ORDER BY r_id ASC");
  return result.rows || result;
}

export const getRoomById = async (id) => {
  const result = await syd.search("SELECT * FROM room WHERE r_id = $1", [id]);
  return result.rows ? result.rows[0] : result[0];
}

export const createRoom = async (name, type) => {
  const result = await syd.operation(
    `INSERT INTO room (name, type, is_active) 
     VALUES ($1, $2, $3) RETURNING *`,
    [name, type, true]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateRoom = async (id, name, type, is_active) => {
  const result = await syd.operation(
    `UPDATE room 
     SET name = $1, type = $2, is_active = $3, updated_at = NOW() 
     WHERE r_id = $4 RETURNING *`,
    [name, type, is_active, id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const deleteRoom = async (id) => {
  const result = await syd.operation(
    "DELETE FROM room WHERE r_id = $1 RETURNING *",
    [id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateRoomStatus = async (id, status) => {
  const result = await syd.operation(
    "UPDATE room SET is_active = $1, updated_at = NOW() WHERE r_id = $2 RETURNING *",
    [status, id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const countRooms = async () => {
  const result = await syd.search("SELECT COUNT(*) as total FROM room");
  if (result.rows) {
    return { total: parseInt(result.rows[0].total) };
  } else if (Array.isArray(result)) {
    return { total: parseInt(result[0].total) };
  } else {
    return { total: parseInt(result.total) };
  }
}