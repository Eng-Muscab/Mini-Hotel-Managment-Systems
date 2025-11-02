import sydClass from "../../core/sydClass.js";
const syd = new sydClass();

// Get all bookings
export const getAllBookings = async () => {
  return await syd.search("SELECT * FROM booking ORDER BY b_id ASC");
}

// Get booking by ID
export const getBookingById = async (id) => {
  const result = await syd.search("SELECT * FROM booking WHERE b_id = $1", [id]);
  return result[0] || null;
}

// manage bookings
export const manageBookings = async (action, id = null, c_id = null, rb_id = null, amount = null, state = null, start_date = null, end_date = null) => {
  return await syd.operation("SELECT booking_manage($1, $2, $3, $4l, $5, $6, $7, $8)", [action, id, c_id, rb_id, amount, state, start_date, end_date]);
}
