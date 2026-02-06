import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";
import type { RootState } from "../store";


export const getUserById = createAsyncThunk(
  'getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await API.getUser(userId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const followUser = createAsyncThunk(
  "follow",
  async (targetUserId: string, { getState }) => {
    const res = await API.followUser(targetUserId);
    const state = getState() as RootState;

    return {
      targetUserId,
      currentUserId: state.auth.user!._id,
      following: res.following,
    };
  }
);

export const searchUsers = createAsyncThunk(
  "search",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await API.searchUsers(query);
      return res.users;
    } catch (err: any) {
      return rejectWithValue("Search failed");
    }
  }
);