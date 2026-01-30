import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";
import type { IAuthError, IAuthResponse, ILoginPayload, IRegisterPayload } from "../../types";


export const registerUser = createAsyncThunk<IAuthResponse, IRegisterPayload, { rejectValue: IAuthError }>(
    "auth/registerUser", async (payload, { rejectWithValue }) => {
        try {
            return await API.register(payload);
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Something went wrong" });
        }
    }
);

export const loginUser = createAsyncThunk<IAuthResponse, ILoginPayload, { rejectValue: IAuthError }>(
    "auth/loginUser",
    async (payload, { rejectWithValue }) => {
        try {
            return await API.login(payload);
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Something went wrong" });
        }
    }
);