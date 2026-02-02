import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, getUserPosts, updatePostText } from "./postThunk";
import type { IPostsState } from "../../types";


const initialState: IPostsState = {
    posts: [],
    createPostLoading: false,
    createPostError: null,
    getUserPostsLoading: false,
    getUserPostsError: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createPost.fulfilled, (state, action) => {
                state.createPostLoading = false;
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.pending, (state) => {
                state.createPostLoading = true;
                state.createPostError = null;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.createPostLoading = false;
                state.createPostError = action.payload as string;
            })

        builder
            .addCase(getUserPosts.fulfilled, (state, action) => {
                state.getUserPostsLoading = false;
                state.posts = action.payload;
            })
            .addCase(getUserPosts.pending, (state) => {
                state.getUserPostsLoading = true;
                state.getUserPostsError = null;
            })
            .addCase(getUserPosts.rejected, (state, action) => {
                state.getUserPostsLoading = false;
                state.getUserPostsError = action.payload as string;
            })

        builder
            .addCase(updatePostText.fulfilled, (state, action) => {
                const index = state.posts.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index].text = action.payload.text;
                }
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p._id !== action.payload);
            });
    },
});

export default postSlice.reducer;
