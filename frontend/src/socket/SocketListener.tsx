import { useEffect } from "react";
import socket from "./socket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMessage, showToast } from "../store/messageSlice/messageSlice";
import { updateLastMessage } from "../store/conversationSlice/conversationSlice";

const SocketListener = () => {
    const dispatch = useAppDispatch();
    const { activeConversationId } = useAppSelector(state => state.messages);
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!user?._id) return;

        const handleNewMessage = (msg: any) => {

            // always update conversation lastMessage
            dispatch(updateLastMessage({
                conversationId: msg.conversationId,
                message: msg
            }));

            // if current open chat → add message directly
            if (msg.conversationId === activeConversationId) {

                dispatch(addMessage(msg));

                socket.emit("markSeen", msg.conversationId);

                return;
            }

            // otherwise show toast
            if (msg.sender !== user._id) {
                dispatch(showToast(msg));
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };

    }, [activeConversationId, user?._id]);

    return null;
};

export default SocketListener;