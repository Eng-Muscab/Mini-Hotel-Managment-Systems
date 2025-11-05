import express from 'express';
import * as customerController from './cus.controller.js';

const router = express.Router();

router.get('/count', customerController.countCustomers);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.patch('/:id/status', customerController.updateCustomerStatus);
router.delete('/:id', customerController.deleteCustomer);

export default router;