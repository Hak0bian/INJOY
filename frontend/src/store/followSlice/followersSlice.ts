import { createSlice } from "@reduxjs/toolkit";
import { getFollowers, getFollowing } from "./followersThunk";
import type { FollowersState } from "../../types";


const initialState: FollowersState = {
    followers: [],
    following: [],
    loading: false,
    error: null,
};

const followersSlice = createSlice({
    name: "followers",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.loading = false;
                state.followers = action.payload;
            })
            .addCase(getFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload;
            })
            .addCase(getFollowing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default followersSlice.reducer;
