import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteMessage, getMessages } from "../../store/messageSlice/messageThunks";
import { setActiveConversation } from "../../store/messageSlice/messageSlice";
import { formatDistanceToNow } from "date-fns";
import { BiSend } from "react-icons/bi";
import { getConversationById } from "../../store/conversationSlice/conversationThunks";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import socket from "../../socket/socket";
import profile from '../../assets/images/profile.jpg'


const ChatPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { conversationId } = useParams<{ conversationId: string }>();
    const { messages, loading } = useAppSelector((state) => state.messages);
    const { user: currentUser } = useAppSelector((state) => state.auth);
    const [text, setText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const { currentConversation } = useAppSelector((state) => state.conversations);
    const otherUser = currentConversation?.participants.find((p: any) => p._id !== currentUser?._id);

    useEffect(() => {
        if (!conversationId) return;
        dispatch(getConversationById(conversationId));
        dispatch(setActiveConversation(conversationId));
        dispatch(getMessages(conversationId));

        socket.emit("joinConversation", conversationId);
        socket.on("newMessage", (msg) => {
            if (msg.conversationId === conversationId) {
                dispatch({ type: "messages/addMessage", payload: msg });
            }
        });

        return () => {
            socket.off("newMessage");
        };
    }, [conversationId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!text.trim() || !conversationId) return;

        socket.emit("sendMessage", { conversationId, text });
        setText("");
    };


    return (
        <div className="flex flex-col pb-20">
            <div className="fixed top-0 left-0 right-0 z-10 bg-main flex items-center gap-3 px-5 border-b-2 border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <NavLink to={`/user/${otherUser?._id}`} className='w-full'>
                    <div className="flex items-center gap-2 py-2">
                        <img
                            src={otherUser?.profile?.photo
                                ? `http://localhost:5000/${otherUser.profile.photo.replace("\\", "/")}`
                                : profile}
                            alt={otherUser?.profile?.username || otherUser?.fullname}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="font-semibold text-sm">{otherUser?.profile?.username || otherUser?.fullname}</p>
                            <p className="text-[12px] text-gray-500">{otherUser?.fullname || ""}</p>
                        </div>
                    </div>
                </NavLink>
            </div>

            <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto mt-15">
                {loading && <p className="text-center text-white">Loading...</p>}

                {messages.map((msg) => {
                    const isMine = msg.sender === currentUser?._id;
                    return (
                        <div key={msg._id} ref={scrollRef} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>

                                <div className={`flex flex-col ${isMine ? "items-end" : "items-baseline"}`}>
                                    <div className="flex gap-1 items-center">
                                        {isMine && (
                                            <button
                                                onClick={() =>  dispatch(deleteMessage(msg?._id))}
                                                className="text-graytext hover:text-red-500 text-[14px] cursor-pointer"
                                            >
                                                <MdDelete />
                                            </button>
                                        )}
                                        <div className={`max-w-60 px-3 py-1 rounded-lg wrap-break-word 
                                                ${isMine ? "bg-blue-600 text-right" : "bg-gray-700 text-left"
                                            }`}
                                        >
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-graytext mt-1">{formatDistanceToNow(new Date(msg.createdAt))} ago</p>
                                </div>
                        </div>
                    );
                })}
            </div>

            <div className="fixed bottom-12 left-0 right-0 bg-main pt-2">
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