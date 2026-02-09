import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";

export const getConversations = createAsyncThunk(
    "getConversations",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.getAllConversations();
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Error fetching conversations");
        }
    }
);

export const getConversationById = createAsyncThunk(
  "getById",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await API.getConversation(conversationId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error fetching conversation");
    }
  }
);


export const deleteConversationById = createAsyncThunk(
    "deleteConversations",
    async (conversationId: string, { rejectWithValue }) => {
        try {
            await API.deleteConversation(conversationId);
            return conversationId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Delete error");
        }
    }
);

