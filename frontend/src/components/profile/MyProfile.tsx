import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { getUserPosts } from '../../store/postSlice/postThunk';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import profile from '../../assets/images/profile.jpg'


const MyProfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth);
    const { posts } = useAppSelector((state) => state.posts);
    const [openSettings, setOpenSettings] = useState(false)

    useEffect(() => {
        if (user?.id) {
            dispatch(getUserPosts(user.id));
        }
    }, [user, dispatch]);

    return (
        <div className='pt-5 pb-30 px-5'>
            <div className='text-right'>
                <button onClick={() => setOpenSettings(true)} className='cursor-pointer'>
                    <IoSettingsOutline className='w-5 h-5' />
                </button>
            </div>

            <div className='flex flex-col gap-2 pt-6'>
                <p className='text-center text-[14px]'>{user?.profile?.username}</p>
                <img
                    src={user?.profile?.photo ? `http://localhost:5000/${user?.profile?.photo.replace("\\", "/")}` : profile}
                    alt="profile image"
                    className='w-24 h-24 rounded-full self-center object-cover'
                />
                <h3 className='font-semibold'>{user?.fullname || ""}</h3>
                <p className='text-[12px]'>{user?.profile?.bio || ""}</p>
            </div>
            <div className='flex justify-center pt-5 pb-10'>
                <div className='px-5 border-r border-graytext text-center text-[14px]'>
                    <p>54</p>
                    <p>Posts</p>
                </div>
                <NavLink to='/followers' className='hover:text-btn duration-300'>
                    <div className='px-5 border-r border-graytext text-center text-[14px]'>
                        <p>4564</p>
                        <p>Followers</p>
                    </div>
                </NavLink>
                <NavLink to='/following' className='hover:text-btn duration-300'>
                    <div className='px-5 text-center text-[14px]'>
                        <p>700</p>
                        <p>Following</p>
                    </div>
                </NavLink>
            </div>

            {/* Posts */}
            <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                    <div key={post._id} className="aspect-4/5 w-full overflow-hidden bg-black">
                        {post.image && 
                        <img 
                            src={`http://localhost:5000/${post.image}`} 
                            className="w-full h-full object-cover" 
                            onClick={() => navigate(`/posts/${post._id}`)}
                        />}
                    </div>
                ))}
            </div>

            <Settings open={openSettings} onClose={() => setOpenSettings(false)} />
        </div>
    )
}

export default MyProfile