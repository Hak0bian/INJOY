import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import postReducer from "./postSlice/postSlice"
import usersReducer from "./usersSlice/usersSlice"
import followersReducer from "./followSlice/followersSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        users: usersReducer,
        followers: followersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch