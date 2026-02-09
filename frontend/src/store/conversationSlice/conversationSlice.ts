import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteConversationById, getConversationById, getConversations } from "./conversationThunks";
import type { Conversation, ConversationState, Participant } from "../storeTypes";


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

        addConversation(state, action: PayloadAction<Conversation>) {
            const exists = state.conversations.find(
                (c) => c._id === action.payload._id
            );
            if (!exists) {
                state.conversations.unshift(action.payload);
            }
        },

        updateLastMessage(
            state,
            action: PayloadAction<{ conversationId: string; text: string; sender: Participant }>
        ) {
            const convo = state.conversations.find(
                (c) => c._id === action.payload.conversationId
            );
            if (convo) {
                convo.lastMessage = {
                    text: action.payload.text,
                    sender: action.payload.sender,
                    createdAt: new Date().toISOString(),
                };
                state.conversations = [
                    convo,
                    ...state.conversations.filter((c) => c._id !== convo._id),
                ];
            }
        },
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

export const { setActiveConversation, addConversation, updateLastMessage } = conversationSlice.actions;
export default conversationSlice.reducer;