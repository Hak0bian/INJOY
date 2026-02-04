import axios from "axios";
import type { IUser, IPost, ILikePostResponse } from "../types";
import type { IRegisterPayload, ILoginPayload, IAuthResponse, IComment } from "../store/storeTypes"

const BASE_URL = "http://localhost:5000/api";
const instance = axios.create({
    baseURL: BASE_URL,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        } as any;
    }
    return config;
});


export const API = {
    // Auth
    register(payload: IRegisterPayload) {
        return instance.post<IAuthResponse>("/auth/register", payload).then(res => res.data);
    },

    login(payload: ILoginPayload) {
        return instance.post<IAuthResponse>("/auth/login", payload).then(res => res.data);
    },

    getMe() {
        return instance.get<{ user: IUser }>("/auth/me").then(res => res.data);
    },

    updateProfile(data: FormData) {
        return instance.post<{ user: IUser }>("/profile", data).then(res => res.data);
    },

    // Posts
    getPost(postId: string) {
        return instance.get<IPost>(`/posts/${postId}`).then(res => res.data);
    },
    getUserPosts(userId: string) {
        return instance.get<{ posts: IPost[] }>(`/posts/user/${userId}`).then(res => res.data);
    },

    createPost(data: FormData) {
        return instance.post<{ post: IPost }>("/posts", data).then(res => res.data);
    },

    updatePostText(postId: string, text: string) {
        return instance.patch<{ post: IPost }>(`/posts/${postId}`, { text }).then(res => res.data);
    },

    deletePost(postId: string) {
        return instance.delete(`/posts/${postId}`).then(() => { });
    },

    likePost(postId: string) {
        return instance.post<ILikePostResponse>(`/posts/${postId}/like`).then(res => res.data);
    },


    // Users 
    getUser(userId: string) {
        return instance.get<IUser>(`/user/${userId}`).then(res => res.data);
    },

    followUser(userId: string) {
        return instance.post<{ success: boolean; following: boolean; followersCount: number }>(
            `/user/${userId}/follow`
        ).then(res => res.data);
    },

    getFollowers: (userId: string) => {
        return instance.get(`/user/${userId}/followers`)
    },

    getFollowing: (userId: string) => {
        return instance.get(`/user/${userId}/following`)
    },

    getFollowCounts: async (userId: string) => {
        const res = await instance.get(`/user/${userId}/follow-counts`);
        return res.data;
    },

    // Comments
    getComments(postId: string) {
        return instance.get<IComment[]>(`/comments/${postId}`).then(res => res.data);
    },

    addComment(postId: string, text: string) {
        return instance.post<{ comment: IComment; commentsCount: number }>(`/comments/${postId}`, { text }).then(res => res.data);
    },

    deleteComment: async (commentId: string) => {
        return instance.delete(`/comments/${commentId}`).then(res => res.data);
    },


};
