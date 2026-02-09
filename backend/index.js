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

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/conversations", conversationsRoutes);

// HTTP + Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
});

// Socket Authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
});

// Socket Events
io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("sendMessage", async ({ conversationId, text }) => {
        const newMessage = await Message.create({
            conversationId,
            sender: socket.user.id,
            text,
            seenBy: [socket.user.id],
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
        });

        io.to(conversationId).emit("newMessage", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
