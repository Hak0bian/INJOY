import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { hideToast } from "../../store/messageSlice/messageSlice";
import { useEffect, useRef, useState } from "react";
import { API } from "../../api/api";
import profile from "../../assets/images/profile.jpg";
import toastSoundFile from '../../assets/sounds/message.mp3';
import { format } from "date-fns";


const MessageToast = ({ message }: { message: any }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [senderInfo, setSenderInfo] = useState<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isMessagesSection = location.pathname.startsWith("/messages");
    const shouldRender = !!message && !isMessagesSection;

    useEffect(() => {
        if (!message?.sender) return;

        const fetchUser = async () => {
            try {
                const res = await API.getUser(message.sender);
                setSenderInfo(res);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, [message?.sender]);

    useEffect(() => {
        if (!shouldRender) return;

        const timer = setTimeout(() => {
            dispatch(hideToast());
        }, 4000);

        return () => clearTimeout(timer);
    }, [shouldRender, dispatch]);

    useEffect(() => {
        if (!shouldRender) return;

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 1;
            audioRef.current.play().catch(err => {
                console.log("Autoplay blocked:", err);
            });
        }
    }, [shouldRender, message?._id]);

    const handleClick = () => {
        if (!message) return;
        navigate(`/messages/${message.conversationId}`);
        dispatch(hideToast());
    };

    return (
        <>
            <audio ref={audioRef} src={toastSoundFile} preload="auto" />

            {shouldRender && senderInfo && (
                <div
                    onClick={handleClick}
                    className="fixed top-2 right-2 left-2 z-60 bg-secondary border border-btn rounded-2xl p-3 cursor-pointer animate-slideIn"
                >
                    <div className="flex gap-2 items-center">
                        <img
                            src={
                                senderInfo?.profile?.photo
                                    ? `http://localhost:5000/${senderInfo.profile.photo.replace("\\", "/")}`
                                    : profile
                            }
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="w-full flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm ">
                                    {senderInfo?.profile?.username ||
                                        senderInfo?.fullname ||
                                        "Unknown User"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {message.text}
                                </p>
                            </div>
                            <p className="text-[12px] text-gray-400 tracking-wide">{format(message?.createdAt, "HH:mm")}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageToast;