import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        username: { type: String },
        photo: { type: String },
        bio: { type: String },
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);