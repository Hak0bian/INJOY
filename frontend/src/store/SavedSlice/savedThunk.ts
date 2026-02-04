import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";
import type { IPost, IUser } from "../../types";


export const getSavedPosts = createAsyncThunk<{ post: IPost; user: IUser }[], { postId: string; userId: string }[]>(
    "getSavedPosts",
    async (savedItems) => {
        const promises = savedItems.map(async (item) => {
            const postRes = await API.getPost(item.postId);
            const userRes = await API.getUser(item.userId);

            return {
                post: postRes.post,
                user: userRes,
            };
        });

        return Promise.all(promises);
    }
);