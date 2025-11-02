import sydClass from "../../core/sydClass.js";

const syd = new sydClass();


export const getAllCustomers = async () => {
    return await syd.search("SELECT * FROM customer ORDER BY c_id ASC");
};

export const getCustomerById = async (id) => {
    const result = await syd.search("SELECT * FROM customer WHERE c_id = $1", [id]);
    return result[0] || null;
};

export const manageCustomers = async (action, id = null, name = null, phone = null, refrece = null, ref_tell = null) => {
    return await syd.operation(
    "SELECT customer_manage($1, $2, $3, $4, $5, $6)",
    [action, id, name, phone, refrece, ref_tell]
  );
};