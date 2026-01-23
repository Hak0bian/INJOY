import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";

export const updateProfile = createAsyncThunk(
    "updateProfile",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            return await API.updateProfile(formData);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Profile update failed"
            );
        }
    }
);


export const loadUserFromToken = createAsyncThunk(
    "auth/loadUserFromToken",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return rejectWithValue("No token found");

            const response = await API.getMe();
            return { user: response.user, token };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
