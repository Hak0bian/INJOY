import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";
import type { IComment } from "../storeTypes";


export const getComments = createAsyncThunk<IComment[], string>(
    "getComments",
    async (postId) => {
        return await API.getComments(postId);
    }
);

export const addComment = createAsyncThunk<{ comment: IComment; commentsCount: number },{ postId: string; text: string }>(
  "addComment",
  async ({ postId, text }) => {
    return await API.addComment(postId, text);
  }
);

export const deleteComment = createAsyncThunk<{ commentId: string; postId: string }, string>(
    "deleteComment",
    async (commentId) => {
        return await API.deleteComment(commentId);
    }
);
