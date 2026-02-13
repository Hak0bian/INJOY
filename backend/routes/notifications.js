import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const notifications = await Notification.find({
        recipient: req.user.id,
    })
        .populate("sender", "fullname profile")
        .populate("post", "image")
        .sort({ createdAt: -1 });

    res.json(notifications);
});

router.patch("/read", authMiddleware, async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user.id, isRead: false },
        { isRead: true }
    );

    res.json({ success: true });
});

export default router;