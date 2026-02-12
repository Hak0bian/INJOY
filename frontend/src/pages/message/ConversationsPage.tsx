import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteConversationById, getConversations } from "../../store/conversationSlice/conversationThunks";
import { useNavigate, useParams } from "react-router-dom";
import ConversationItem from "../../components/message/ConversationItem";
import { FaArrowLeft } from "react-icons/fa6";
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
        <div className="overflow-y-auto pt-12">

            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-5 py-2 border-b border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h2 className="text-[18px]">Messages</h2>
            </div>

            {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}

            {conversations
                .filter(c => c.lastMessage)
                .map((c) => {
                    const otherUser = c.participants.find((p) => p._id !== currentUser?._id);
                    if (!otherUser) return null;

                    return (
                        <ConversationItem
                            key={c._id}
                            id={otherUser?._id}
                            username={otherUser?.profile?.username || otherUser?.fullname!}
                            photo={otherUser?.profile?.photo ? `http://localhost:5000/${otherUser.profile.photo.replace("\\", "/")}` : undefined}
                            lastMessage={c?.lastMessage}
                            createdAt={c?.lastMessage?.createdAt}
                            onClick={() => navigate(`/messages/${c._id}`)}
                            onDelete={() => dispatch(deleteConversationById(c._id))}
                        />
                    );
                })}
        </div>
    );
};

export default ConversationsPage;