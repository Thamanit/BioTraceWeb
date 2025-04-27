import mongoose from "mongoose";

const bookingWorkspaceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workspace',
        required: true
    },
    period: {
        startAt: {
            type: Date,
            required: true
        },
        endAt: {
            type: Date,
            required: true
        }
    }
});

export default mongoose.model('BookingWorkspace', bookingWorkspaceSchema);