import axios from "axios";
import type { IRegisterPayload, IAuthResponse, ILoginPayload, IUser } from "../types";

const API_URL = "http://localhost:5000/api/auth";
const instance = axios.create({
    baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const API = {
    register(payload: IRegisterPayload): Promise<IAuthResponse> {
        return instance.post("/register", payload).then(res => res.data);
    },

    login(payload: ILoginPayload): Promise<IAuthResponse> {
        return instance.post("/login", payload).then(res => res.data);
    },

    updateProfile(data: FormData) {
        return instance.post("/profile", data).then(res => res.data);
    },

    getMe(): Promise<{ user: IUser }> {
    return instance.get("/me").then(res => res.data);
}
};