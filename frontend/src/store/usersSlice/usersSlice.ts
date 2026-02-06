import { createSlice } from "@reduxjs/toolkit";
import { followUser, getUserById, searchUsers } from "./usersThunk";
import type { UsersState } from "../storeTypes";


const initialState: UsersState = {
  otherUser: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  searchError: null

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
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.otherUser = {
          ...action.payload,
          isFollowing: action.payload.isFollowing ?? false,
        };
      })

    builder
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      });

  },
})

export default userSlice.reducer;