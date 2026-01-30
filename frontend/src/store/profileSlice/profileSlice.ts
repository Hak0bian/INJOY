import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "./profileThunk";
import type { IProfileState } from "../../types";

const initialState: IProfileState = {
    loading: false,
    error: null,
    initialized: false
}

const profileSlice = createSlice({
    name: "profileSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(updateProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
})

export default profileSlice.reducer;