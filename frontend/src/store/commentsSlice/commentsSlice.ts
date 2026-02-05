import { createSlice } from "@reduxjs/toolkit";
import { getComments, addComment, deleteComment } from "./commentsThunk";
import type { CommentsState } from "../storeTypes";

const initialState: CommentsState = {
    comments: [],
    loading: false,
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        clearComments(state) {
            state.comments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(getComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getComments.rejected, (state) => {
                state.loading = false;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { comment } = action.payload;
                if (!comment.parent) {
                    state.comments.unshift(comment);
                } else {
                    const parentComment = state.comments.find(c => c._id === comment.parent);
                    if (parentComment) {
                        if (!parentComment.replies) parentComment.replies = [];
                        parentComment.replies.push(comment);
                    }
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const { commentId } = action.payload;

                state.comments = state.comments.filter(c => c._id !== commentId);
                state.comments.forEach(c => {
                    if (c.replies) {
                        c.replies = c.replies.filter(r => r._id !== commentId);
                    }
                });
            });
    },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;