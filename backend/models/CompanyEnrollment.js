import mongoose from "mongoose";

const RBACSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
        },
        companyID: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        positionId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('companyenrollment', RBACSchema);