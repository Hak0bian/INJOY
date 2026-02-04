import { NavLink } from "react-router-dom"
import { GrHomeRounded } from "react-icons/gr";
import { FaCirclePlus } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";

const BottomNavigation = () => {
    return (
        <div className="flex justify-between items-center px-5 py-2 fixed bottom-0 left-0 right-0 z-10 bg-main">
            <NavLink to='/' className='text-[20px]'>
                <GrHomeRounded />
            </NavLink>
            <NavLink to='/search' className='text-[20px]'>
                <BsSearch />
            </NavLink>
            <NavLink to='add-post' className='text-[32px] text-btn'>
                <FaCirclePlus />
            </NavLink>
            <NavLink to='messages' className='text-[22px]'>
                <LuMessagesSquare />
            </NavLink>
            <NavLink to='/my-profile' className='text-[20px]'>
                <FaRegUser />
            </NavLink>
        </div>
    )
}

export default BottomNavigation