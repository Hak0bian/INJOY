import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { followUser, getUserById, searchUsers } from "./usersThunk";
import type { UsersState } from "../storeTypes";


const initialState: UsersState = {
  otherUser: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  searchError: null,
  onlineUsers: []
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        id => id !== action.payload
      );
    },
  },
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
export const { addOnlineUser, removeOnlineUser } = userSlice.actions;