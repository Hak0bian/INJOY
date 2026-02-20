import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react';
import { getUserPosts } from '../../store/postSlice/postThunk';
import { useNavigate } from "react-router-dom";
import profile from '../../assets/images/profile.jpg'
import { getFollowCounts } from '../../store/followSlice/followersThunk';
import { GrBookmark } from 'react-icons/gr';
import { BiSolidEditAlt } from 'react-icons/bi';
import { TbLogout } from 'react-icons/tb';
import { logout } from '../../store/authSlice/authSlice';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { LuMessageSquareMore } from "react-icons/lu";


const MyProfileSm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { user, initialized } = useAppSelector(state => state.auth);
    const { posts } = useAppSelector((state) => state.posts);
    const { followersCount, followingCount } = useAppSelector(state => state.followers);
    const { unreadCount } = useAppSelector(state => state.notifications);
    const userId = user?.id || user?._id;

    useEffect(() => {
        if (!initialized) return;
        const userId = user?.id || user?._id;

        if (!userId) return;
        dispatch(getUserPosts(userId));
    }, [initialized, user?.id, user?._id, dispatch]);

    useEffect(() => {
        if (!initialized) return;

        const userId = user?.id || user?._id;
        if (!userId) return;

        dispatch(getUserPosts(userId));
        dispatch(getFollowCounts(userId));
    }, [initialized, user?.id, user?._id, dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/sign-in");
    };

    return (
        <div className='px-3 bg-secondary min-h-screen fixed top-0 left-0 w-64 z-10'>
            <div className='flex flex-col gap-2 pt-6'>
                {user?.profile?.username && <p className='text-center text-sm'>@{user.profile.username}</p>}
                <NavLink to='/my-profile' className="self-center">
                    <img
                        src={user?.profile?.photo ? `http://localhost:5000/${user?.profile?.photo.replace("\\", "/")}` : profile}
                        alt="profile image"
                        className='w-24 h-24 rounded-full object-cover'
                    />
                </NavLink>
                <h3 className='font-semibold'>{user?.fullname || ""}</h3>
                <p className='text-[12px]'>{user?.profile?.bio || ""}</p>
            </div>
            <div className='flex justify-center pt-5 pb-8'>
                <div className='px-3 border-r border-graytext text-center text-[14px]'>
                    <p>{posts.length}</p>
                    <p>Posts</p>
                </div>
                <NavLink to={`/user/${userId}/followers`} className='hover:text-btn duration-300'>
                    <div className='px-3 border-r border-graytext text-center text-[14px]'>
                        <p>{followersCount}</p>
                        <p>Followers</p>
                    </div>
                </NavLink>
                <NavLink to={`/user/${userId}/following`} className='hover:text-btn duration-300'>
                    <div className='px-3 text-center text-[14px]'>
                        <p>{followingCount}</p>
                        <p>Following</p>
                    </div>
                </NavLink>
            </div>

            <div className='flex flex-col gap-2 pt-5'>
                <NavLink to='/saved-posts' className='cursor-pointer flex items-center gap-2'>
                    <GrBookmark />
                    Saved Posts
                </NavLink>
                <NavLink to='/edit-profile' className='cursor-pointer flex items-center gap-2'>
                    <BiSolidEditAlt size={20} />
                    Edit Profile
                </NavLink>
                <NavLink to='/messages' className='cursor-pointer flex items-center gap-2 lg:hidden'>
                    <LuMessageSquareMore size={18} />
                    Messages
                </NavLink>
                <NavLink to='/notifications' className='cursor-pointer flex items-center gap-2 relative w-33'>
                    <IoMdNotificationsOutline size={20} />
                    Notifications
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-btn text-xs rounded-full px-1">
                            {unreadCount}
                        </span>
                    )}
                </NavLink>

                <button onClick={handleLogout} className="cursor-pointer text-red-500 flex items-center gap-2 pl-0.5">
                    <TbLogout size={20} />
                    Log Out
                </button>
            </div>

        </div>
    )
}

export default MyProfileSm