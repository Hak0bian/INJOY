import { Dialog, DialogContent, IconButton } from '@mui/material';
import { IoCloseOutline } from "react-icons/io5";
import { logout } from '../../store/authSlice/authSlice'
import { useAppDispatch } from '../../store/hooks';
import { NavLink, useNavigate } from 'react-router-dom';


const SettingsModal = ({ open, onClose }: { open: boolean; onClose: () => void; }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/sign-in");
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogContent sx={{ position: "relative", p: 0 }}>
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 0, right: 0, color: "white" }}>
                    <IoCloseOutline size={24} />
                </IconButton>

                <div className='min-h-60 text-center pt-10 bg-secondary text-white text-[14px] flex flex-col gap-4 items-center'>
                    <h3 className='text-[20px] font-semibold mb-5'>Settings</h3>
                    <button className='border-2 border-btn rounded-lg w-30 h-8 cursor-pointer'>
                        <NavLink to='/edit-profile'>
                            Edit Profile
                        </NavLink>
                    </button>
                    <button onClick={handleLogout} className="bg-btn rounded-lg w-30 h-8 cursor-pointer">Log Out</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;