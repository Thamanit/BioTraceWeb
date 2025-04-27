import mongoose from "mongoose";

const RBACSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            unique: false
        },
        objectID: {
            type: String,
            required: false,
        },
        objectType: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('rbac', RBACSchema);