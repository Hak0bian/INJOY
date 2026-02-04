import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";


export const createPost = createAsyncThunk(
  "createPost",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await API.createPost(data);
      return res.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Create post failed");
    }
  }
);


export const getUserPosts = createAsyncThunk(
  "getUserPosts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await API.getUserPosts(userId);
      return res.posts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Fetch posts failed");
    }
  }
);


export const updatePostText = createAsyncThunk(
  "updatePostText",
  async ({ postId, text }: { postId: string; text: string }, { rejectWithValue }) => {
    try {
      const res = await API.updatePostText(postId, text);
      return res.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);


export const deletePost = createAsyncThunk(
  "deletePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await API.deletePost(postId);
      return postId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


export const likePost = createAsyncThunk<{ postId: string; liked: boolean; likes: string[] }, string, { rejectValue: string }>(
  "likePost",
  async (postId, { rejectWithValue }) => {
    try {
      return await API.likePost(postId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);