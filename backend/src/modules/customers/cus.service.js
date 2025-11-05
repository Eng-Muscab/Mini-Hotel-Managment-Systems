import sydClass from "../../core/sydClass.js";
const syd = new sydClass();

export const getAllCustomers = async () => {
  const result = await syd.search("SELECT * FROM customer ORDER BY c_id ASC");
  return result.rows || result;
}

export const getCustomerById = async (id) => {
  const result = await syd.search("SELECT * FROM customer WHERE c_id = $1", [id]);
  return result.rows ? result.rows[0] : result[0];
}

export const createCustomer = async (name, phone, refrece, ref_phone) => {
  const result = await syd.operation(
    `INSERT INTO customer (name, phone, refrece, ref_phone, is_active) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, phone, refrece, ref_phone, true]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateCustomer = async (id, name, phone, refrece, ref_phone, is_active) => {
  const result = await syd.operation(
    `UPDATE customer 
     SET name = $1, phone = $2, refrece = $3, ref_phone = $4, 
         is_active = $5, updated_at = NOW() 
     WHERE c_id = $6 RETURNING *`,
    [name, phone, refrece, ref_phone, is_active, id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const deleteCustomer = async (id) => {
  const result = await syd.operation(
    "DELETE FROM customer WHERE c_id = $1 RETURNING *",
    [id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const updateCustomerStatus = async (id, status) => {
  const result = await syd.operation(
    "UPDATE customer SET is_active = $1, updated_at = NOW() WHERE c_id = $2 RETURNING *",
    [status, id]
  );
  return result.rows ? result.rows[0] : result[0];
}

export const countCustomers = async () => {
  const result = await syd.search("SELECT COUNT(*) as total FROM customer");
  if (result.rows) {
    return { total: parseInt(result.rows[0].total) };
  } else if (Array.isArray(result)) {
    return { total: parseInt(result[0].total) };
  } else {
    return { total: parseInt(result.total) };
  }
}