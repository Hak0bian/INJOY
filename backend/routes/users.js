import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();


router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = user.followers.some(
            id => id.toString() === req.user.id
        );

        res.json({
            ...user,
            isFollowing,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/:id/follow", authMiddleware, async (req, res) => {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser)
        return res.status(404).json({ message: "User not found" });

    const isFollowing = currentUser.following.some(
        id => id.toString() === targetUser._id.toString()
    );

    if (isFollowing) {
        currentUser.following.pull(targetUser._id);
        targetUser.followers.pull(currentUser._id);
    } else {
        currentUser.following.addToSet(targetUser._id);
        targetUser.followers.addToSet(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
        following: !isFollowing,
        targetUserId: targetUser._id,
        currentUserId: currentUser._id,
    });
});


router.get("/:id/followers", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("followers")
            .populate({
                path: "followers",
                select: "_id fullname profile.username profile.photo",
            });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.followers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/:id/following", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("following")
            .populate({
                path: "following",
                select: "_id fullname profile.username profile.photo",
            });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.following);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/:id/follow-counts", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("followers following");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            followersCount: user.followers.length,
            followingCount: user.following.length,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;