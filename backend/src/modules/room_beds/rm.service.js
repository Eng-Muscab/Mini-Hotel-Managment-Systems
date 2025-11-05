import sydClass from "../../core/sydClass.js";

const syd = new sydClass();

export const getAllRoomBeds = async () => {
  return await syd.search("SELECT * FROM room_bed ORDER BY rb_id ASC");
};

export const getRoomBedsById = async (id) => {
  const result = await syd.search("SELECT * FROM room_bed WHERE rb_id = $1", [
    id,
  ]);
  return result[0] || null;
};

export const getRoomBedsByRoomId = async (room_id) => {
  const result = await syd.search("SELECT * FROM room_bed WHERE room_id = $1", [
    room_id,
  ]);
  return result[0] || null;
};



export const manageRoomBeds = async (action, id = null, room_id = null, bed_id = null, amount = null, state = null, iswifi = null, isac = null, istv = null) => {
  return await syd.operation("SELECT room_beds_manage($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
    action,
    id,
    room_id,
    bed_id,
    amount,
    state,
    iswifi,
    isac,
    istv
  ]);
};