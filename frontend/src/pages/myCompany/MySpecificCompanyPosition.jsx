import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getApiURL } from '../../lib/route';

const ManagePositions = () => {
    const { id: companyId } = useParams();
    const [positions, setPositions] = useState([]);
    const [newPosition, setNewPosition] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null); // Track which position is being edited
    const [editingData, setEditingData] = useState({}); // Temporary data for edits

    // Fetch positions for the company
    const fetchPositions = async () => {
        try {
            //todo get the positions for the company url should be ${getApiURL()}/companyposition/${companyId}/positions
           const response = await axios.get(`${getApiURL()}/companyposition/${companyId}/positions`,{withCredentials:true}) 
           setPositions(response.data)
        } catch (error) {
            console.error("Error fetching positions:", error);
            toast.error("Failed to fetch positions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, [companyId]);

    // Handle creating a new position
    const handleCreatePosition = async () => {
        if (!newPosition.trim()) {
            toast.error("Position name is required.");
            return;
        }

        try {
            // todo create a new position for the company url should be ${getApiURL()}/companyposition/${companyId}/positions
            const response = await axios.post(`${getApiURL()}/companyposition/${companyId}/positions`,{name: newPosition},{withCredentials:true})
            fetchPositions()
        } catch (error) {
            console.error("Error creating position:", error);
            toast.error("Failed to create position.");
        }
    };

    // Handle starting edit mode
    const handleEditStart = (position) => {
        setEditingId(position._id);
        setEditingData({ name: position.name, isOpen: position.isOpen });
    };

    // Handle updating a position
    const handleSaveEdit = async () => {
        try {
            // todo update the position for the company url should be ${getApiURL()}/companyposition/${companyId}/positions/${editingId}
            const response = await axios.put(`${getApiURL()}/companyposition/${companyId}/positions/${editingId}`,editingData,{withCredentials:true})
            fetchPositions()
            setEditingId(null);
        } catch (error) {
            console.error("Error updating position:", error);
            toast.error("Failed to update position.");
        }
    };

    // Handle canceling edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingData({});
    };

    // Handle deleting a position
    const handleDeletePosition = async (positionId) => {
        try {
            // todo delete the position for the company url should be ${getApiURL()}/companyposition/${companyId}/positions/${positionId}
            const response = await axios.delete(`${getApiURL()}/companyposition/${companyId}/positions/${positionId}`,{withCredentials:true})
            fetchPositions()
        } catch (error) {
            console.error("Error deleting position:", error);
            toast.error("Failed to delete position.");
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">Manage Positions</h1>

            {/* Create Position */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Create Position</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={newPosition}
                        onChange={(e) => setNewPosition(e.target.value)}
                        placeholder="Position Name"
                        className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCreatePosition}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* List Positions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Existing Positions</h2>
                <ul>
                    {positions.map((position) => (
                        <li key={position._id} className="flex items-center justify-between p-3 border-b">
                            {editingId === position._id ? (
                                // Edit Mode
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={editingData.name}
                                        onChange={(e) =>
                                            setEditingData((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={editingData.isOpen}
                                            onChange={(e) =>
                                                setEditingData((prev) => ({ ...prev, isOpen: e.target.checked }))
                                            }
                                        />
                                        <span>Open</span>
                                    </label>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-3 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium">{position.name}</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            position.isOpen ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    >
                                        {position.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                    <button
                                        onClick={() => handleEditStart(position)}
                                        className="px-3 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePosition(position._id)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManagePositions;