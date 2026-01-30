import axios from "axios";
import type {
    IRegisterPayload,
    ILoginPayload,
    IAuthResponse,
    IUser,
    IPost,
} from "../types";

const AUTH_URL = "http://localhost:5000/api/auth";
const POSTS_URL = "http://localhost:5000/api/posts";


const authInstance = axios.create({
    baseURL: AUTH_URL,
});


const postsInstance = axios.create({
    baseURL: POSTS_URL,
});

postsInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const API = {

    register(payload: IRegisterPayload): Promise<IAuthResponse> {
        return authInstance.post("/register", payload).then((res) => res.data);
    },

    login(payload: ILoginPayload): Promise<IAuthResponse> {
        return authInstance.post("/login", payload).then((res) => res.data);
    },

    updateProfile(data: FormData) {
        return authInstance.post("/profile", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((res) => res.data);
    },


    getMe(): Promise<{ user: IUser }> {
        return authInstance.get("/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((res) => res.data);
    },


    getUserPosts(userId: string): Promise<{ posts: IPost[] }> {
        return postsInstance.get(`/user/${userId}`).then((res) => res.data);
    },

    createPost(data: FormData): Promise<{ post: IPost }> {
        return postsInstance.post("/", data).then((res) => res.data);
    },

    updatePostText(postId: string, text: string) {
        return postsInstance.patch(`/${postId}`, { text }).then(res => res.data);
    },

    deletePost(postId: string): Promise<void> {
        return postsInstance.delete(`/${postId}`).then(() => { });
    },
};
