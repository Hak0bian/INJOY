import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "./profileThunk";

const initialState = {
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
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.payload as string;
            });

    },
})

export default profileSlice.reducer;