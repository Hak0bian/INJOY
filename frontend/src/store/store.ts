import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import postReducer from "./postSlice/postSlice"
import usersReducer from "./usersSlice/usersSlice"
import followersReducer from "./followSlice/followersSlice"
import commentsReducer from "./commentsSlice/commentsSlice"
import savedReducer from "./SavedSlice/SavedSlice"
import messageReducer from "./messageSlice/messageSlice";
import conversationReducer from "./conversationSlice/conversationSlice";
import notificationsReducer from "./notificationsSlice/notificationsSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        users: usersReducer,
        followers: followersReducer,
        comments: commentsReducer,
        saved: savedReducer, 
        messages: messageReducer,
        conversations: conversationReducer,
        notifications: notificationsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch