import { NavLink } from 'react-router-dom'
import profile from '../../assets/images/profile.jpg'

import post1 from '../../assets/images/post1.jpg'
import post2 from '../../assets/images/post2.jpg'
import post3 from '../../assets/images/post3.jpg'
import post4 from '../../assets/images/post4.jpg'


const MyProfile = () => {
    return (
        <div className='pt-10 pb-30 px-5'>
            <div className='flex flex-col gap-2'>
                <p className='text-center text-[14px]'>_username_</p>
                <img src={profile} alt="profile image" className='w-24 h-24 rounded-full self-center' />
                <h3 className='font-semibold'>User Name</h3>
                <p className='text-[12px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quidem, numquam temporibus quis inventore ullam dolor voluptates nesciunt deleniti fugit?</p>
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
        </div>
    )
}

export default MyProfile