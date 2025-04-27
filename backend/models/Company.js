import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false, // By default, companies should be unverified
        },
        ownerID: {
            type: String,
            required: false,
        },
        ratings: {
            type: [{ userId: String, rating: Number }],
            default: [],
            required: false,
        },
        positions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'position', // Reference the Position model
            },
        ]
    },
    { timestamps: true }
);

export default mongoose.model('companys', CompanySchema);