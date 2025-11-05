import * as bookingService from './booking.service.js';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ 
      success: true, 
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: "Booking not found" 
      });
    }
    
    res.json({ 
      success: true, 
      data: booking 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { c_id, rb_id, amount, state, start_date, end_date } = req.body;
    
    if (!c_id || !amount || !start_date || !end_date) {
      return res.status(400).json({ 
        success: false, 
        error: "Customer ID, amount, start date, and end date are required" 
      });
    }
    
    const booking = await bookingService.createBooking(
      c_id, 
      rb_id, 
      amount, 
      state || 'PENDING',  // Default to PENDING instead of 'confirmed'
      start_date, 
      end_date
    );
    
    res.status(201).json({ 
      success: true, 
      data: booking,
      message: "Booking created successfully"
    });
  } catch (error) {
    if (error.message.includes('does not exist') || error.message.includes('Invalid booking state')) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { c_id, rb_id, amount, state, start_date, end_date } = req.body;
    
    const booking = await bookingService.updateBooking(
      id,
      c_id, 
      rb_id, 
      amount, 
      state, 
      start_date, 
      end_date
    );
    
    res.json({ 
      success: true, 
      data: booking,
      message: "Booking updated successfully"
    });
  } catch (error) {
    if (error.message.includes('does not exist') || error.message.includes('Invalid booking state') || error.message.includes('not found')) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.deleteBooking(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: "Booking not found" 
      });
    }
    
    res.json({ 
      success: true, 
      data: booking,
      message: "Booking deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    
    if (!state) {
      return res.status(400).json({ 
        success: false, 
        error: "State is required" 
      });
    }
    
    const booking = await bookingService.updateBookingStatus(id, state);
    
    res.json({ 
      success: true, 
      data: booking,
      message: `Booking status updated to ${state}`
    });
  } catch (error) {
    if (error.message.includes('Invalid booking state') || error.message.includes('not found')) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const countBookings = async (req, res) => {
  try {
    const result = await bookingService.countBookings();
    
    res.json({ 
      success: true, 
      count: result.total,
      message: `Total bookings: ${result.total}`,
      data: result
    });
  } catch (error) {
    console.error('Count bookings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to count bookings',
      details: error.message 
    });
  }
};