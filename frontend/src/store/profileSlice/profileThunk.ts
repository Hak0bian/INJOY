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
