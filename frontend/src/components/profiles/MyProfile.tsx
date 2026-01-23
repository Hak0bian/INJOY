import { NavLink } from 'react-router-dom'
import profile from '../../assets/images/profile.jpg'
import { useAppSelector } from '../../store/hooks'
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from 'react';
import SettingsModal from './SettingsModal';

import post1 from '../../assets/images/post1.jpg'
import post2 from '../../assets/images/post2.jpg'
import post3 from '../../assets/images/post3.jpg'
import post4 from '../../assets/images/post4.jpg'

const MyProfile = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [openSettings, setOpenSettings] = useState(false)

    return (
        <div className='pt-5 pb-30 px-5'>
            <div className='text-right'>
                <button onClick={() => setOpenSettings(true)} className='cursor-pointer'>
                    <IoSettingsOutline className='w-5 h-5'/>
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
                {[post1, post2, post3, post4].map((post, i) => (
                    <div key={i} className="aspect-4/5 w-full overflow-hidden bg-black">
                        <img src={post} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            <SettingsModal
                open={openSettings}
                onClose={() => setOpenSettings(false)}
            />
        </div>
    )
}

export default MyProfile