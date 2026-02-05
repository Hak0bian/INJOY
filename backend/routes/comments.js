import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
const router = express.Router();


router.get("/:postId", authMiddleware, async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId, parent: null })
        .populate("user", "_id fullname profile.username profile.photo")
        .sort({ createdAt: -1 });

    const allComments = await Comment.find({ post: req.params.postId })
        .populate("user", "_id fullname profile.username profile.photo")
        .sort({ createdAt: 1 });

    const nestedComments = comments.map(comment => ({
        ...comment.toObject(),
        replies: allComments.filter(c => c.parent?.toString() === comment._id.toString())
    }));

    res.json(nestedComments);
});

router.post("/:postId", authMiddleware, async (req, res) => {
    const { text, parent } = req.body;

    const comment = await Comment.create({
        post: req.params.postId,
        user: req.user.id,
        text,
        parent: parent || null,
    });

    await Post.findByIdAndUpdate(req.params.postId, {
        $inc: { commentsCount: 1 }
    });

    const totalComments = await Comment.countDocuments({ post: req.params.postId });
    const populated = await comment.populate(
        "user",
        "_id fullname profile.username profile.photo"
    );

    res.status(201).json({ comment: populated, totalComments });
});

router.delete("/:commentId", authMiddleware, async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    let deletedCount = 1;
    if (!comment.parent) {
        deletedCount += await Comment.countDocuments({ parent: comment._id });
        await Comment.deleteMany({ parent: comment._id });
    }

    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -deletedCount }
    });

    const totalComments = await Comment.countDocuments({ post: comment.post });
    res.json({
        success: true,
        commentId: comment._id,
        postId: comment.post,
        totalComments
    });
});

export default router;