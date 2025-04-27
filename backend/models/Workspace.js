import mongoose from "mongoose";
const WorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    capacity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("workspace", WorkspaceSchema);