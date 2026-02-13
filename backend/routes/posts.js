import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Add new posts
router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            const { text } = req.body;
            if (!req.file && (!text || !text.trim())) {
                return res.status(400).json({ message: "Post is empty" });
            }

            const post = await Post.create({
                user: req.user.id,
                text: text?.trim() || "",
                image: req.file ? req.file.path : undefined,
            });

            await post.populate("user", "fullname profile");
            res.status(201).json({ post });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Get feed posts
router.get("/feed", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 10;

        const me = await User.findById(userId).select("following");
        if (!me) {
            return res.status(404).json({ message: "User not found" });
        }

        let posts = await Post.find({ user: { $in: me.following } })
            .populate("user", "fullname profile")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        posts = posts.filter(p => p.user !== null);

        if (posts.length < limit) {
            const excludeUsers = [...me.following, userId];

            const recommended = await Post.find({ user: { $nin: excludeUsers } })
                .populate("user", "fullname profile")
                .sort({ createdAt: -1 })
                .limit(limit - posts.length);

            const filteredRecommended = recommended.filter(p => p.user !== null);
            posts = [...posts, ...filteredRecommended];
        }

        const postsWithCounts = await Promise.all(
            posts.map(async post => {
                const totalComments = await Comment.countDocuments({ post: post._id });

                return {
                    ...post.toObject(),
                    commentsCount: totalComments,
                };
            })
        );
        res.json({ posts: postsWithCounts });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get recommended posts 
router.get("/recommended", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const me = await User.findById(userId).select("following");

        if (!me) {
            return res.status(404).json({ message: "User not found" });
        }

        const excludeUsers = [...me.following, userId];

        let recommendedPosts = await Post.find({ user: { $nin: excludeUsers } })
            .populate("user", "fullname profile")
            .sort({ createdAt: -1 })
            .limit(30);

        recommendedPosts = recommendedPosts.filter(p => p.user !== null);

        const postsWithCounts = await Promise.all(
            recommendedPosts.map(async post => {
                const totalComments = await Comment.countDocuments({ post: post._id });
                return {
                    ...post.toObject(),
                    commentsCount: totalComments,
                };
            })
        );
        res.json(postsWithCounts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get single post by id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "fullname profile");

        if (!post) return res.status(404).json({ message: "Post not found" });
        const totalComments = await Comment.countDocuments({ post: post._id });

        res.status(200).json({
            post: {
                ...post.toObject(),
                totalComments
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get posts by user
router.get("/user/:userId", authMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ user: userId })
            .populate("user", "fullname profile")
            .sort({ createdAt: -1 });

        const postsWithTotalComments = await Promise.all(
            posts.map(async post => {
                const totalComments = await Comment.countDocuments({ post: post._id });
                return {
                    ...post.toObject(),
                    totalComments
                };
            })
        );
        res.status(200).json({ posts: postsWithTotalComments });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Edit post text
router.patch("/:id", authMiddleware, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });

    post.text = req.body.text;
    await post.save();

    await post.populate("user", "fullname profile");
    res.json({ post });
});

// Delete post
router.delete("/:id", authMiddleware, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });

    await post.deleteOne();
    res.json({ success: true });
});

// Likes on Post
router.post("/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user.id;
        const isLiked = post.likes.some(id => id.toString() === userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.addToSet(userId);
        }

        await post.save();

        const notification = await Notification.create({
            recipient: post.user,
            sender: userId,
            type: "like",
            post: post._id,
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "_id fullname profile.username profile.photo")
            .populate("post", "image");

        const io = req.app.get("io");
        io.to(post.user.toString()).emit("newNotification", populatedNotification);

        res.json({
            postId: post._id,
            liked: !isLiked,
            likes: post.likes
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


export default router;