import express from "express";
import multer from "multer";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/profile", authMiddleware, upload.single("photo"), async (req, res) => {
        try {
            const { username, bio } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (req.file) {
                user.profile.photo = req.file.path;
            }

            user.profile.displayName = username;
            user.profile.bio = bio;
            user.profileCompleted = true;

            await user.save();
            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    profileCompleted: user.profileCompleted,
                },
            });
        } catch (error) {
            console.error("Profile update error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;