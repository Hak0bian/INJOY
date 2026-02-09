import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";


export const getMessages = createAsyncThunk(
    "getMessages",
    async (conversationId: string, { rejectWithValue }) => {
        try {
            const res = await API.getMessages(conversationId);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Error fetching messages");
        }
    }
);

export const createConversation = createAsyncThunk(
    "createConversation",
    async (receiverId: string, { rejectWithValue }) => {
        try {
            const res = await API.createConversation(receiverId);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Error creating conversation");
        }
    }
);


export const deleteMessage = createAsyncThunk(
    "messages/deleteMessage",
    async (messageId: string, { rejectWithValue }) => {
        try {
            await API.deleteMessage(messageId);
            return messageId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Error deleting message");
        }
    }
);