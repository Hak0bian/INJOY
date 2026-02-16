import { createSlice } from "@reduxjs/toolkit";
import type { IAuthState } from "../storeTypes";
import { loginUser, registerUser } from "./authThunk";
import { updateProfile, loadUserFromToken } from "../profileSlice/profileThunk";
import { followUser } from "../usersSlice/usersThunk";


const initialState: IAuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    initialized: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        clearError: (state) => {
            state.error = null;
        },
        setUserFromStorage: (state) => {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");
            if (token && user) {
                state.token = token;
                state.user = JSON.parse(user);
            }
            state.initialized = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true; state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            })

        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true; state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            })

        builder
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })

            .addCase(loadUserFromToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUserFromToken.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(loadUserFromToken.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.loading = false;
                state.initialized = true;
            })

        builder
            .addCase(followUser.fulfilled, (state, action) => {
                if (!state.user) return;

                const { targetUserId, following } = action.payload;

                if (following) {
                    state.user.following = [
                        ...(state.user.following ?? []),
                        targetUserId
                    ];
                } else {
                    state.user.following =
                        state.user.following?.filter(id => id !== targetUserId) ?? [];
                }
            });

    },
});

export const { logout, clearError, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;