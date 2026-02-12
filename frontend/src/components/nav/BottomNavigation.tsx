import { NavLink } from "react-router-dom"
import { GrHomeRounded } from "react-icons/gr";
import { FaCirclePlus } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { getConversations } from "../../store/conversationSlice/conversationThunks";
import { useMemo } from "react";

const BottomNavigation = () => {
    const dispatch = useAppDispatch()
    const { conversations } = useAppSelector((state) => state.conversations);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getConversations());
    }, [])

    const unreadChatsCount = useMemo(() => {
        return conversations.filter((conv) => {
            const lastMsg = conv.lastMessage;
            if (!lastMsg) return false;
            const isMine = lastMsg.sender === user?._id;
            const isSeen = user?._id && lastMsg.seenBy?.includes(user?._id);
            return !isMine && !isSeen;
        }).length;
    }, [conversations, user?._id]);


    return (
        <div className="flex justify-between items-center px-5 py-2 fixed bottom-0 left-0 right-0 z-10 bg-main">
            <NavLink to='/' className='text-[20px]'>
                <GrHomeRounded />
            </NavLink>
            <NavLink to='/search' className='text-[20px]'>
                <BsSearch />
            </NavLink>
            <NavLink to='/add-post' className='text-[32px] text-btn'>
                <FaCirclePlus />
            </NavLink>
            <div className="relative">
                <NavLink to='/messages' className='text-[22px]'>
                    <LuMessagesSquare />
                    {unreadChatsCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-btn text-white text-[12px] px-1.5 rounded-full">
                            {unreadChatsCount}
                        </span>
                    )}
                </NavLink>
            </div>
            <NavLink to='/my-profile' className='text-[20px]'>
                <FaRegUser />
            </NavLink>
        </div>
    )
}

export default BottomNavigation