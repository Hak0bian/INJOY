import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteMessage, getMessages } from "./messageThunks";
import type { MessageState, Message } from "../storeTypes";


const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,
    activeConversationId: null,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setActiveConversation(state, action: PayloadAction<string>) {
            state.activeConversationId = action.payload;
            state.messages = [];
        },

        addMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },

        clearMessages(state) {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(
                    (msg) => msg._id !== action.payload
                );
            });
    },
});

export const { setActiveConversation, addMessage, clearMessages } =
    messageSlice.actions;

export default messageSlice.reducer;