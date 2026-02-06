import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, getFeedPosts, getUserPosts, likePost, updatePostText } from "./postThunk";
import type { IPostsState } from "../storeTypes";
import { addComment, deleteComment } from "../commentsSlice/commentsThunk";


const initialState: IPostsState = {
    posts: [],
    feedPosts: [],
    feedLoading: false,
    feedError: null,
    noMoreFeedPosts: false,
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
            })

        builder
            .addCase(addComment.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.meta.arg.postId);
                if (post) {
                    post.commentsCount = action.payload.totalComments;
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const post = state.posts.find(p => p._id === action.payload.postId);
                if (post) {
                    post.commentsCount = action.payload.totalComments;
                }
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const { postId, liked, likes } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (!post) return;

                post.isLiked = liked;
                post.likes = likes;
            })

        builder
            .addCase(getFeedPosts.fulfilled, (state, action) => {
                state.feedLoading = false;
                if (action.payload.length === 0) {
                    state.noMoreFeedPosts = true;
                    return;
                }

                const existingIds = new Set(state.feedPosts.map(p => p._id));
                const uniquePosts = action.payload.filter(
                    p => !existingIds.has(p._id)
                );

                state.feedPosts.push(...uniquePosts);
            })
            .addCase(getFeedPosts.pending, (state) => {
                state.feedLoading = true;
                state.feedError = null;
            })
            .addCase(getFeedPosts.rejected, (state, action) => {
                state.feedLoading = false;
                state.feedError = action.payload as string;
            });
    },
});

export default postSlice.reducer;