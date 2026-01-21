import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://localhost:5000/api/auth";


// Register user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (values: { username: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const { username, email, password } = values;
            const res = await axios.post(`${API_URL}/register`, {
                username,
                email,
                password
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Something went wrong" });
        }
    }
);

// Login user (unchanged)
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            return res.data; // { token, user }
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Something went wrong" });
        }
    }
);