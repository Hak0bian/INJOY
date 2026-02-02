import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../types";
import { followUser, getUserById } from "./usersThunk";

interface UsersState {
  otherUser: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  otherUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        if (!state.otherUser) return;

        const { following, currentUserId } = action.payload;

        state.otherUser.isFollowing = following;

        if (following) {
          state.otherUser.followers?.push(currentUserId);
        } else {
          state.otherUser.followers =
            state.otherUser.followers?.filter(id => id !== currentUserId) ?? [];
        }
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.otherUser = {
          ...action.payload,
          isFollowing: action.payload.isFollowing ?? false,
        };
      });
  },
})

export default userSlice.reducer;