import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import usersRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";
import messagesRoutes from "./routes/messages.js";
import conversationsRoutes from "./routes/conversations.js";

import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/conversations", conversationsRoutes);


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

app.set("io", io); 
const onlineUsers = new Map();

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
});


io.on("connection", (socket) => {
    const userId = socket.user.id;

    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);
    io.emit("userOnline", userId);
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("markSeen", async (conversationId) => {
        try {
            await Message.updateMany(
                {
                    conversationId,
                    seenBy: { $ne: socket.user.id },
                },
                {
                    $push: { seenBy: socket.user.id },
                }
            );

            socket.to(conversationId).emit("messagesSeen", {
                conversationId,
                userId: socket.user.id,
            });
        } catch (err) {
            console.error("markSeen error:", err);
        }
    });

    socket.on("sendMessage", async ({ conversationId, text }) => {
        try {
            if (!conversationId || !text?.trim()) return;

            const newMessage = await Message.create({
                conversationId,
                sender: userId,
                text,
                seenBy: [userId],
            });

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id,
                updatedAt: new Date(),
            });

            io.to(conversationId).emit("newMessage", newMessage);
        } catch (err) {
            console.error("Send message error:", err.message);
        }
    });

    socket.on("disconnect", () => {
        const userSockets = onlineUsers.get(userId);
        if (!userSockets) return;

        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
            onlineUsers.delete(userId);
            io.emit("userOffline", userId);
        }
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});