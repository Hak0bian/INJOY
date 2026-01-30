import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice/authSlice";
import { IoCloseOutline } from "react-icons/io5";


const Settings = ({ open, onClose }: { open: boolean; onClose: () => void; }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/sign-in");
        onClose();
    };

    return (
        <>
            {open && (<div onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-10"/>)}
            <div
                className={
                    `fixed top-0 right-0 z-15 w-60 h-screen bg-secondary transition-transform duration-300 ease-in-out border-l border-gray-500
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className='p-5 flex flex-col items-baseline gap-2'>
                    <div className="w-full flex justify-between items-center mb-5">
                        <h3 className='text-[20px] font-semibold'>Settings</h3>
                        <button onClick={onClose} className="cursor-pointer">
                            <IoCloseOutline className="text-[22px]" />
                        </button>
                    </div>

                    <NavLink to='/edit-profile' onClick={onClose} className='cursor-pointer'>
                        Edit Profile
                    </NavLink>

                    <button onClick={handleLogout} className="cursor-pointer text-red-500">
                        Log Out
                    </button>
                </div>
            </div>
        </>
    )
}


export default Settings