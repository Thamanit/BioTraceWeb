import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        companyId: {
            type: String,
            required: true,
        },
        isOpen: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    { timestamps: true }
);

PositionSchema.index({name: 1, CompanyId: 1},{unique: true})

export default mongoose.model('position', PositionSchema);