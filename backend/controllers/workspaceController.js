import Workspace from '../models/Workspace.js';

/**
 * Create a new workspace.js
 */
export const createWorkspace = async (req, res) => {
    const { name, location, description, capacity } = req.body;

    try {
        // Check if workspace already exists
        const existingWorkspace = await Workspace.findOne({ name });
        if (existingWorkspace) {
            return res.status(400).json({ error: 'Workspace name must be unique' });
        }

        // Create new workspace
        const workspace = new Workspace({
            name,
            location,
            description,
            capacity
        });

        await workspace.save();
        res.status(201).json({ success: true, workspace });
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).json({ error: 'Failed to create workspace' });
    }
};

/**
 * Get all workspaces
 */
export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find();
        res.status(200).json(workspaces);
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
};

/**
 * Get workspace by ID
 */
export const getWorkspaceById = async (req, res) => {
    const { id } = req.params;

    try {
        const workspace = await Workspace.findById(id);
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        res.status(200).json(workspace);
    } catch (error) {
        console.error('Error fetching workspace by ID:', error);
        res.status(500).json({ error: 'Failed to fetch workspace' });
    }
};

/**
 * Update workspace by ID
 */
export const updateWorkspace = async (req, res) => {
    const { id } = req.params;
    const { name, location, description, capacity } = req.body;

    try {
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            id,
            { name, location, description, capacity },
            { new: true, runValidators: true }
        );

        if (!updatedWorkspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }

        res.status(200).json({ success: true, workspace: updatedWorkspace });
    } catch (error) {
        console.error('Error updating workspace:', error);
        res.status(500).json({ error: 'Failed to update workspace' });
    }
};

/**
 * Delete workspace by ID
 */
export const deleteWorkspace = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWorkspace = await Workspace.findByIdAndDelete(id);
        if (!deletedWorkspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        res.status(200).json({ success: true, message: 'Workspace deleted successfully' });
    } catch (error) {
        console.error('Error deleting workspace:', error);
        res.status(500).json({ error: 'Failed to delete workspace' });
    }
};
