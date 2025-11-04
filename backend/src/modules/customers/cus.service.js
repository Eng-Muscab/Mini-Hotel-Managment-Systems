import sydClass from "../../core/sydClass";


const syd = new sydClass();

// get all customers
export const getAllCustomers = async () => await syd.search("SELECT * FROM customer ORDER BY c_id ASC");

// get customer by id
export const getCustomerById = async (id) => await syd.search("SELECT * FROM customer WHERE c_id = $1", [id]);

export const createCustomer = async (name, email) => {
    try {
        await syd.operation("INSERT INTO customer (name, email) VALUES ($1, $2)", [name, email]);
    } catch (err) {
        console.error("SQL Error:", err.message);
    }
}

export const updateCustomer = async (id, name, email) => {
    try {
        await syd.operation("UPDATE customer SET name = $1, email = $2 WHERE c_id = $3", [name, email, id]);
    } catch (err) {
        console.error("SQL Error:", err.message);
    }
}

export const deleteCustomer = async (id) => {
    try {
        await syd.operation("DELETE FROM customer WHERE c_id = $1", [id]);
    } catch (err) {
        console.error("SQL Error:", err.message);
    }
}