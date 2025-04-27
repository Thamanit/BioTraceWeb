import express from 'express';
import {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} from '../controllers/bookingController.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/', verifyToken, getBookings);
router.get('/:bookingId', verifyToken, getBookingById);
router.put('/:bookingId', verifyToken, updateBooking);
router.delete('/:bookingId', verifyToken, deleteBooking);

export default router;