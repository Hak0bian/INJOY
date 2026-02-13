import { createSlice } from "@reduxjs/toolkit";
import { getNotifications, markAllAsRead } from "./notificationsThunk";

interface NotificationState {
    items: any[];
    unreadCount: number;
    loading: boolean;
}

const initialState: NotificationState = {
    items: [],
    unreadCount: 0,
    loading: false,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);

            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter((n: any) => !n.isRead).length;
            state.loading = false
        });
        builder.addCase(getNotifications.pending, (state) => {
            state.loading = true
        });

        builder.addCase(markAllAsRead.fulfilled, (state) => {
            state.items = state.items.map((n) => ({ ...n, isRead: true }));
            state.unreadCount = 0;
        });
    },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;