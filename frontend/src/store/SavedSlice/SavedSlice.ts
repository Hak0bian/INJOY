import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getSavedPosts } from "./savedThunk";
import type { SavedState } from "../storeTypes";

const savedFromStorage = localStorage.getItem("Saved Posts");

const initialState: SavedState = {
    savedItems: savedFromStorage ? JSON.parse(savedFromStorage) : [],
    posts: [],
    loading: false,
    error: null,
};

export const savedSlice = createSlice({
    name: "saved",
    initialState,
    reducers: {
        toggleSavedPost: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
            const item = action.payload;
            const exists = state.savedItems.find(i => i.postId === item.postId);

            if (exists) {
                state.savedItems = state.savedItems.filter(i => i.postId !== item.postId);
            } else {
                state.savedItems.push(item);
            }

            localStorage.setItem("Saved Posts", JSON.stringify(state.savedItems));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSavedPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSavedPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getSavedPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });
    },
});

export const { toggleSavedPost } = savedSlice.actions;
export default savedSlice.reducer;