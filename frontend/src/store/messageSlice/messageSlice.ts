import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteMessage, getMessages } from "./messageThunks";
import type { MessageState, IMessage } from "../storeTypes";

const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,
    activeConversationId: null,
    toastMessage: null
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setActiveConversation(state, action: PayloadAction<string>) {
            state.activeConversationId = action.payload;
            state.messages = [];
        },
        addMessage(state, action: PayloadAction<IMessage>) {
            state.messages.push(action.payload);
        },
        markSeen: (state, action: PayloadAction<{ conversationId: string; userId: string }>) => {
            const { conversationId, userId } = action.payload;

            state.messages = state.messages.map((msg) => {
                if (msg.conversationId !== conversationId) return msg;
                if (msg.seenBy?.includes(userId)) return msg;

                return {
                    ...msg,
                    seenBy: [...(msg.seenBy || []), userId],
                };
            });
        },
        deleteMessageLocal(state, action: PayloadAction<string>) {
            state.messages = state.messages.filter(m => m._id !== action.payload);
        },
        clearMessages(state) {
            state.messages = [];
        },
        showToast: (state, action) => {
            state.toastMessage = action.payload;
        },
        hideToast: (state) => {
            state.toastMessage = null;
        }
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

export const { setActiveConversation, addMessage, markSeen, deleteMessageLocal, clearMessages, showToast, hideToast } = messageSlice.actions;
export default messageSlice.reducer;