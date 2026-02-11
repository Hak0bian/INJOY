import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteConversationById, getConversationById, getConversations } from "./conversationThunks";
import type { IConversation, ConversationState, ILastMessage } from "../storeTypes";


const initialState: ConversationState = {
    conversations: [],
    currentConversation: null,
    loading: false,
    error: null,
    activeConversationId: null,
};

const conversationSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        setActiveConversation(state, action: PayloadAction<string>) {
            state.activeConversationId = action.payload;
        },
        addConversation(state, action: PayloadAction<IConversation>) {
            const exists = state.conversations.find(
                (c) => c._id === action.payload._id
            );
            if (!exists) {
                state.conversations.unshift(action.payload);
            }
        },
        updateLastMessage(state, action: PayloadAction<{ conversationId: string; message: ILastMessage }>) {
            const convo = state.conversations.find(c => c._id === action.payload.conversationId);
            if (convo) {
                convo.lastMessage = action.payload.message;
                state.conversations = [
                    convo,
                    ...state.conversations.filter(c => c._id !== convo._id),
                ];
            }
        },
        markConversationSeen(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
            const { conversationId, userId } = action.payload;
            const convo = state.conversations.find(c => c._id === conversationId);

            if (!convo?.lastMessage) return;
            if (!convo.lastMessage.seenBy.includes(userId)) {
                convo.lastMessage.seenBy.push(userId);
            }
        },
        removeLastIfDeleted(state, action: PayloadAction<{ messageId: string; conversationId: string }>) {
            const { conversationId, messageId } = action.payload;
            const convo = state.conversations.find(c => c._id === conversationId);

            if (!convo?.lastMessage) return;
            if (convo.lastMessage._id === messageId) {
                convo.lastMessage = undefined;
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getConversations.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(getConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(getConversationById.pending, (state) => {
                state.loading = true;
                state.currentConversation = null;
            })
            .addCase(getConversationById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConversation = action.payload;
            })
            .addCase(getConversationById.rejected, (state) => {
                state.loading = false;
                state.currentConversation = null;
            })

            .addCase(deleteConversationById.fulfilled, (state, action) => {
                state.conversations = state.conversations.filter(
                    (c) => c._id !== action.payload
                );

                if (state.currentConversation?._id === action.payload) {
                    state.currentConversation = null;
                }
            });
    },
});

export const { setActiveConversation, addConversation, updateLastMessage, markConversationSeen, removeLastIfDeleted } = conversationSlice.actions;
export default conversationSlice.reducer;