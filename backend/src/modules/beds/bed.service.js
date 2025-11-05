import sydClass from "../../core/sydClass.js";
const syd = new sydClass();

export const getAllBeds = async () => {
  const result = await syd.search("SELECT * FROM beds ORDER BY b_id ASC");
  return result || result; // Handle both cases
}

export const getBedById = async (id) => {
  const result = await syd.search("SELECT * FROM beds WHERE b_id = $1", [id]);
  return result.rows ? result.rows[0] : result[0]; // Return single object, not array
}

export const createBed = async (bed_serial, type) => {
  const result = await syd.operation(
    "INSERT INTO beds (bed_serial, type, is_available, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
    [bed_serial, type, true, true]
  );
  console.log(result.rows)
  return result.rows ? result.rows[0] : result[0];
}

export const updateBed = async (id, bed_serial, type, is_available) => {
  const result = await syd.operation(
    "UPDATE beds SET bed_serial = $1, type = $2, is_available = $3, updated_at = NOW() WHERE b_id = $4 RETURNING *",
    [bed_serial, type, is_available, id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const deleteBed = async (id) => {
  const result = await syd.operation(
    "DELETE FROM beds WHERE b_id = $1 RETURNING *",
    [id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateBedStatus = async (id, status) => {
  const result = await syd.operation(
    "UPDATE beds SET is_available = $1, updated_at = NOW() WHERE b_id = $2 RETURNING *",
    [status, id]
  );
  return result.rows ? result.rows[0] : result[0]; // Fixed: return single object
}

export const countBeds = async () => {
  const result = await syd.search("SELECT COUNT(*) as total FROM beds");
  // Handle different result structures
  if (result.rows) {
    return { total: parseInt(result.rows[0].total) };
  } else if (Array.isArray(result)) {
    return { total: parseInt(result[0].total) };
  } else {
    return { total: parseInt(result.total) };
  }
}