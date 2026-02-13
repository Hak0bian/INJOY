import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";

export const getNotifications = createAsyncThunk(
    "getNotifications",
    async () => {
        return await API.getNotifications();
    }
);

export const markAllAsRead = createAsyncThunk(
    "markAllAsRead",
    async () => {
        return await API.markNotificationsRead();
    }
);