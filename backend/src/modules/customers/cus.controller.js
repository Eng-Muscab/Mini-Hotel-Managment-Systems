import * as customerService from './cus.service.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json({ 
      success: true, 
      data: customers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        error: "Customer not found" 
      });
    }
    
    res.json({ 
      success: true, 
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, refrece, ref_phone } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: "Customer name and phone are required" 
      });
    }
    
    const customer = await customerService.createCustomer(name, phone, refrece, ref_phone);
    res.json({ 
      success: true, 
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, refrece, ref_phone, is_active } = req.body;
    
    const customer = await customerService.updateCustomer(id, name, phone, refrece, ref_phone, is_active);
    res.json({ 
      success: true, 
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.deleteCustomer(id);
    res.json({ 
      success: true, 
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const customer = await customerService.updateCustomerStatus(id, status);
    res.json({ 
      success: true, 
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const countCustomers = async (req, res) => {
  try {
    const result = await customerService.countCustomers();
    
    res.json({ 
      success: true, 
      count: result.total,
      message: `Total customers: ${result.total}`,
      data: result
    });
  } catch (error) {
    console.error('Count customers error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to count customers',
      details: error.message 
    });
  }
};