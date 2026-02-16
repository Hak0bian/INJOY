import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();


router.post(
    "/register",
    async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "User already exists" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                fullname: username,
                email,
                password: hashedPassword,
            });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

            res.status(201).json({
                token,
                user: {
                    id: newUser._id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    profile: newUser.profile,
                    profileCompleted: newUser.profileCompleted,
                },
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);


router.post(
    "/login",
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "Invalid credentials" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    profile: {
                        username: user.profile.username,
                        bio: user.profile.bio,
                        photo: user.profile.photo
                    },
                    profileCompleted: user.profileCompleted,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);


router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id)
        .select("-password");

    res.json({
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            profileCompleted: user.profileCompleted,
            profile: user.profile,
            followers: user.followers,
            following: user.following,
        },
    });
});

export default router;