import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteConversationById, getConversations } from "../../store/conversationSlice/conversationThunks";
import { useNavigate, useParams } from "react-router-dom";
import ConversationItem from "../../components/message/ConversationItem";
import { hideToast } from "../../store/messageSlice/messageSlice";


const ConversationsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { conversations, loading } = useAppSelector((state) => state.conversations);
    const { user: currentUser } = useAppSelector((state) => state.auth);
    const { conversationId } = useParams<{ conversationId: string }>();

    useEffect(() => {
        dispatch(getConversations());
    }, []);

    useEffect(() => {
        dispatch(hideToast());
    }, [conversationId]);

    return (
        <div className="overflow-y-auto sm:bg-secondary min-h-screen h-full w-full lg:w-64 top-0 lg:fixed right-0 z-30">
            {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}

            {!loading && conversations.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10 text-gray-400">
                    <p className="text-lg font-semibold mb-2">No conversations yet</p>
                    <p className="text-sm text-center">Start a chat with someone to get connected!</p>
                </div>
            )}

            {!loading && conversations.some(c => c.lastMessage) && (
                conversations
                    .filter(c => c.lastMessage)
                    .map((c) => {
                        const otherUser = c.participants.find((p) => p._id !== currentUser?._id);
                        if (!otherUser) return null;

                        return (
                            <ConversationItem
                                key={c._id}
                                id={otherUser._id}
                                username={otherUser?.profile?.username || otherUser?.fullname!}
                                photo={otherUser?.profile?.photo ? `http://localhost:5000/${otherUser.profile.photo.replace("\\", "/")}` : undefined}
                                lastMessage={c.lastMessage}
                                createdAt={c?.lastMessage?.createdAt}
                                onClick={() => navigate(`/messages/${c._id}`)}
                                onDelete={() => dispatch(deleteConversationById(c._id))}
                            />
                        );
                    })
            )}
        </div>
    );
};

export default ConversationsPage;