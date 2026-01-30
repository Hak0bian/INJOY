import express from "express";
import multer from "multer";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
    "/profile",
    authMiddleware,
    upload.single("photo"), // կամ upload.fields([{ name: "photo", maxCount: 1 }])
    async (req, res) => {
        try {
            // FormData text fields-ը ստացվում են req.body-ից
            const { fullname, username, bio } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            if (req.file) user.profile.photo = req.file.path;
            if (fullname) user.fullname = fullname;
            if (username) user.profile.username = username;
            if (bio) user.profile.bio = bio;

            user.profileCompleted = true;

            await user.save();

            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    profile: {
                        username: user.profile.username,
                        bio: user.profile.bio,
                        photo: user.profile.photo,
                    },
                    profileCompleted: user.profileCompleted,
                },
            });
        } catch (error) {
            console.error("Profile update error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);


router.get(
    "/me",
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    profileCompleted: user.profileCompleted,
                    profile: {
                        username: user.profile.username,
                        bio: user.profile.bio,
                        photo: user.profile.photo,
                    },
                },
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;