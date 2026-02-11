import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
const router = express.Router();

router.post("/conversation", authMiddleware, async (req, res) => {
    const { receiverId } = req.body;

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, receiverId],
            });
        }

        res.json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/:conversationId", authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const conversationId = message.conversationId;

    await message.deleteOne();

    const lastMessage = await Message.findOne({
      conversationId,
    }).sort({ createdAt: -1 });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: lastMessage?._id || null,
    });

    req.app.get("io").to(conversationId.toString()).emit("messageDeleted", {
      messageId: message._id,
      conversationId,
      newLastMessage: lastMessage,
    });

    res.json({ messageId: message._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/seen/:conversationId", authMiddleware, async (req, res) => {
    try {
        const { conversationId } = req.params;
        await Message.updateMany(
            { conversationId, seenBy: { $ne: req.user.id } },
            { $push: { seenBy: req.user.id } }
        );

        const lastMessage = await Message.findOne({ conversationId }).sort({ createdAt: -1 });
        res.json({ lastMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;