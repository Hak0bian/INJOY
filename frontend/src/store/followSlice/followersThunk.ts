import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";


export const getFollowers = createAsyncThunk(
    "getFollowers",
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await API.getFollowers(userId);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch followers");
        }
    }
);

export const getFollowing = createAsyncThunk(
    "getFollowing",
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await API.getFollowing(userId);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch following");
        }
    }
);

export const getFollowCounts = createAsyncThunk<{ followersCount: number; followingCount: number }, string>(
    "getFollowersCounts",
    async (userId) => {
        const res = await API.getFollowCounts(userId);
        return res;
    }
);