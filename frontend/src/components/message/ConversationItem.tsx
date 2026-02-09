import profile from '../../assets/images/profile.jpg'
import { MdOutlineDelete } from "react-icons/md";

interface IConversationItemProps {
    username: string;
    photo?: string;
    lastMessage?: string;
    isActive?: boolean;
    onClick: () => void;
    onDelete: () => void;
}

const ConversationItem = ({ username, photo, lastMessage, isActive, onClick, onDelete }: IConversationItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 p-3 cursor-pointer border-b border-secondary 
                ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
        >
            <img
                src={photo ? photo : profile}
                alt={username}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 w-full overflow-x-hidden">
                <p className="font-semibold text-[14px]">{username}</p>
                <p className="text-gray-400 text-sm truncate text-[12px] max-w-[50%]">{lastMessage}</p>
            </div>

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
    );
};

export default ConversationItem;