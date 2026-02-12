import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteMessage, getMessages } from "../../store/messageSlice/messageThunks";
import { hideToast, setActiveConversation } from "../../store/messageSlice/messageSlice";
import { formatDistanceToNow, format, differenceInHours } from "date-fns";
import { BiSend } from "react-icons/bi";
import { getConversationById } from "../../store/conversationSlice/conversationThunks";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import socket from "../../socket/socket";
import profile from '../../assets/images/profile.jpg';


const ChatPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { conversationId } = useParams<{ conversationId: string }>();
    const { messages, loading } = useAppSelector(state => state.messages);
    const { user: currentUser } = useAppSelector(state => state.auth);
    const [text, setText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const { currentConversation } = useAppSelector(state => state.conversations);
    const otherUser = currentConversation?.participants.find(p => p._id !== currentUser?._id);

    const { onlineUsers } = useAppSelector(state => state.users);
    const isOnline = onlineUsers.includes(otherUser?._id!);
    const lastMyMessage = [...messages].reverse().find(msg => msg.sender === currentUser?._id);

    const scrollToBottom = () => {
        const messagesEl = containerRef.current;
        const parentEl = parentRef.current;
        if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
        if (parentEl) parentEl.scrollTop = parentEl.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
    };

    useEffect(() => {
        requestAnimationFrame(scrollToBottom);
    }, [messages]);

    useEffect(() => {
        if (conversationId) {
            dispatch(hideToast());
        }
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const handleNewMessage = (msg: any) => {
            if (msg.conversationId === conversationId) {
                dispatch({ type: "messages/addMessage", payload: msg });
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;
        socket.emit("joinConversation", conversationId);
        dispatch({ type: "conversations/markConversationSeen", payload: { conversationId, userId: currentUser?._id } });
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId || messages.length === 0 || !currentUser) return;
        const lastMessage = messages[messages.length - 1];
        const isMine = lastMessage.sender === currentUser._id;

        if (!isMine) {
            socket.emit("markSeen", conversationId);
        }
    }, [conversationId, messages.length, currentUser]);

    useEffect(() => {
        if (!conversationId) return;
        dispatch(getConversationById(conversationId));
        dispatch(setActiveConversation(conversationId));
        dispatch(getMessages(conversationId));
    }, [conversationId]);

    const sendMessage = () => {
        if (!text.trim() || !conversationId) return;
        socket.emit("sendMessage", { conversationId, text });
        setText("");
    };

    return (
        <div ref={parentRef} className="flex flex-col h-screen">
            <div className="fixed top-0 left-0 right-0 z-10 bg-main flex items-center gap-3 px-5 border-b-2 border-secondary h-14">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <NavLink to={`/user/${otherUser?._id}`} className='w-full'>
                    <div className="flex items-center gap-2 py-2">
                        <img
                            src={otherUser?.profile?.photo ? `http://localhost:5000/${otherUser.profile.photo.replace("\\", "/")}` : profile}
                            alt={otherUser?.profile?.username || otherUser?.fullname}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="font-semibold text-sm">{otherUser?.profile?.username || otherUser?.fullname}</p>
                            <div className="flex items-center gap-1">
                                <span className={`w-2 h-2 mt-0.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`} />
                                <p className="text-xs text-gray-400">{isOnline ? "online" : "offline"}</p>
                            </div>
                        </div>
                    </div>
                </NavLink>
            </div>

            <div ref={containerRef} className="flex-1 flex flex-col gap-2 p-3 py-20 overflow-y-auto">
                {loading && <p className="text-center text-graytext">Loading...</p>}

                {messages.map((msg, ind) => {
                    const isMine = msg.sender === currentUser?._id;
                    const isUnread = currentUser && !msg.seenBy.includes(currentUser._id) && !isMine;

                    return (
                        <div key={msg._id + ind} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-col ${isMine ? "items-end" : "items-baseline"}`}>
                                <p className="text-[10px] text-graytext mb-1">
                                    {(() => {
                                        const msgDate = new Date(msg.createdAt);
                                        const hoursDiff = differenceInHours(new Date(), msgDate);
                                        if (hoursDiff < 24) {
                                            return format(msgDate, "HH:mm");
                                        } else {
                                            return `${formatDistanceToNow(msgDate)} ago`;
                                        }
                                    })()}
                                </p>
                                <div className="flex gap-1 items-center">
                                    {isMine && (
                                        <button
                                            onClick={() => dispatch(deleteMessage(msg._id))}
                                            className="text-graytext hover:text-red-500 text-[12px] cursor-pointer"
                                        >
                                            <MdDelete />
                                        </button>
                                    )}
                                    <div
                                        className={`max-w-60 px-3 py-1 rounded-lg wrap-break-word 
                                        ${isMine ? "bg-blue-600 text-right" : isUnread ? "bg-gray-700" : "bg-gray-700 text-left"}
                                    `}>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                                {
                                    isMine && lastMyMessage?._id === msg._id && otherUser?._id && msg.seenBy?.includes(otherUser._id) &&
                                    (<p className="text-[10px] text-gray-400 mt-1">Seen</p>)
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="fixed bottom-12 left-0 right-0 bg-main pt-2 h-12">
                <div className="flex gap-2 border-2 rounded-full mx-2 border-secondary">
                    <input
                        className="w-full h-9 pl-3 outline-none placeholder:text-sm placeholder:font-light placeholder:tracking-wide"
                        placeholder="Write message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className="text-btn text-[22px] cursor-pointer px-3">
                        <BiSend />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;