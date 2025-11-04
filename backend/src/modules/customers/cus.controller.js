import { createCustomer, deleteCustomer, getAllCustomers, updateCustomer } from "./cus.service";

export const getAllCustomersController = async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json(customers);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getCustomerByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await getCustomerById(id);

    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const createCustomerController = async (req, res) => {
  const { name, email } = req.body;
  try {
    await createCustomer(name, email);
    res.status(201).json({ message: "Customer created successfully" });
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateCustomerController = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await updateCustomer(id, name, email);
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const deleteCustomerController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCustomer(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};