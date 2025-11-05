import express from 'express';
import * as bookingController from './booking.controller.js';

const router = express.Router();

router.get('/count', bookingController.countBookings);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

export default router;