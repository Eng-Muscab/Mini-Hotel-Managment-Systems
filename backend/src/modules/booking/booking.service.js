import sydClass from "../../core/sydClass.js";
const syd = new sydClass();

// Helper function to check if room_bed exists
const checkRoomBedExists = async (rb_id) => {
  if (!rb_id) return true;
  
  const rbIdInt = parseInt(rb_id);
  if (isNaN(rbIdInt)) return false;
  
  const result = await syd.search(
    "SELECT rb_id FROM room_bed WHERE rb_id = $1",
    [rbIdInt]
  );
  return (result.rows ? result.rows.length > 0 : result.length > 0);
};

// Helper function to check if customer exists
const checkCustomerExists = async (c_id) => {
  const cIdInt = parseInt(c_id);
  if (isNaN(cIdInt)) return false;
  
  const result = await syd.search(
    "SELECT c_id FROM customer WHERE c_id = $1",
    [cIdInt]
  );
  return (result.rows ? result.rows.length > 0 : result.length > 0);
};

export const getAllBookings = async () => {
  const result = await syd.search(`
    SELECT 
      b.b_id,
      b.c_id,
      b.rb_id,
      b.amount,
      b.state,
      b.start_date,
      b.end_date,
      b.reg_date,
      b.updated_at,
      c.name as customer_name,
      c.phone as customer_phone,
      c.refrece as customer_company,
      rb.room_id,
      r.name as room_name,
      r.type as room_type
    FROM booking b
    LEFT JOIN customer c ON b.c_id = c.c_id
    LEFT JOIN room_bed rb ON b.rb_id = rb.rb_id
    LEFT JOIN room r ON rb.room_id = r.r_id
    ORDER BY b.reg_date DESC
  `);
  return result.rows || result;
}

export const getBookingById = async (id) => {
  const idInt = parseInt(id);
  if (isNaN(idInt)) throw new Error(`Invalid booking ID: ${id}`);

  const result = await syd.search(`
    SELECT 
      b.b_id,
      b.c_id,
      b.rb_id,
      b.amount,
      b.state,
      b.start_date,
      b.end_date,
      b.reg_date,
      b.updated_at,
      c.name as customer_name,
      c.phone as customer_phone,
      c.refrece as customer_company,
      rb.room_id,
      r.name as room_name,
      r.type as room_type
    FROM booking b
    LEFT JOIN customer c ON b.c_id = c.c_id
    LEFT JOIN room_bed rb ON b.rb_id = rb.rb_id
    LEFT JOIN room r ON rb.room_id = r.r_id
    WHERE b.b_id = $1
  `, [idInt]);
  return result.rows ? result.rows[0] : result[0];
}

export const createBooking = async (c_id, rb_id, amount, state, start_date, end_date) => {
  // Validate and convert c_id
  const cIdInt = parseInt(c_id);
  if (isNaN(cIdInt)) {
    throw new Error(`Invalid customer ID: ${c_id}. Must be a number.`);
  }

  // Validate customer exists
  const customerExists = await checkCustomerExists(cIdInt);
  if (!customerExists) {
    throw new Error(`Customer with ID ${cIdInt} does not exist`);
  }

  // Handle rb_id
  let rbIdInt = null;
  if (rb_id !== null && rb_id !== undefined && rb_id !== '') {
    rbIdInt = parseInt(rb_id);
    if (isNaN(rbIdInt)) {
      throw new Error(`Invalid room bed ID: ${rb_id}. Must be a number.`);
    }

    const roomBedExists = await checkRoomBedExists(rbIdInt);
    if (!roomBedExists) {
      throw new Error(`Room bed with ID ${rbIdInt} does not exist`);
    }
  }

  // Validate state
  const validStates = ['PENDING', 'BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW'];
  let bookingState = state || 'PENDING';
  
  if (bookingState && bookingState.toLowerCase() === 'confirmed') {
    bookingState = 'BOOKED';
  }
  
  if (!validStates.includes(bookingState)) {
    throw new Error(`Invalid booking state: ${state}. Must be one of: ${validStates.join(', ')}`);
  }

  // Create booking with correct columns
  const result = await syd.operation(
    `INSERT INTO booking (c_id, rb_id, amount, state, start_date, end_date, reg_date) 
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [cIdInt, rbIdInt, amount, bookingState, start_date, end_date]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateBooking = async (id, c_id, rb_id, amount, state, start_date, end_date) => {
  const bookingIdInt = parseInt(id);
  if (isNaN(bookingIdInt)) {
    throw new Error(`Invalid booking ID: ${id}`);
  }

  // Handle rb_id
  let rbIdInt = null;
  if (rb_id !== null && rb_id !== undefined && rb_id !== '') {
    rbIdInt = parseInt(rb_id);
    if (isNaN(rbIdInt)) {
      throw new Error(`Invalid room bed ID: ${rb_id}. Must be a number.`);
    }

    const roomBedExists = await checkRoomBedExists(rbIdInt);
    if (!roomBedExists) {
      throw new Error(`Room bed with ID ${rbIdInt} does not exist`);
    }
  }

  // Handle c_id
  let cIdInt = null;
  if (c_id !== null && c_id !== undefined && c_id !== '') {
    cIdInt = parseInt(c_id);
    if (isNaN(cIdInt)) {
      throw new Error(`Invalid customer ID: ${c_id}. Must be a number.`);
    }
  }

  // Validate state
  if (state) {
    const validStates = ['PENDING', 'BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW'];
    let bookingState = state;
    
    if (bookingState.toLowerCase() === 'confirmed') {
      bookingState = 'BOOKED';
    }
    
    if (!validStates.includes(bookingState)) {
      throw new Error(`Invalid booking state: ${state}. Must be one of: ${validStates.join(', ')}`);
    }
    
    state = bookingState;
  }

  const result = await syd.operation(
    `UPDATE booking 
     SET c_id = COALESCE($1, c_id), 
         rb_id = COALESCE($2, rb_id), 
         amount = COALESCE($3, amount), 
         state = COALESCE($4, state), 
         start_date = COALESCE($5, start_date), 
         end_date = COALESCE($6, end_date), 
         updated_at = NOW() 
     WHERE b_id = $7 RETURNING *`,
    [cIdInt, rbIdInt, amount, state, start_date, end_date, bookingIdInt]
  );
  
  if (!result.rows || (result.rows && result.rows.length === 0)) {
    throw new Error(`Booking with ID ${bookingIdInt} not found`);
  }
  
  return result.rows ? result.rows[0] : result[0];
}

export const deleteBooking = async (id) => {
  const idInt = parseInt(id);
  if (isNaN(idInt)) throw new Error(`Invalid booking ID: ${id}`);

  const result = await syd.operation(
    "DELETE FROM booking WHERE b_id = $1 RETURNING *",
    [idInt]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateBookingStatus = async (id, state) => {
  const idInt = parseInt(id);
  if (isNaN(idInt)) throw new Error(`Invalid booking ID: ${id}`);

  const validStates = ['PENDING', 'BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW'];
  let bookingState = state;
  
  if (bookingState.toLowerCase() === 'confirmed') {
    bookingState = 'BOOKED';
  }
  
  if (!validStates.includes(bookingState)) {
    throw new Error(`Invalid booking state: ${state}. Must be one of: ${validStates.join(', ')}`);
  }

  const result = await syd.operation(
    "UPDATE booking SET state = $1, updated_at = NOW() WHERE b_id = $2 RETURNING *",
    [bookingState, idInt]
  );
  
  if (!result.rows || (result.rows && result.rows.length === 0)) {
    throw new Error(`Booking with ID ${idInt} not found`);
  }
  
  return result.rows ? result.rows[0] : result[0];
}

export const countBookings = async () => {
  const result = await syd.search("SELECT COUNT(*) as total FROM booking");
  if (result.rows) {
    return { total: parseInt(result.rows[0].total) };
  } else if (Array.isArray(result)) {
    return { total: parseInt(result[0].total) };
  } else {
    return { total: parseInt(result.total) };
  }
}

export const getAvailableRoomBeds = async () => {
  const result = await syd.search(`
    SELECT rb.rb_id, rb.room_id, rb.bed_type, rb.is_available,
           r.name as room_name, r.type as room_type
    FROM room_bed rb
    LEFT JOIN room r ON rb.room_id = r.r_id
    WHERE rb.is_available = true
    ORDER BY rb.rb_id
  `);
  return result.rows || result;
}