import SydClass from '../../core/sydClass.js';

const syd = new SydClass();

// get all rooms
export const getAllRooms = async () => await syd.search("SELECT * FROM room ORDER BY r_id ASC");

// get room by id
export const getRoomById = async (id) => await syd.search("SELECT * FROM room WHERE r_id = $1", [id]);

export const createRoom = async (name, type) => {
    try {
        await syd.operation("INSERT INTO room (name, type) VALUES ($1, $2)", [name, type]);
    } catch (err) {
        console.error("SQL Error:", err.message);
    }
}

export const updateRooms = async (id, name, type) => {
    try {
        await syd.operation("UPDATE room SET name = $1, type = $2 WHERE r_id = $3", [name, type, id]);
    } catch (err) {
        console.error("SQL Error:", err.message);
    }
}

export const deleteRoom = async (id) => {
    try {
        await syd.operation("DELETE FROM room WHERE r_id = $1", [id]);
    } catch (err) {
        console.error("SQL Error:", err.message);
    }
}
