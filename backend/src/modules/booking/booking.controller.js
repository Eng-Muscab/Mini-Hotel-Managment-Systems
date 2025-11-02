import {
  getAllBookings,
  getBookingById,
  manageBookings,
} from "./booking.service.js";

export const bookingController = async (req, res) => {
  const { id } = req.params;

  try {
    switch (req.method) {
      case "GET":
        if (id) {
          const booking = await getBookingById(id);
          return booking
            ? res.status(200).json(booking)
            : res.status(404).json({ message: "Booking not found" });
        }
        const bookings = await getAllBookings();
        return res.status(200).json(bookings);

      case "POST":
        const { c_id, rb_id, amount, state, start_date, end_date } = req.body;
        if (!c_id || !rb_id || !amount || !state || !start_date || !end_date) {
          return res.status(400).json({ error: "All fields are required" });
        }
        const createRes = await manageBookings(
          "CREATE",
          null,
          c_id,
          rb_id,
          amount,
          state,
          start_date,
          end_date
        );
        return res.status(201).json(createRes);

      case "PUT":
        if (!id) {
          return res.status(400).json({ error: "Booking ID required" });
        }
        const {
          c_id: uCid,
          rb_id: uRbId,
          amount: uAmount,
          state: uState,
          start_date: uStartDate,
          end_date: uEndDate,
        } = req.body;
        const updateRes = await manageBookings(
          "UPDATE",
          id,
          uCid,
          uRbId,
          uAmount,
          uState,
          uStartDate,
          uEndDate
        );
        return res.status(200).json(updateRes);

      case "DELETE":
        if (!id) {
          return res.status(400).json({ error: "Booking ID required" });
        }
        const deleteRes = await manageBookings("DELETE", id);
        return res.status(200).json(deleteRes);
    }
  } catch (err) {
    console.error("SQL Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
