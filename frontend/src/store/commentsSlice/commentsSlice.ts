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
            .addCase(getComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })

            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.unshift(action.payload.comment);
            })

        builder
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(
                    c => c._id !== action.payload.commentId
                );
            });

    },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;