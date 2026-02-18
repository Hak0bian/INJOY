import profile from '../../assets/images/profile.jpg'
import { MdOutlineDelete } from "react-icons/md";
import { useAppSelector } from '../../store/hooks';
import type { IConversationItemProps } from '../../types';
import { formatDistanceToNow, format, differenceInHours } from "date-fns";

const ConversationItem = ({ id, username, photo, lastMessage, createdAt, isActive, onClick, onDelete }: IConversationItemProps) => {
    const { onlineUsers } = useAppSelector((state) => state.users);
    const { user: currentUser } = useAppSelector(state => state.auth);
    const isUnread = lastMessage && currentUser ? !lastMessage.seenBy?.includes(currentUser._id) : false;

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 p-3 cursor-pointer border-b border-secondary
                ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
        >
            <div className="relative">
                <img
                    src={photo ? photo : profile}
                    alt={username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                {onlineUsers.includes(id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-main" />
                )}
            </div>
            <div className="flex-1 w-full overflow-x-hidden text-[14px]">
                <p className="font-semibold">{username}</p>
                <p className={`truncate max-w-[60%] ${isUnread ? "font-semibold text-white" : "text-graytext"}`}>
                    {lastMessage?.text}
                </p>
            </div>

            <div className='flex items-center gap-4'>
                <p className="text-[12px] text-graytext">
                    {createdAt ? (() => {
                        const msgDate = new Date(createdAt);
                        const hoursDiff = differenceInHours(new Date(), msgDate);
                        if (hoursDiff < 24) {
                            return format(msgDate, "HH:mm");
                        } else {
                            return `${formatDistanceToNow(msgDate)} ago`;
                        }
                    })() : ""}
                </p>
                <button
                    className="cursor-pointer text-gray-500 text-[18px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <MdOutlineDelete />
                </button>
            </div>
        </div>
    );
};

export default ConversationItem;