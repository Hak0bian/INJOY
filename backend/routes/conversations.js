import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id,
        })
            .populate("participants", "profile fullname")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate("participants", "fullname profile");
        res.json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({ error: "Not allowed" });
        }

        await Message.deleteMany({ conversationId: id });
        await Conversation.findByIdAndDelete(id);

        res.json({ message: "Conversation deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router;