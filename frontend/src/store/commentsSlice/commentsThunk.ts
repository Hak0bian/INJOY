import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";
import type { IComment } from "../storeTypes";


export const getComments = createAsyncThunk<IComment[], string>(
    "getComments",
    async (postId) => {
        return await API.getComments(postId);
    }
);

export const addComment = createAsyncThunk<
    { comment: IComment; totalComments: number },
    { postId: string; text: string; parent?: string }
>(
    "addComment",
    async ({ postId, text, parent }) => {
        return await API.addComment(postId, text, parent);
    }
);

export const deleteComment = createAsyncThunk<
    { commentId: string; postId: string; totalComments: number }, 
    string
>(
    "deleteComment",
    async (commentId) => {
        return await API.deleteComment(commentId);
    }
);