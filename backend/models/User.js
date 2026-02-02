import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileCompleted: { type: Boolean, default: false },
        profile: {
            username: String,
            photo: String,
            bio: String,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);