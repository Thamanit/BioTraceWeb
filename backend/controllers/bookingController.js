import BookingWorkspace from '../models/BookingWorkspace.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
    const { workspaceId, startAt, endAt } = req.body;

    const userId = req.user.id;

    try {
        // Validate workspace and user existence
        const user = await User.findById(userId);
        const workspace = await Workspace.findById(workspaceId);

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

        // Validate booking period
        if (new Date(startAt) >= new Date(endAt)) {
            return res.status(422).json({ error: 'End time must be after start time' });
        }
        
        if (new Date(startAt) < new Date()) {
            return res.status(422).json({ error: 'You cannot book an earlier time' });   
        }

        // Check for overlapping bookings
        const conflict = await BookingWorkspace.findOne({
            workspaceId,
            $or: [
                { 'period.startAt': { $lt: endAt, $gte: startAt } },  // Overlapping start
                { 'period.endAt': { $gt: startAt, $lte: endAt } },    // Overlapping end
                { 'period.startAt': { $lte: startAt }, 'period.endAt': { $gte: endAt } } // Fully overlaps
            ]
        });

        if (conflict) {
            return res.status(409).json({ error: 'Workspace is already booked during this period' });
        }

        // Create new booking
        const newBooking = new BookingWorkspace({
            userId,
            workspaceId,
            period: { startAt, endAt }
        });

        await newBooking.save();
        return res.status(201).json({ success: true, message: 'Booking created', booking: newBooking });

    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await BookingWorkspace.find()
            .populate({ path: 'userId', select: 'username' })  // Populate only username
            .populate({ path: 'workspaceId', select: 'name' }); // Populate only workspace name

        return res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ error: 'An error occurred while fetching bookings' });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await BookingWorkspace.findById(req.params.bookingId)
            .populate({ path: 'userId', select: 'username' })
            .populate({ path: 'workspaceId', select: 'name' });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        return res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateBooking = async (req, res) => {
    const { startAt, endAt } = req.body;

    try {
        const booking = await BookingWorkspace.findById(req.params.bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // Validate booking period
        if (new Date(startAt) >= new Date(endAt)) {
            return res.status(422).json({ error: 'End time must be after start time' });
        }

        // Check for overlapping bookings (excluding current booking)
        const conflict = await BookingWorkspace.findOne({
            workspaceId: booking.workspaceId,
            _id: { $ne: booking._id },  // Exclude the current booking
            $or: [
                { 'period.startAt': { $lt: endAt, $gte: startAt } },
                { 'period.endAt': { $gt: startAt, $lte: endAt } },
                { 'period.startAt': { $lte: startAt }, 'period.endAt': { $gte: endAt } }
            ]
        });

        if (conflict) {
            return res.status(409).json({ error: 'Workspace is already booked during this period' });
        }

        // Update booking period
        booking.period.startAt = startAt;
        booking.period.endAt = endAt;
        await booking.save();

        return res.status(200).json({ success: true, message: 'Booking updated', booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteBooking = async (req, res) => {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        // Check if the booking exists and belongs to the user
        const booking = await BookingWorkspace.findById(req.params.bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId.toString() !== userId) return res.status(403).json({ error: 'The Booking is not belong to you' });

        const deletedBooking = await BookingWorkspace.findByIdAndDelete(req.params.bookingId);
        if (!deletedBooking) return res.status(404).json({ error: 'Booking not found' });

        return res.status(200).json({ success: true, message: 'Booking deleted' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};