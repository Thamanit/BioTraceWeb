// src/pages/WorkspaceManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiURL } from '../../lib/route';

const WorkspaceManagement = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // New Workspace Data
    const [newWorkspace, setNewWorkspace] = useState({
        name: '',
        location: '',
        description: '',
        capacity: '',
    });

    // Edit Workspace Data
    const [editWorkspace, setEditWorkspace] = useState({
        id: '',
        name: '',
        location: '',
        description: '',
        capacity: '',
    });

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    // Fetch all workspaces
    const fetchWorkspaces = async () => {
        try {
            const response = await axios.get(`${getApiURL()}/workspaces`,{withCredentials: true});
            setWorkspaces(response.data);
        } catch (error) {
            console.error('Error fetching workspaces:', error);
        }
    };

    // Handle adding new workspace
    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiURL()}/workspaces`, newWorkspace,{withCredentials: true});
            fetchWorkspaces();
            setIsModalOpen(false);
            alert('Workspace created successfully!');
            setNewWorkspace({ name: '', location: '', description: '', capacity: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to create workspace');
        }
    };

    // Handle editing workspace
    const handleEditWorkspace = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${getApiURL()}/workspaces/${editWorkspace.id}`, editWorkspace,{withCredentials: true});
            fetchWorkspaces();
            setIsEditModalOpen(false);
            alert('Workspace updated successfully!');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update workspace');
        }
    };

    // Handle deleting workspace
    const handleDeleteWorkspace = async (id) => {
        if (window.confirm('Are you sure you want to delete this workspace?')) {
            try {
                await axios.delete(`${getApiURL()}/workspaces/${id}`,{withCredentials: true});
                fetchWorkspaces();
                alert('Workspace deleted successfully!');
            } catch (error) {
                alert('Failed to delete workspace');
            }
        }
    };

    // Open edit modal and populate fields
    const handleSelectEdit = (workspace) => {
        setEditWorkspace({
            id: workspace._id,
            name: workspace.name,
            location: workspace.location,
            description: workspace.description,
            capacity: workspace.capacity,
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">Workspace Management</h1>

            <div className="bg-white shadow-sm rounded p-4 mb-8">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add New Workspace
                </button>

                <table className="w-full mt-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Name</th>
                            <th className="p-2">Location</th>
                            <th className="p-2">Capacity</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workspaces.map((workspace) => (
                            <tr key={workspace._id} className="border-t">
                                <td className="p-2">{workspace.name}</td>
                                <td className="p-2">{workspace.location}</td>
                                <td className="p-2">{workspace.capacity}</td>
                                <td className="p-2 space-x-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        onClick={() => handleSelectEdit(workspace)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        onClick={() => handleDeleteWorkspace(workspace._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Workspace Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-md z-20 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Create New Workspace</h2>
                        <form onSubmit={handleCreateWorkspace}>
                            <label>Name</label>
                            <input
                                type="text"
                                value={newWorkspace.name}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                                className="w-full border p-2 mb-4"
                                required
                            />
                            <label>Location</label>
                            <input
                                type="text"
                                value={newWorkspace.location}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, location: e.target.value })}
                                className="w-full border p-2 mb-4"
                                required
                            />
                            <label>Capacity</label>
                            <input
                                type="number"
                                value={newWorkspace.capacity}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, capacity: e.target.value })}
                                className="w-full border p-2 mb-4"
                                required
                            />
                            <button onClick={()=>setIsModalOpen(false)} className="px-4 py-2 bg-red-600 text-white rounded mr-4">Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsEditModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white p-6 rounded shadow-md z-20 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Workspace</h2>
                        <form onSubmit={handleEditWorkspace}>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                value={editWorkspace.name}
                                onChange={(e) => setEditWorkspace({ ...editWorkspace, name: e.target.value })}
                                className="w-full border p-2 mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Location</label>
                            <input
                                type="text"
                                value={editWorkspace.location}
                                onChange={(e) =>
                                    setEditWorkspace({ ...editWorkspace, location: e.target.value })
                                }
                                className="w-full border p-2 mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Description</label>
                            <textarea
                                value={editWorkspace.description}
                                onChange={(e) =>
                                    setEditWorkspace({ ...editWorkspace, description: e.target.value })
                                }
                                className="w-full border p-2 mb-4"
                            ></textarea>

                            <label className="block mb-1 font-medium">Capacity</label>
                            <input
                                type="number"
                                value={editWorkspace.capacity}
                                onChange={(e) =>
                                    setEditWorkspace({ ...editWorkspace, capacity: e.target.value })
                                }
                                className="w-full border p-2 mb-4"
                                required
                            />

                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceManagement;
