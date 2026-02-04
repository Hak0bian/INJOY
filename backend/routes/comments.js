import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const router = express.Router();


router.get("/:postId", authMiddleware, async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate("user", "_id fullname profile.username profile.photo")
        .sort({ createdAt: -1 });

    res.json(comments);
});


router.post("/:postId", authMiddleware, async (req, res) => {
    const { text } = req.body;
    const comment = await Comment.create({
        post: req.params.postId,
        user: req.user.id,
        text,
    });

    const post = await Post.findByIdAndUpdate(
        req.params.postId,
        { $inc: { commentsCount: 1 } },
        { new: true } 
    );

    const populated = await comment.populate(
        "user",
        "_id fullname profile.username profile.photo"
    );

    res.status(201).json({ 
        comment: populated, 
        commentsCount: post.commentsCount 
    });
});


router.delete("/:commentId", authMiddleware, async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
    });

    res.json({
        success: true,
        commentId: comment._id,
        postId: comment.post,
    });
});



export default router;