import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

// Get posts by user
router.get("/user/:userId", authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
            .populate("user", "fullname profile");

        res.status(200).json({ posts });
    } catch (err) {
        console.error(err);
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


export default router;