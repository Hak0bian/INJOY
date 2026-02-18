import { useEffect } from "react";
import socket from "./socket";
import { useAppSelector } from "../store/hooks";

export const useJoinConversations = () => {
    const conversations = useAppSelector(state => state.conversations.conversations);

    useEffect(() => {
        conversations.forEach(conv => {
            socket.emit("joinConversation", conv._id);
        });
    }, [conversations]);
};