import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { getApiURL } from '../../lib/route';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize moment for calendar localization
const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
    const [events, setEvents] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const [newBooking, setNewBooking] = useState({
        userId: user?._id || '',
        workspaceId: '',
        startAt: '',
        endAt: '',
    });

    const [selectedSlot, setSelectedSlot] = useState({ start: null, end: null });
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
        fetchWorkspaces();
    }, []);

    // Fetch all bookings
    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${getApiURL()}/bookings`, { withCredentials: true });
            const bookings = response.data.map((booking) => ({
                id: booking._id,
                title: `Booked by ${booking?.userId?.username || 'Unknown'}`,
                start: new Date(booking.period.startAt),
                end: new Date(booking.period.endAt),
                user: booking.userId,
                workspace: booking.workspaceId
            }));
            setEvents(bookings);
        } catch (error) {
            toast.error('Error fetching bookings');
            console.error('Error fetching bookings:', error);
        }
    };

    // Fetch workspaces for dropdown
    const fetchWorkspaces = async () => {
        try {
            const response = await axios.get(`${getApiURL()}/workspaces`, { withCredentials: true });
            setWorkspaces(response.data);
        } catch (error) {
            toast.error('Error fetching workspaces');
            console.error('Error fetching workspaces:', error);
        }
    };

    // Handle selecting an empty slot
    const handleSelectSlot = ({ start, end }) => {
        setSelectedSlot({ start, end });
        setNewBooking((prev) => ({
            ...prev,
            startAt: moment(start).format('YYYY-MM-DDTHH:mm'),
            endAt: moment(end).format('YYYY-MM-DDTHH:mm'),
        }));
        setIsCreateModalOpen(true);
    };

    // Handle selecting an existing booking (to show details)
    const handleSelectEvent = (event) => {
        setSelectedBooking(event);
        setIsViewModalOpen(true);
    };

    // Create a new booking
    const handleCreateBooking = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiURL()}/bookings`, {
                userId: newBooking.userId,
                workspaceId: newBooking.workspaceId,
                startAt: new Date(newBooking.startAt),
                endAt: new Date(newBooking.endAt),
            }, { withCredentials: true });

            setIsCreateModalOpen(false);
            fetchBookings();
            toast.success('Booking created successfully');
            setNewBooking({ userId: '', workspaceId: '', startAt: '', endAt: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Booking failed');
        }
    };

    // Delete a booking
    const handleDeleteBooking = async () => {
        if (!selectedBooking) return;

        try {
            await axios.delete(`${getApiURL()}/bookings/${selectedBooking.id}`, { withCredentials: true });
            setIsViewModalOpen(false);
            fetchBookings();
            toast.success('Booking deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete booking');
        }
    };

    // Custom event styling
    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: '#3182ce',
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: 'none',
                display: 'block',
                padding: '5px',
                cursor: 'pointer',
            }
        };
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-6">Workspace Booking Calendar</h1>

            <div className="bg-white shadow-sm rounded p-4 mb-8">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    style={{ height: 600 }}
                    eventPropGetter={eventStyleGetter}
                />
            </div>

            {/* Create Booking Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="bg-white p-6 rounded shadow-md z-20 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
                        <form onSubmit={handleCreateBooking} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Workspace</label>
                                <select
                                    value={newBooking.workspaceId}
                                    onChange={(e) =>
                                        setNewBooking((prev) => ({ ...prev, workspaceId: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select Workspace</option>
                                    {workspaces.map((workspace) => (
                                        <option key={workspace._id} value={workspace._id}>
                                            {workspace.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Start At</label>
                                <input
                                    type="datetime-local"
                                    value={newBooking.startAt}
                                    onChange={(e) =>
                                        setNewBooking((prev) => ({ ...prev, startAt: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">End At</label>
                                <input
                                    type="datetime-local"
                                    value={newBooking.endAt}
                                    onChange={(e) =>
                                        setNewBooking((prev) => ({ ...prev, endAt: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Booking Modal */}
            {isViewModalOpen && selectedBooking && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsViewModalOpen(false)}></div>
                    <div className="bg-white p-6 rounded shadow-md z-20 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                        <p><strong>User:</strong> {selectedBooking.user?.username}</p>
                        <p><strong>Workspace:</strong> {selectedBooking.workspace?.name}</p>
                        <p><strong>Start:</strong> {moment(selectedBooking.start).format('LLLL')}</p>
                        <p><strong>End:</strong> {moment(selectedBooking.end).format('LLLL')}</p>
                        <button onClick={handleDeleteBooking} className="px-4 py-2 bg-red-600 text-white rounded mt-4">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingCalendar;
